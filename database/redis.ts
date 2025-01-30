import config from "@/lib/config";
import { Redis } from "@upstash/redis";
const { redisToken, redisUrl } = config.env.upstach;
const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});
export default redis;
