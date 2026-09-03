import { createClient } from "redis";

const redis = await createClient({ url: process.env.REDIS_URL })
  .on("error", console.error)
  .connect();

export default redis;