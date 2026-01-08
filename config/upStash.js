import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { configDotenv } from "dotenv";

configDotenv();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"), // ✅ FIX
});

export default ratelimit;
