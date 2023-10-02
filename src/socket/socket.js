import { createServer, get } from 'http'
import { Server } from "socket.io"
import { board } from "./board.js"

import redis from "redis"
import { log } from 'console';
import { loadavg } from 'os';
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
    console.log(socket.request._query.code);
    if (socket.request._query.code != "admin") {
        let socketRole = null
        const boardRedisJSON = await redisClient.get(socket.request._query.code)
        const boardRedis = await JSON.parse(boardRedisJSON)
        if (socket.request._query.id == boardRedis?.playerB) { socketRole = 'B' }
        else if (socket.request._query.id == boardRedis?.playerW) { socketRole = 'W' }
        else { socketRole = 'viewer' }
        io.sockets.to(socket.id).emit("board", {
            boardRedis,
            role: socketRole,
            turn: boardRedis?.turn
        });


    }

    socket.on('resetroom',(arg)=>{
        const value = {
            turnCount: 0,
            roomname: "tui",
            auctiontime: 5,
            confcoins: 1000,
            auctionslot1: null,
            auctionslot2: null,
            currentBid: 0,
            currentBidder: null,
            auctionStage: true,
            turn: null,
            code: arg,
            playerB: null,
            playerBName: null,
            invtB: [],
            coinB: 1000,
            playerW: null,
            playerWName: null,
            invtW: [],
            coinW: 1000,
            mine: [],
            gameStart: false,
            board: board,
            log: null
        }
        redisClient.set(arg, stringify(value), {
            NX: false
        })
    })

    socket.on('join', async (arg) => {
        await storedata(arg, socket).then(async (boardRedis) => {

            io.sockets.to(socket.request._query.code).emit(`join_server`, {
                board: stringify(boardRedis)
            })
            if (boardRedis.playerB != null && boardRedis.playerW != null) {
                boardRedis.turn = 'W'
                boardRedis.gameStart = true
                let piece1 = getRandomChessPiece(boardRedis.turnCount)
                let piece2 = getRandomChessPiece(boardRedis.turnCount)

                boardRedis.auctionslot1 = piece1
                boardRedis.auctionslot2 = piece2
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
            turnCount: 0,
            roomname: data.req.roomName,
            auctiontime: data.req.aucTime,
            confcoins: parseInt(data.req.coins),
            auctionslot1: null,
            auctionslot2: null,
            currentBid: 0,
            currentBidder: null,
            auctionStage: true,
            turn: null,
            code: data.room,
            playerB: null,
            playerBName: null,
            invtB: [],
            coinB: parseInt(data.req.coins),
            playerW: null,
            playerWName: null,
            invtW: [],
            coinW: parseInt(data.req.coins),
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





    socket.on("win", async (data) => {
        const roomJSON = await redisClient.get(socket.request._query.code)
        const room = await JSON.parse(roomJSON)
        const value = {
            turnCount: 0,
            roomname: room.roomName,
            auctiontime: room.aucTime,
            confcoins: room.confcoins,
            auctionslot1: null,
            auctionslot2: null,
            currentBid: 0,
            currentBidder: null,
            turn: null,
            code: data.room,
            playerB: null,
            playerBName: null,
            invtB: [],
            coinB: room.confcoins,
            playerW: null,
            playerWName: null,
            invtW: [],
            coinW: room.confcoins,
            mine: [],
            gameStart: false,
            board: board,
            log: null
        }
        redisClient.set(socket.request._query.code, stringify(value), {
            NX: false
        })
        socket.broadcast.to(socket.request._query.code).emit(`win_server`, arg.team)
    })

    socket.on("move", async (arg) => {
        const data = JSON.parse(arg)
        let turn = await data.turn
        if (turn == "W") { turn = "B" } else if (turn == "B") { turn = "W" }
        const roomJSON = await redisClient.get(socket.request._query.code)
        const room = await JSON.parse(roomJSON)
        room.board = await data.board
        room.turn = await turn
        room.mine = await data.mine
        room.turnCount = await room.turnCount + 1
        room.auctionStage = true
        if (socket.request._query.id == room.playerB) {
            room.coinB = await data.coin
            room.invtB = await data.invt
        }
        if (socket.request._query.id == room.playerW) {
            room.coinW = await data.coin
            room.invtW = await data.invt
        }
        invtViewerUpdate(socket, room)
        redisClient.set(socket.request._query.code, stringify(room), {
            NX: false
        })
        let move = {
            turn: turn,
            promoted: data.promoted,
            source: data.source,
            destination: data.destination,
        }
        socket.broadcast.to(socket.request._query.code).emit(`move_server`, move)
    })

    socket.on("drop", async (arg) => {
        const roomJSON = await redisClient.get(socket.request._query.code)
        const room = await JSON.parse(roomJSON)
        const data = JSON.parse(arg)
        let turn = await data.turn
        if (turn == "W") { turn = "B" } else if (turn == "B") { turn = "W" }
        room.board = await data.board
        room.turn = await turn
        room.turnCount = await room.turnCount + 1
        room.auctionStage = true
        if (socket.request._query.id == room.playerB) {
            room.invtB = await data.invt
        }
        if (socket.request._query.id == room.playerW) {
            room.invtW = await data.invt
        }
        redisClient.set(socket.request._query.code, stringify(room), {
            NX: false
        })
        invtViewerUpdate(socket, room)
        const drop = {
            piece: data.piece,
            turn: turn
        }
        socket.broadcast.to(socket.request._query.code).emit(`drop_server`, drop)
    })

    socket.on("drop_mine", (arg) => {
        const data = JSON.parse(arg);
        let turn = null
        dropmineInvtRedis(socket, data)
        const drop = {
            piece: data.piece,
            turn: turn
        }
        socket.broadcast.to(socket.request._query.code).emit(`drop_mine_server`, drop)
    })

    socket.on("getInfo", async (arg) => {
        const roomJSON = await redisClient.get(socket.request._query.code)
        const room = await JSON.parse(roomJSON)
        io.sockets.to(socket.id).emit(`getInfo_server`, room)
    })

    socket.on("mineUpdate", (arg) => {
        const data = JSON.parse(arg);
        // setMineRedis(socket.request._query.code, data.mine)
    })

    socket.on("bid", async (arg) => {
        bid(arg, socket.request._query.code, socket)
    })

    socket.on("invtUpdate", async (arg) => {
        invtUpdate(socket, arg)
    })

    socket.on("test-auction", async (arg) => {
        getAuction(socket)

    })


    socket.on("disconnect", () => {
        console.log('dis')
    })
});

async function invtUpdate(socket, arg) {
    const data = JSON.parse(arg)
    const roomJSON = await redisClient.get(socket.request._query.code)
    const room = await JSON.parse(roomJSON)
    if (socket.request._query.id == room.playerB) {
        room.invtB = await data.invt
    }
    if (socket.request._query.id == room.playerW) {
        room.invtW = await data.invt
    }
    await redisClient.set(socket.request._query.code, stringify(room), {
        NX: false
    })
    invtViewerUpdate(socket, room)
}

async function invtViewerUpdate(socket, room) {
    const data = {
        playerB: room.playerB,
        playerW: room.playerW,
        invtB: room.invtB,
        invtW: room.invtW,
        coinB: room.coinB,
        coinW: room.coinW,
    }
    io.sockets.to(socket.request._query.code).emit(`invtViewerUpdate`, data)
}

async function getAuction(socket) {
    const roomJSON = await redisClient.get(socket.request._query.code)
    const room = await JSON.parse(roomJSON)
    const slotTemp = room.auctionslot1
    const bidderTemp = room.currentBidder
    room.auctionslot1 = room.auctionslot2
    room.auctionslot2 = getRandomChessPiece(room.turnCount)
    room.currentBid = 0
    room.currentBidder = null
    room.auctionStage = false
    const data = {
        id: bidderTemp,
        newPiece: slotTemp,
        room: room
    }
    io.sockets.to(socket.request._query.code).emit(`get-piece_auction_server`, data)
    redisClient.set(socket.request._query.code, stringify(room), {
        NX: false
    })
}

async function bid(arg, code, socket) {
    const roomJSON = await redisClient.get(code)
    const room = await JSON.parse(roomJSON)
    if (arg.id == room.playerB) {
        if (arg.amout > room.coinB) { return }
        room.coinB -= arg.amout
    }
    if (arg.id == room.playerW) {
        if (arg.amout > room.coinW) { return }
        room.coinW -= arg.amout
    }
    if (room.currentBidder == arg.id) { return }
    if (room.currentBid < arg.amout) {
        room.currentBid = arg.amout
        room.currentBidder = arg.id
        redisClient.set(code, stringify(room), {
            NX: false
        })
        io.sockets.to(socket.request._query.code).emit(`bid_server`, stringify(room))
    }
}


function getRandomChessPiece(turnCount) {
    const randomNum = Math.random() * 100; // Generate a random number between 0 and 100

    // Define the percentages for each chess piece
    let percentages = null
    if (turnCount <= 4) {
        percentages = {
            'pawn': 100,
            'rook': 0,
            'knight': 0,
            'bishop': 0,
            'queen': 0,
        };
    }
    if(turnCount > 4 && turnCount <= 10 ){
        percentages = {
            'pawn': 70,
            'rook': 10,
            'knight': 10,
            'bishop': 10,
            'queen': 0,
        };
    }
    if(turnCount > 10){
        percentages = {
            'pawn': 65,
            'rook': 10,
            'knight': 10,
            'bishop': 10,
            'queen': 5,
        };
    }

    let cumulativePercentage = 0;

    // Loop through the percentages and check which piece corresponds to the random number
    for (const piece in percentages) {
        cumulativePercentage += percentages[piece];
        if (randomNum <= cumulativePercentage) {
            return piece; // Return the selected chess piece
        }
    }

    return 'No piece selected'; // In case something goes wrong
}

// Example 

async function dropmineInvtRedis(socket, data) {
    const roomJSON = await redisClient.get(socket.request._query.code)
    const room = await JSON.parse(roomJSON)
    room.mine = await data.mine
    if (socket.request._query.id == room.playerB) {
        room.invtB = await data.invt
    }
    if (socket.request._query.id == room.playerW) {
        room.invtW = await data.invt
    }
    redisClient.set(socket.request._query.code, stringify(room), {
        NX: false
    })
    invtViewerUpdate(socket, room)
}

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