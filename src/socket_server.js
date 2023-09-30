const { formatMessage } = require("./utils.js");
const { httpServer } = require("./app.js");
const sessionMiddleware = require("./session.js");
const { createRoom, getAllRooms, getRoom } = require("./query/roomQuery.js");

let io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://127.0.0.1:8080",
    methods: ["GET", "POST"],
  },
});

io.engine.use(sessionMiddleware);

const room = io.of("/rooms");
const lobby = io.of("/lobby");

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

  const req = socket.request;
  const {
    headers: { referer },
  } = req;

  let urlParts = referer.split("/");
  let roomCode = urlParts[urlParts.length - 1];

  socket.join(roomCode);
  let session = socket.request.session;
  if (!session.username) session.username = "anonymous";
  console.log("we have a new client  " + session.username, session.id);

  socket.to(roomCode).emit("message", {
    msg: formatMessage("server", `${session.username}님이 방에 들어왔어요`),
  });

  // 세션의 username 기억한것을 전달해준다.
  socket.emit("set_name", { name: session.username });

  socket.emit("message", {
    msg: formatMessage("server", `${session.username} 님 어서오세용`),
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
    });
  });

  socket.on("send_msg", (data) => {
    room.to(roomCode).emit("message", {
      msg: formatMessage(`${session.username}`, data.msg),
    });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
    socket.leave(roomCode);
    room.to(roomCode).emit("message", {
      msg: formatMessage("server", `${session.username}님이 방을 나가셨어요`),
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
