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
    socket.join(socket.request._query.code)
    if (socket.request._query.code != "admin") {
        let socketRole = 'viewer'
        const boardRedisJSON = await redisClient.get(socket.request._query.code)
        const boardRedis = await JSON.parse(boardRedisJSON)
        if (socket.request._query.id == boardRedis?.playerB) { socketRole = 'B' }
        if (socket.request._query.id == boardRedis?.playerW) { socketRole = 'W' }
        io.sockets.to(socket.id).emit("board", {
            board: stringify(boardRedis),
            role: socketRole,
            turn: boardRedis?.turn
        });

    }


    socket.on('join', async (arg) => {
        await storedata(arg, socket).then(async (boardRedis) => {

            io.sockets.to(socket.request._query.code).emit(`join_server`, {
                board: stringify(boardRedis)
            })
            if (boardRedis.playerB != null && boardRedis.playerW != null) {
                boardRedis.turn = 'W'
                boardRedis.gameStart = true
                redisClient.set(socket.request._query.code, stringify(boardRedis), {
                    NX: false
                })
                io.sockets.to(socket.request._query.code).emit(`start`, {
                    board: stringify(boardRedis)
                })
            }


        })
    })


    socket.on('createRoom', (data) => {
        const value = {
            turn: null,
            code: data.room,
            playerB: null,
            playerBName: null,
            invtB: [],
            playerW: null,
            playerWName: null,
            invtW: [],
            mine: [],
            gameStart: false,
            board: board,
            log: null
        }
        redisClient.set(data.room, stringify(value), {
            NX: false
        })
        socket.join(data.room);
    });





    socket.on("win", (arg) => {
        const value = {
            turn: null,
            code: socket.request._query.code,
            playerB: null,
            playerBName: null,
            playerW: null,
            playerWName: null,
            board: board,
            log: null
        }
        redisClient.set(socket.request._query.code, stringify(value), {
            NX: false
        })
        socket.broadcast.to(socket.request._query.code).emit(`win_server`, arg.team)
    })

    socket.on("move", (arg) => {
        const data = JSON.parse(arg)
        console.log(`move ${data.source} to ${data.destination}`)
        setBoardRedis(socket.request._query.code, data.board, data.turn)
        setMineRedis(socket.request._query.code, data.mine)
        let move = {
            promoted: data.promoted,
            source: data.source,
            destination: data.destination,
        }
        socket.broadcast.to(socket.request._query.code).emit(`move_server`, move)
    })

    socket.on("drop", (arg) => {
        const data = JSON.parse(arg);
        let turn = null
        setBoardRedis(socket.request._query.code, data.board, data.turn)
        setMineRedis(socket.request._query.code, data.mine)
        if (data.turn == "W") {
            turn = "B"
        } else if (data.turn == "B") {
            turn = "W"
        }
        const drop = {
            piece: data.piece,
            turn: turn
        }
        socket.broadcast.to(socket.request._query.code).emit(`drop_server`, drop)
    })

    socket.on("drop_mine", (arg) => {
        const data = JSON.parse(arg);
        let turn = null
        setMineRedis(socket.request._query.code, data.mine)
        const drop = {
            piece: data.piece,
            turn: turn
        }
        socket.broadcast.to(socket.request._query.code).emit(`drop_mine_server`, drop)
    })

    socket.on("mineUpdate", (arg) => {
        const data = JSON.parse(arg);
        console.log("update");
        console.log(data);
        setMineRedis(socket.request._query.code, data.mine)
    })

    socket.on("disconnect", () => {
        console.log('dis')
    })
});


async function setMineRedis(code, mine) {
    const roomJSON = await redisClient.get(code)
    const room = await JSON.parse(roomJSON)
    room.mine = await mine
    redisClient.set(code, stringify(room), {
        NX: false
    })
}

async function setBoardRedis(code, board, turn) {
    if (turn == "W") {
        turn = "B"
    } else if (turn == "B") {
        turn = "W"
    }
    const roomJSON = await redisClient.get(code)
    const room = await JSON.parse(roomJSON)
    room.board = await board
    room.turn = await turn
    redisClient.set(code, stringify(room), {
        NX: false
    })
}

async function storedata(arg, socket) {
    const roomJSON = await redisClient.get(arg.data.code)
    const room = await JSON.parse(roomJSON)
    if (socket.request._query.id == room.playerB) {
        room.playerBName = null
        room.playerB = null
    }
    if (socket.request._query.id == room.playerW) {
        room.playerWName = null
        room.playerW = null
    }

    if (arg.data.role == 'B' && room.playerB == null) {
        room.playerB = socket.request._query.id
        room.playerBName = arg.username
    }
    if (arg.data.role == 'W' && room.playerW == null) {
        room.playerW = socket.request._query.id
        room.playerWName = arg.username
    }
    if (room.playerB != null && room.playerW != null) {
        room.turn = "W"
    }
    redisClient.set(arg.data.code, stringify(room), {
        NX: false
    })
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