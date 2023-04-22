/* eslint-disable import/no-extraneous-dependencies */
import { createClient } from "redis";

export const redisClient = createClient({
  host: process.env.NODE_ENV === "test" ? "localhost" : process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
