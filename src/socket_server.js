const { formatMessage, getRoomCodeFromUrl } = require("./utils.js");
const { httpServer } = require("./app.js");
const sessionMiddleware = require("./session.js");
const { createRoom, getAllRooms, getRoom } = require("./query/roomQuery.js");
const CatchMindGame = require("./game.js");

let io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://127.0.0.1:8080",
    methods: ["GET", "POST"],
  },
});

io.engine.use(sessionMiddleware);

const room = io.of("/rooms");
const lobby = io.of("/lobby");

let roomCodetoSessionMap = new Map();
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

  const session = socket.request.session;
  session.username = session.username || "Guest";
  const username = session.username;

  if (roomCodetoSessionMap.has(roomCode)) {
    roomCodetoSessionMap.get(roomCode).push(session);
  } else {
    roomCodetoSessionMap.set(roomCode, [session]);
  }

  room.to(roomCode).emit("update_users", roomCodetoSessionMap.get(roomCode));

  socket.to(roomCode).emit("message", {
    msg: formatMessage("server", `${username}님이 방에 들어왔어요`),
    type: "system",
  });

  socket.emit("set_name", { name: username });

  socket.emit("message", {
    msg: formatMessage("server", `${username} 님 어서오세용`),
    type: "system",
  });

  socket.on("start_game", () => {
    if (roomCodeToGameMap.get(roomCode)) {
      socket.emit("alert", { msg: "이미 게임이 진행중입니다." });
      return;
    }
    new CatchMindGame(room, roomCode, socket, roomCodeToGameMap).startGame();
    roomCodeToGameMap.set(roomCode, true);
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

  socket.on("disconnect", () => {
    console.log("socket disconnected");
    socket.leave(roomCode);
    roomCodetoSessionMap.set(
      roomCode,
      roomCodetoSessionMap.get(roomCode).filter((s) => s.id !== session.id)
    );
    room.to(roomCode).emit("update_users", roomCodetoSessionMap.get(roomCode));

    room.to(roomCode).emit("message", {
      msg: formatMessage("server", `${session.username}님이 방을 나가셨어요`),
      type: "system",
    });
  });

  socket.on("paint", function (data) {
    room.to(roomCode).emit("paint", data);
  });

  socket.on("reset", function (data) {
    room.to(roomCode).emit("reset", data);
  });
});

lobby.on("connection", (socket) => {
  console.log("someone is on lobby");

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
