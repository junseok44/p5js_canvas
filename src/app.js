const path = require("path");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const SQLStoreOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const sessionMiddleware = session({
  secret: "secret",
  store: new MySQLStore(SQLStoreOptions),
  resave: false,
  saveUninitialized: true,
});

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

app.get("/room", (req, res) => {
  res.sendFile(path.join(__dirname, "../client_react/build/index2.html"));
});

module.exports = { httpServer, sessionMiddleware };
