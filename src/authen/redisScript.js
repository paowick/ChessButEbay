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
        redisClient.set(key, value,{
            EX : 86400,
            NX: false
        })

    }catch(e){
        console.log(e);
        throw Error(e)
    }
}

export async function verifyCodeChecker(key,value){
    try{
        const truthCode = await redisClient.get(key)
        if(value != truthCode){return false}
        return true
    }catch(e){
        console.log(e);
        throw Error(e)
    }
}