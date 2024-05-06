import session from "express-session";
import { redisClient } from "./redis_client.js";
import RedisStore from "connect-redis";

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "user:",
});

const sessionMiddleware = session({
  secret: "secret",
  store: redisStore,
  resave: false,
  saveUninitialized: false,
});

export { sessionMiddleware };
