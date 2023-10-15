const path = require("path");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const sessionMiddleware = require("./session");
const { getRoomByCode } = require("./query/roomQuery");
const { createReport } = require("./query/reportQuery");

app.use(sessionMiddleware);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../libraries")));
app.use(express.static(path.join(__dirname, "../client_react/build")));
app.use(
  express.static(path.join(__dirname, "../node_modules/socket.io/client-dist"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client_react/build/index.html"));
});

app.get("/room/:code", async (req, res) => {
  req.session.count++;

  try {
    const room = await getRoomByCode(req.params.code);
    if (!room) return res.status(404).send("해당하는 룸이 없어요");
  } catch (error) {
    return next(error);
  }
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

app.post("/api/report", async (req, res, next) => {
  try {
    if (req.body?.report && req.body.report.length > 0) {
      await createReport(req.body.report);
      res.send("report created");
    } else {
      console.log("no report");
      res.status(404).send("no report");
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = { httpServer };
