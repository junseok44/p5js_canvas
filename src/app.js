const path = require("path");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const sessionMiddleware = require("./session");

app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../libraries")));
app.use(express.static(path.join(__dirname, "../client_react/build")));
app.use(
  express.static(path.join(__dirname, "../node_modules/socket.io/client-dist"))
);

app.get("/", (req, res) => {
  req.session.count++;
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

app.get("/lobby", (req, res) => {
  res.sendFile(path.join(__dirname, "../client_react/build/index.html"));
});

module.exports = { httpServer };
