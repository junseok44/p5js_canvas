const { formatMessage, getRoomCodeFromUrl } = require("./utils.js");
const { httpServer } = require("./app.js");
const sessionMiddleware = require("./session.js");
const {
  createRoom,
  getAllRooms,
  getRoom,
  updateRoom,
  getRoomByCode,
  deleteRoom,
} = require("./query/roomQuery.js");
const CatchMindGame = require("./game.js");

let io = require("socket.io")(httpServer, {
  cors: {
    origin: [
      "http://ec2-3-35-48-144.ap-northeast-2.compute.amazonaws.com",
      "http://127.0.0.1:8080",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST"],
  },
});

io.engine.use(sessionMiddleware);

const room = io.of("/rooms");
const lobby = io.of("/lobby");

// roomCode -> [session1, session2, ...]
let roomCodetoSessionMap = new Map();
// roomCode -> {status: "waiting" | "playing", time: 20}
let roomCodeToGameMap = new Map();

room.on("connection", (socket) => {
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

  const roomCode = getRoomCodeFromUrl(socket);
  socket.join(roomCode);

  updateRoom(roomCode, 1, null)
    .then((result) => {
      if (result.affectedRows === 0 || result.changedRows === 0) {
        return;
      }
      return getRoomByCode(roomCode);
    })
    .then((room) => {
      lobby.emit("update_room", room);
    })
    .catch((err) => console.log(err));

  const session = socket.request.session;
  session.username = session.username || "Guest";
  const username = session.username;
  session.save();

  if (roomCodetoSessionMap.has(roomCode)) {
    roomCodetoSessionMap.get(roomCode).push(session);
  } else {
    roomCodetoSessionMap.set(roomCode, [session]);
  }

  if (!roomCodeToGameMap.has(roomCode)) {
    roomCodeToGameMap.set(roomCode, {
      status: "waiting",
      time: 20,
    });
  }

  room.to(roomCode).emit("update_users", roomCodetoSessionMap.get(roomCode));

  socket.emit("update_room_status", roomCodeToGameMap.get(roomCode));

  socket.to(roomCode).emit("message", {
    msg: formatMessage("server", `${username}님이 방에 들어왔어요`),
    type: "system",
  });

  socket.emit("update_status", roomCodeToGameMap.get(roomCode) || false);

  socket.emit("set_name", { name: username });

  socket.emit("message", {
    msg: formatMessage("server", `${username} 님 어서오세용`),
    type: "system",
  });

  socket.on("start_game", () => {
    if (
      roomCodeToGameMap.get(roomCode) &&
      roomCodeToGameMap.get(roomCode).status !== "waiting"
    ) {
      socket.emit("alert", { msg: "이미 게임이 진행중입니다." });
      return;
    }

    new CatchMindGame(
      room,
      roomCode,
      socket,
      roomCodeToGameMap,
      lobby
    ).startGame();
  });

  socket.on("set_name", (data) => {
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
    room.to(roomCode).emit("update_users", roomCodetoSessionMap.get(roomCode));
  });

  socket.on("send_msg", (data) => {
    room.to(roomCode).emit("message", {
      msg: formatMessage(`${session.username}`, data.msg),
    });
  });

  socket.on("exit_room", () => {
    if (roomCodetoSessionMap.get(roomCode).length === 1) {
      deleteRoom(roomCode).then((result) => {
        roomCodeToGameMap.delete(roomCode);
        roomCodetoSessionMap.delete(roomCode);
        lobby.emit("delete_room", roomCode);
      });
    }
  });

  socket.on("disconnect", () => {
    socket.leave(roomCode);

    // 방이 아직 남아있다면.
    if (roomCodetoSessionMap.has(roomCode)) {
      // db에서 현재인원 업데이트 후 lobby에 상태 업데이트
      updateRoom(roomCode, -1, null)
        .then((result) => {
          if (result.affectedRows === 0 || result.changedRows === 0) {
            return;
          }
          return getRoomByCode(roomCode);
        })
        .then((room) => {
          lobby.emit("update_room", room);
        })
        .catch((err) => console.log(err));

      // 해당 세션은 방 map에서 제거하기
      roomCodetoSessionMap.set(
        roomCode,
        roomCodetoSessionMap.get(roomCode).filter((s) => s.id !== session.id)
      );

      // 룸의 다른 유저들의 유저목록 업데이트하기
      room
        .to(roomCode)
        .emit("update_users", roomCodetoSessionMap.get(roomCode));

      room.to(roomCode).emit("message", {
        msg: formatMessage("server", `${session.username}님이 방을 나가셨어요`),
        type: "system",
      });
    }
  });

  socket.on("paint", function (data) {
    room.to(roomCode).emit("paint", data);
  });

  socket.on("reset", function (data) {
    room.to(roomCode).emit("reset", data);
  });
});

lobby.on("connection", (socket) => {
  getAllRooms().then((result) => {
    socket.emit("update_rooms", result);
  });

  socket.on("create_room", async (data) => {
    const result = await createRoom(
      data.roomTitle,
      data.roomMax,
      data.roomPublic
    );

    const newRoom = await getRoom(result.insertId);
    lobby.emit("create_room", newRoom);
  });

  socket.on("delete_room", () => {});
});
