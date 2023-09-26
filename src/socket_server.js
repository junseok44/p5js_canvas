const { formatMessage } = require("./utils.js");
const httpServer = require("./app.js");

let io = require("socket.io")(httpServer);

io.on("connection", (socket) => {
  socket.data.username = "anonymous";
  console.log("we have a new client" + socket.id);
  socket.emit("message", {
    msg: formatMessage("server", "어서오세용"),
  });

  socket.on("send_msg", (data) => {
    io.sockets.emit("message", {
      msg: formatMessage(`${socket.data.username}`, data.msg),
    });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
    io.sockets.emit("message", {
      msg: formatMessage(
        "server",
        `${socket.data.username} has leaved the game`
      ),
    });
  });

  socket.on("mouse", function (data) {
    socket.broadcast.emit("mouse", data);
  });

  socket.on("reset", function (data) {
    socket.broadcast.emit("reset", data);
  });
});
