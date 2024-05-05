import redis from "redis";

const redisClient = redis.createClient();

redisClient.connect();

let isRedisConnected = false;

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});
redisClient.on("connect", () => {
  console.log("Redis connected");
});

async function getRedisClient() {
  if (!isRedisConnected) {
    await redisClient.connect();
    isRedisConnected = true;
  }

  return redisClient;
}

export { redisClient };
