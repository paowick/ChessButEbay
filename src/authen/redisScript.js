import redis from "redis"
const url = `redis://authredis:6379`
const redisClient = redis.createClient(6379,'authredis');
await redisClient.connect()


export async function test(){
  redisClient.set('test','test1')
}