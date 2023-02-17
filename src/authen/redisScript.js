import redis from "redis"
const redisClient = redis.createClient({
  host: 'authredis',
  port: 6379
});