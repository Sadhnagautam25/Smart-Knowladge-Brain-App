import dotenv from "dotenv";
dotenv.config();
import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redis.on("connect", () => {
  console.log("Server is connect to Redis");
});

redis.on("error", (err) => {
  console.log("error:", err);
});

export default redis;
