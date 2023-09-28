const { formatMessage } = require("./utils.js");
const { httpServer, sessionMiddleware } = require("./app.js");
const connection = require("./db.js");
const { getAllRoomsQuery } = require("./query/roomQuery.js");

let io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
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

  let session = socket.request.session;
  if (!session.username) session.username = "anonymous";
  console.log("we have a new client  " + session.username, session.id);

  socket.broadcast.emit("message", {
    msg: formatMessage("server", `${session.username}님이 방에 들어왔어요`),
  });

  socket.emit("set_name", { name: session.username });

  socket.emit("message", {
    msg: formatMessage("server", `${session.username} 님 어서오세용`),
  });

  socket.on("set_name", (data) => {
    let beforeName = session.username;
    console.log("set name", data.name);
    session.username = data.name;
    session.save();
    socket.emit("set_name", { name: session.username });

    room.emit("message", {
      msg: formatMessage(
        `server`,
        `${beforeName}님이 이름을 ${data.name}으로 변경하셨어요`
      ),
    });
  });

  socket.on("send_msg", (data) => {
    room.emit("message", {
      msg: formatMessage(`${session.username}`, data.msg),
    });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
    room.emit("message", {
      msg: formatMessage("server", `${session.username}님이 방을 나가셨어요`),
    });
  });

  socket.on("paint", function (data) {
    socket.broadcast.emit("paint", data);
  });

  socket.on("reset", function (data) {
    socket.broadcast.emit("reset", data);
  });
});

lobby.on("connection", (socket) => {
  console.log("someone is on lobby");

  connection.query(getAllRoomsQuery, (err, result, fields) => {
    if (err) throw err;
    socket.emit("update_rooms", result);
  });

  socket.on("create_room", (data) => {
    console.log(data);
  });

  socket.on("delete_room", () => {});
});
