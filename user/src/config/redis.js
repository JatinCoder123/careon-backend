import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err) => console.error("Redis Error", err));
export const connectRedis = async () => {
  try {
    await redis.connect();  
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Redis connection error:", error);
  }
};