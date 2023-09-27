const { formatMessage } = require("./utils.js");
const httpServer = require("./app.js");

let io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const room = io.of("/rooms");
const lobby = io.of("/lobby");

room.on("connection", (socket) => {
  socket.data.username = "anonymous";
  console.log("we have a new client" + socket.id);
  socket.broadcast.emit("message", {
    msg: formatMessage("server", `${socket.data.username} has joined the game`),
  });
  socket.emit("message", {
    msg: formatMessage("server", "어서오세용"),
  });

  socket.on("send_msg", (data) => {
    room.emit("message", {
      msg: formatMessage(`${socket.data.username}`, data.msg),
    });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
    room.emit("message", {
      msg: formatMessage(
        "server",
        `${socket.data.username} has leaved the game`
      ),
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
  socket.emit("update rooms", () => {
    // TODO database에서 방 정보 불러서 클라이언트에게 전달하기.
  });

  socket.on("create_room", () => {});

  socket.on("delete_room", () => {});
});
