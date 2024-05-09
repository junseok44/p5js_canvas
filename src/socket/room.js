import { formatMessage } from "../utils/message.js";
import { getRoomCodeFromUrl } from "../utils/url.js";
import { lobby, roomCodetoSessionMap, roomCodeToGameMap } from "../socket.js";
import CatchMindGame from "../game.js";
import {
  updateRoom,
  getRoomByCode,
  deleteRoom,
  getWordsOfRoom,
} from "../query/roomQuery.js";
import { redisClient } from "../redis_client.js";
import {
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

    try {
      const cnt = await onUserJoinRoomRedis(
        roomCode,
        session.id,
        session.username
      );

      lobby.emit("update_room", {
        code: roomCode,
        currentUserCount: cnt,
      });
    } catch (err) {
      console.log(err);
    }

    const userlist = await getUserListOfRoom(roomCode);

    room.to(roomCode).emit("update_users", userlist);

    const roomStatus = await getRoomStatus(roomCode);

    socket.emit("update_room_status", roomStatus);

    socket.to(roomCode).emit("message", {
      msg: formatMessage("server", `${username}님이 방에 들어왔어요`),
      type: "system",
    });

    socket.emit("message", {
      msg: formatMessage("server", `${username} 님 어서오세용`),
      type: "system",
    });

    socket.emit("set_name", { name: username });

    socket.on("start_game", async () => {
      const STATUS = await getRoomStatus(roomCode);

      if (STATUS !== ROOM_STATUS.WAITING) {
        socket.emit("alert", { msg: "이미 게임이 진행중입니다." });
        return;
      }

      const wordBook = await getWordsOfRoom(roomCode);

      let game = new CatchMindGame(
        room,
        roomCode,
        socket,
        lobby,
        redisClient,
        wordBook
      );

      game.startGame();

      await onStartGameRedis(roomCode);

      lobby.emit("update_room", {
        code: roomCode,
        status: ROOM_STATUS.PLAYING,
      });

      // TODO: 해당 room Code의 hostId를 업데이트
    });

    socket.on("set_name", async (data) => {
      let beforeName = session.username;
      session.username = data.name;
      session.save();
      socket.emit("set_name", { name: session.username });

      room.to(roomCode).emit("message", {
        msg: formatMessage(
          `server`,
          `${beforeName}님이 이름을 ${data.name}으로 변경하셨어요`
        ),
        type: "system",
      });

      await redisClient.HSET(
        `room:${roomCode}:user_names`,
        session.id,
        session.username
      );

      const userlist = await getUserListOfRoom(roomCode);

      room.to(roomCode).emit("update_users", userlist);
    });

    socket.on("send_msg", (data) => {
      room.to(roomCode).emit("message", {
        msg: formatMessage(`${session.username}`, data.msg),
      });
    });

    socket.on("exit_room", async () => {
      const cnt = await onUserLeaveRoomRedis(roomCode, session.id);

      console.log("exit", cnt);
      if (cnt === 0) {
        await deleteRoom(roomCode);
        lobby.emit("delete_room", roomCode);
      } else {
        lobby.emit("update_room", {
          code: roomCode,
          currentUserCount: count,
        });
      }
    });

    socket.on("disconnect", async () => {
      socket.leave(roomCode);

      const cnt = await onUserLeaveRoomRedis(roomCode, session.id);

      lobby.emit("update_room", {
        code: roomCode,
        currentUserCount: cnt,
      });

      const userList = await getUserListOfRoom(roomCode);

      room.to(roomCode).emit("update_users", userList);

      room.to(roomCode).emit("message", {
        msg: formatMessage("server", `${session.username}님이 방을 나가셨어요`),
        type: "system",
      });
    });

    socket.on("paint", function (data) {
      room.to(roomCode).emit("paint", data);
    });

    socket.on("reset", function (data) {
      if (roomCodeToGameMap.get(roomCode)?.status === "answer") {
        socket.emit("message", {
          msg: formatMessage(
            "server",
            `지금은 정답을 맞추는 페이즈라 리셋할 수 없습니다.`
          ),
          type: "fail",
        });
        return;
      } else if (roomCodeToGameMap.get(roomCode)?.hostId) {
        if (roomCodeToGameMap.get(roomCode)?.hostId !== socket.id) {
          socket.emit("message", {
            msg: formatMessage(
              "server",
              `다른 사람이 그림을 그리고 있어서 리셋할 수 없어요.`
            ),
            type: "fail",
          });
          return;
        }
      }

      room.to(roomCode).emit("reset", data);
    });
  });
}
