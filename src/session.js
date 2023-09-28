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
  saveUninitialized: false,
});

module.exports = sessionMiddleware;
