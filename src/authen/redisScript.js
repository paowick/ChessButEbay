import redis from "redis"
const redisClient = redis.createClient({
    socket: {
        host: 'authredis',
        port: '6379'
    }
});
await redisClient.connect()


export async function test() {
    redisClient.set('test', 'test').then((r)=>{console.log(r);})
}


export async function insertVerifyCode(key,value) {
    try {
        
        const value = Math.floor(Math.random() * 9999);

        redisClient.set(key, value,{
            EX : 86400,
            NX: false
        })

    }catch(e){
        console.log(e);
        throw Error(e)
    }
}
