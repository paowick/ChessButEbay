import { createServer } from 'http'
import { Server } from "socket.io"
import { board } from "./board.js"

import redis from "redis"
import { log } from 'console';
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


io.use(function (socket, next) {
    var handshakeData = socket.request;
    console.log("middleware:", handshakeData._query['code']);
    next();
});


io.sockets.on("connection", async (socket) => {
    console.log(`connnect ${socket.id}`)
    // console.log(socket.request._query.code);
    socket.join(socket.request._query.code)

    if (socket.request._query.code != "admin") {
        let data
        let roomdata = await fecthroom(socket.request._query.code)
        if (roomdata?.playerB === null || roomdata?.playerW === null) {
            data = {
                board: board
            }
            io.sockets.to(socket.request._query.code).emit("board", {
                board: stringify(data)
            });
        } else if (socket.request._query.id == roomdata?.playerB) {
            io.sockets.to(socket.request._query.code).emit("req-board", {
                id: roomdata?.playerW
            });
        } else if (socket.request._query.id == roomdata?.playerW) {
            io.sockets.to(socket.request._query.code).emit("req-board", {
                id: roomdata?.playerB
            });
        } else {
            io.sockets.to(socket.request._query.code).emit("req-board", {
                id: roomdata?.playerW
            });
        }

        socket.on('res-board', (arg) => {
            const board_res = JSON.parse(arg.board)
            data = {
                board: board_res
            }
            socket.broadcast.to(socket.request._query.code).emit("board", {
                board: stringify(data)
            });
        })



    }



    socket.on('join', async (data) => {
        storedata(data, socket)
    })


    socket.on('createRoom', (data) => {
        const value = {
            code: data.room,
            playerB: null,
            playerW: null,
            log: null
        }
        redisClient.set(data.room, stringify(value), {
            NX: false
        })
        socket.join(data.room);
        console.log(io.sockets.adapter.rooms.has(data.room))
    });
    socket.on("move", (arg) => {
        console.log(`move ${arg.source} to ${arg.destination}`)
        socket.broadcast.to(socket.request._query.code).emit(`move_server`, arg)
    })


    socket.on("disconnect", () => {
        console.log('dis')
    })
});

async function storedata(data, socket) {
    const roomJSON = await redisClient.get(data.code)
    const room = await JSON.parse(roomJSON)
    console.log(data);
    console.log(room);
    if (data.role == 'B') { room.playerB = socket.request._query.id }
    if (data.role == 'W') { room.playerW = socket.request._query.id }
    console.log(room);
    redisClient.set(data.code, stringify(room), {
        NX: false
    })
}

async function fecthroom(code) {
    const roomJSON = await redisClient.get(code)
    const room = await JSON.parse(roomJSON)
    return room
}



function stringify(obj) {
    let cache = [];
    let str = JSON.stringify(obj, function (key, value) {
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