import { formatMessage } from "../utils/message.js";
import { getRoomCodeFromUrl } from "../utils/url.js";
import { lobby } from "../socket.js";
import CatchMindGame from "../game.js";
import { deleteRoom, getWordsOfRoom } from "../query/roomQuery.js";
import { redisClient } from "../redis_client.js";
import {
  changeRoomStatus,
  getRoomStatus,
  getUserListOfRoom,
  onStartGameRedis,
  onUserJoinRoomRedis,
  onUserLeaveRoomRedis,
} from "../redis/roomQuery.js";
import { ROOM_STATUS } from "../constants/status.js";

export default function setupRoomSocket(room) {
  room.on("connection", async (socket) => {
    socket.use((__, next) => {
      socket.request.session.reload((err) => {
        if (err) {
          console.log("session reload error", err);
          // TODO: 만약에 session 연결이 안되었으면 redirect.
          socket.disconnect();
        } else {
          next();
        }
      });
    });

    const roomCode = Number(getRoomCodeFromUrl(socket));
    socket.join(roomCode);

    const session = socket.request.session;
    session.username = session.username || "Guest";
    const username = session.username;
    session.save();

    let game;

    try {
      const roomStatus = await getRoomStatus(roomCode);
      if (roomStatus === ROOM_STATUS.ERROR) {
        throw new Error("Room Status Error");
      }
      socket.emit("update_room_status", roomStatus);
      const cnt = await onUserJoinRoomRedis(
        roomCode,
        session.id,
        session.username
      );
      if (cnt === -1) {
        throw new Error("onUserJoinRoomRedis Error");
      }
      lobby.emit("update_room", {
        code: roomCode,
        currentUserCount: cnt,
      });
    } catch (err) {
      console.log(err);
      socket.emit("alert", { msg: "방에 들어갈 수 없습니다." });
      socket.emit("redirect", "/");
      socket.disconnect();
      return;
    }

    socket.emit("set_name", { name: username });

    socket.emit("message", {
      msg: formatMessage("system", `${username} 님 어서오세요`),
      type: "system",
    });

    const userlist = await getUserListOfRoom(roomCode);

    if (!userlist) {
      console.log("userlist is null");
      return;
    }

    room.to(roomCode).emit("update_users", userlist);

    socket.to(roomCode).emit("message", {
      msg: formatMessage("system", `${username}님이 방에 들어왔어요`),
      type: "system",
    });
    // 여기까지 점검 완료. 테스트 필요.

    // 점검완료. 그런데 changeRoomStatus는 한번 재고 필요.
    socket.on("start_game", async () => {
      const STATUS = await getRoomStatus(roomCode);

      if (STATUS !== ROOM_STATUS.WAITING) {
        socket.emit("alert", { msg: "이미 게임이 진행중입니다." });
        return;
      }

      const wordBook = await getWordsOfRoom(roomCode);

      if (!wordBook) {
        socket.emit("alert", { msg: "단어가 없어 게임을 시작할 수 없습니다." });
        return;
      }

      try {
        await changeRoomStatus(roomCode, ROOM_STATUS.PLAYING);
        await onStartGameRedis(roomCode, session.id);

        game = new CatchMindGame(
          room,
          roomCode,
          socket,
          lobby,
          redisClient,
          wordBook
        );

        game.startGame();

        lobby.emit("update_room", {
          code: roomCode,
          status: ROOM_STATUS.PLAYING,
        });
      } catch (err) {
        console.log(err);
        socket.emit("alert", { msg: "게임을 시작할 수 없습니다." });
        return;
      }
    });

    // 점검 완료. 테스트 필요.
    socket.on("set_name", async (data) => {
      let beforeName = session.username;
      session.username = data.name;
      session.save();

      try {
        await redisClient.HSET(
          `room:${roomCode}:user_names`,
          session.id,
          session.username
        );

        socket.emit("set_name", { name: session.username });

        room.to(roomCode).emit("message", {
          msg: formatMessage(
            `system`,
            `${beforeName}님이 이름을 ${data.name}으로 변경하셨어요`
          ),
          type: "system",
        });

        const userlist = await getUserListOfRoom(roomCode);

        room.to(roomCode).emit("update_users", userlist);
      } catch (err) {
        console.log(err);
        socket.emit("alert", { msg: "이름 변경에 실패했습니다." });
        return;
      }
    });

    // 점검 완료. 테스트 필요.
    socket.on("send_msg", (data) => {
      room.to(roomCode).emit("message", {
        msg: formatMessage(`${session.username}`, data.msg),
      });
    });

    socket.on("delete_room", async () => {
      try {
        await deleteRoom(roomCode);
        lobby.emit("delete_room", roomCode);
      } catch (err) {
        console.log(err);
        return;
      }
    });

    // 점검 완료. 테스트 필요.
    socket.on("disconnect", async () => {
      socket.leave(roomCode);

      const status = await getRoomStatus(roomCode);

      if (status == ROOM_STATUS.DRAWING && game) {
        try {
          const hostId = await redisClient.GET(`room:${roomCode}:hostId`);

          if (hostId === session.id) {
            // FIXME: 근데 문제는, 이렇게 하면. 다른 서버에서 게임이 시작되고, 이 서버에서 이전에 남아있던 게임이 종료되는 문제가 발생할 수 있다.
            // 그러면, 이전에 남아있던 게임이 종료되는 것을 방지해야한다.
            // 그러면, 이전에 남아있던 게임을 어떻게 찾을 수 있을까?

            room.to(roomCode).emit("message", {
              msg: formatMessage(
                "system",
                "그리는 사람이 나가서 게임이 종료되었습니다."
              ),
              type: "fail",
            });

            game.endGameStep();
          }
        } catch (err) {
          console.log(err);
        }
      }

      const cnt = await onUserLeaveRoomRedis(roomCode, session.id);

      // FIXME: 여전히 여기 에러있음

      if (cnt === -1) {
        console.log("onUserLeaveRoomRedis Error");
        return;
      }

      const userList = await getUserListOfRoom(roomCode);

      room.to(roomCode).emit("update_users", userList);

      room.to(roomCode).emit("message", {
        msg: formatMessage("system", `${session.username}님이 방을 나가셨어요`),
        type: "system",
      });

      lobby.emit("update_room", {
        code: roomCode,
        currentUserCount: cnt,
      });
    });

    // 점검 완료.
    socket.on("paint", function (data) {
      room.to(roomCode).emit("paint", data);
    });

    // 점검 완료. 테스트 필요.
    socket.on("reset", async function (data) {
      const status = await getRoomStatus(roomCode);

      if (status === ROOM_STATUS.ERROR) {
        socket.emit("message", {
          msg: formatMessage("system", `에러가 발생했습니다.`),
          type: "fail",
        });
        return;
      }

      if (status === ROOM_STATUS.ANSWER) {
        socket.emit("message", {
          msg: formatMessage(
            "system",
            `지금은 정답을 맞추는 페이즈라 리셋할 수 없습니다.`
          ),
          type: "fail",
        });
        return;
      } else if (status === ROOM_STATUS.DRAWING) {
        try {
          const hostId = await redisClient.GET(`room:${roomCode}:hostId`);

          if (hostId !== session.id) {
            socket.emit("message", {
              msg: formatMessage("system", `그리는 사람만 리셋할 수 있습니다.`),
              type: "fail",
            });
            return;
          }
        } catch (err) {
          console.log(err);
          return;
        }
      }

      room.to(roomCode).emit("reset", data);
    });
  });
}
