var mysql = require("mysql");
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

connection.connect();
console.log("connected to mySQL");

connection.query("SELECT * FROM book", function (error, results, fields) {
  if (error) throw error;

  console.log("The solution is: ", results[0].title);
});

module.exports = connection;
