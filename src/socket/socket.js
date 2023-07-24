import { createServer } from 'http'
import { Server } from "socket.io"
import { board } from "./board.js"

import redis from "redis"
const redisClient = redis.createClient({
    socket: {
        host: 'gameredis',
        port: '6379'
    }
});

await redisClient.connect()
export async function test() {
    redisClient.set('test', 'test').then((r) => { console.log(r); })
}
const sever = createServer()
const io = new Server(sever, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
})


sever.listen(8080, () => {
    console.log('8080')
})





io.of("/").on("connection", (socket) => {
    console.log(`connnect ${socket.id}`)

    socket.on('createRoom', (data) => {
        const value = {
            code:data.room,
            player1:null,
            Player2:null,
            board:board
        }
        redisClient.set(data.room, stringify(value),{
            NX: false
        })
        socket.join(data.room);
        console.log(io.sockets.adapter.rooms.has(data.room))
    });

    socket.on("move", (arg) => {
        console.log(io.sockets.adapter.rooms.has('tes'))
        console.log(`move ${arg.source} to ${arg.destination}`)
        socket.broadcast.emit(`move_server`, arg)
    })

    socket.on("disconnect", () => {
        console.log('dis')
    })
});
function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function(key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}