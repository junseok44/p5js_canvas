require("dotenv").config();
const { httpServer } = require("./app");
require("./db.js");
require("./socket_server");

httpServer.listen(8080, () => {
  console.log("app listening on port 8080");
});
