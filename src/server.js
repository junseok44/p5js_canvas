import dotenv from "dotenv";

dotenv.config();

import { httpServer } from "./app.js";

import "./redis_client.js";
import "./db.js";
import "./socket.js";

httpServer.listen(process.env.SERVER_PORT, () => {
  console.log("app listening on port 8080");
});
