const path = require("path");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const sessionMiddleware = require("./session");
const { getRoomByCode } = require("./query/roomQuery");

app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../libraries")));
app.use(express.static(path.join(__dirname, "../client_react/build")));
app.use(
  express.static(path.join(__dirname, "../node_modules/socket.io/client-dist"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client_react/build/index.html"));
});

app.get("/room/:code", (req, res) => {
  req.session.count++;
  res.sendFile(path.join(__dirname, "../public/room.html"));
});

app.get("/api/room/:code", async (req, res, next) => {
  try {
    const room = await getRoomByCode(req.params.code);
    if (room) res.send(room);
    else res.status(404).send("Room not found");
  } catch (error) {
    return next(error);
  }
});

module.exports = { httpServer };
