const httpServer = require("./app");

require("./socket_server");

httpServer.listen(8080, () => {
  console.log("app listening on port 8080");
});
