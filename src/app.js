const path = require("path");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const cors = require("cors");
// app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../libraries")));
app.use(express.static(path.join(__dirname, "../client_react/build")));
app.use(
  express.static(path.join(__dirname, "../node_modules/socket.io/client-dist"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/room", (req, res) => {
  res.sendFile(path.join(__dirname, "../client_react/build/index2.html"));
});

module.exports = httpServer;
