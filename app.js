const path = require("path");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/libraries"));
app.use(express.static(__dirname + "/node_modules/socket.io/client-dist"));

httpServer.listen(8080, () => {
  console.log("app listening on port 8080");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/index.html"));
});

let io = require("socket.io")(httpServer);

io.on("connection", (socket) => {
  console.log("we have a new client" + socket.id);

  socket.on("disconnected", () => {
    console.log("socket disconnected");
  });

  socket.on("mouse", function (data) {
    socket.broadcast.emit("mouse", data);
  });

  socket.on("reset", function (data) {
    socket.broadcast.emit("reset", data);
  });
});
