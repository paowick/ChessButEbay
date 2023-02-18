import redis from "redis"
const redisClient = redis.createClient({
    socket: {
        host: 'authredis',
        port: '6379'
    }
});


export async function test() {
    await redisClient.connect()
    redisClient.set('test', 'test').then((r)=>{console.log(r);})
}
