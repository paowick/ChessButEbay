import { createServer, get } from 'http'
import { Server } from "socket.io"
import { board } from "./board.js"

import redis from "redis"
import { invtUpdate } from './allFunction.js';
import { invtViewerUpdate } from './allFunction.js';
import { getAuction } from './allFunction.js';
import { bid } from './allFunction.js';
import { getRandomChessPiece } from './allFunction.js';
import { dropmineInvtRedis } from './allFunction.js';
import { setMineRedis } from './allFunction.js';
import { storedata } from './allFunction.js';
import { now } from './allFunction.js';
import { stringify } from './allFunction.js';


import cookieParser from 'cookie-parser';
import { toUSVString } from 'util';

export const redisClient = new redis.createClient({
    socket: {
        host: 'gameredis',
        port: '6379'
    }
});

export const redisauth = new redis.createClient({
    socket: {
        host: 'authredis',
        port: '6379'
    }
})
await redisauth.connect()
await redisClient.connect()
export async function test() {
    redisClient.set('test', 'test').then((r) => { console.log(r); })
}
const sever = createServer()
export const io = new Server(sever, {
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
    cookieParser()
    // console.log("middleware:", handshakeData._query['code']);
    next();
});


io.sockets.on("connection", async (socket) => {
    // console.log(`connnect ${socket.id}`)
    socket.join(socket.request._query.code)
    // console.log(socket.request._query.code);
    if (socket.request._query.code != "admin") {
        // console.log(socket.request.headers.cookie);
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


    socket.on('join', async (arg) => {
        await storedata(arg, socket).then(async (boardRedis) => {
            io.sockets.to(socket.request._query.code).emit(`join_server`, {
                board: stringify(boardRedis)
            })
            if (boardRedis.playerB != null && boardRedis.playerW != null) {
                boardRedis.turn = 'W'
                boardRedis.gameStart = true
                boardRedis.auctionend = Date.now() + boardRedis.auctiontime * 1000
                let piece1 = getRandomChessPiece(boardRedis.turnCount)
                let piece2 = getRandomChessPiece(boardRedis.turnCount)
                boardRedis.starttime = now()
                boardRedis.auctionStage = true
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
            starttime: null,
            turnCount: 0,
            roomname: data.req.roomName,
            auctiontime: data.req.aucTime,
            auctionend: null,
            confcoins: parseInt(data.req.coins),
            auctionslot1: null,
            auctionslot2: null,
            currentBid: 0,
            currentBidder: null,
            auctionStage: false,
            turn: null,
            code: data.room,
            playerB: null,
            playerBName: null,
            playerBSessionId: null,
            invtB: [],
            coinB: parseInt(data.req.coins),
            playerW: null,
            playerWName: null,
            playerWSessionId: null,
            invtW: [],
            coinW: parseInt(data.req.coins),
            mine: [],
            gameStart: false,
            board: board,
            log: []
        }
        redisClient.set(data.room, stringify(value), {
            NX: false
        })
        socket.join(data.room);
    });





    socket.on("win", async (data) => {
        const roomJSON = await redisClient.get(socket.request._query.code)
        const room = await JSON.parse(roomJSON)
        let log = room.log
        if (data.turn == "W") {
            log.push({
                W: data.notation,
                B: ''
            })
        } else if (data.turn == "B") {
            let element = log[log.length - 1]
            element.B = data.notation
        }
        room.log = await log
        const value = {
            starttime: null,
            turnCount: 0,
            roomname: room.roomname,
            auctiontime: room.auctiontime,
            auctionend: null,
            confcoins: room.confcoins,
            auctionslot1: null,
            auctionslot2: null,
            auctionStage: false,
            currentBid: 0,
            currentBidder: null,
            turn: null,
            code: room.code,
            playerB: null,
            playerBName: null,
            playerBSessionId: null,
            invtB: [],
            coinB: room.confcoins,
            playerW: null,
            playerWName: null,
            playerWSessionId: null,
            invtW: [],
            coinW: room.confcoins,
            mine: [],
            gameStart: false,
            board: board,
            log: []
        }
        redisClient.set(socket.request._query.code, stringify(value), {
            NX: false,
            EX: 600
        })
        let WhiteScoe = 0
        let BlackScore = 0
        let winnerId
        let loserId
        let winnerName
        let loserName
        let winnerSessionId
        let loserSessionId
        if (room.playerB == data.id) {
            winnerId = room.playerB
            winnerName = room.playerBName
            winnerSessionId = room.playerBSessionId
            loserId = room.playerW
            loserName = room.playerWName
            loserSessionId = room.playerWSessionId
        }
        if (room.playerW == data.id) {
            winnerId = room.playerW
            winnerName = room.playerWName
            winnerSessionId = room.playerWSessionId
            loserId = room.playerB
            loserName = room.playerBName
            loserSessionId = room.playerBSessionId
        }
        const datareturn = {
            winner: data.team,
            winnerId: winnerId,
            loserId: loserId,
            winnerName: winnerName,
            loserName: loserId,
            starttime: room.starttime,
            round: room.log.length
        }
        io.sockets.to(socket.request._query.code).emit(`win_server`, datareturn)
        const overAllNotation = {
            StartDate: room.starttime,
            EndDate: now(),
            PlayCount: room.log.length,
            winnerId: winnerId,
            loserId: loserId,
            WhiteId: room.playerB,
            BlackId: room.playerW,
            log: room.log
        }

        const userJSONwin = await redisauth.get(`myapp:${winnerSessionId}`)
        const userwin = await JSON.parse(userJSONwin)
        const userJSONlose = await redisauth.get(`myapp:${loserSessionId}`)
        const userlose = await JSON.parse(userJSONlose)
        userwin.user.score = await userwin.user.score + 20
        userlose.user.score = await userlose.user.score - 20
        await redisauth.set(`myapp:${winnerSessionId}`, stringify(userwin))
        await redisauth.set(`myapp:${loserSessionId}`, stringify(userlose))
        const res = await fetch("http://api:8080/api/logs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(overAllNotation)
        })
    })

    socket.on('castle', async (arg) => {
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
        room.auctionend = Date.now() + room.auctiontime * 1000
        let log = room.log
        if (data.turn == "W") {
            log.push({
                W: data.notation,
                B: ''
            })
        } else if (data.turn == "B") {
            let element = log[log.length - 1]
            element.B = data.notation
        }
        room.log = await log
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
        let castle = {
            turn: turn,
            kingSource: data.kingSource,
            kingDestination: data.kingDestination,
            notation: data.notation,
            auctionend:room.auctionend
        }
        socket.broadcast.to(socket.request._query.code).emit(`castle_server`, castle)
        io.sockets.to(socket.id).emit('castle_return',room.auctionend)
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
        room.auctionend = Date.now() + room.auctiontime * 1000
        let log = room.log
        if (data.turn == "W") {
            log.push({
                W: data.notation,
                B: ''
            })
        } else if (data.turn == "B") {
            let element = log[log.length - 1]
            element.B = data.notation
        }
        room.log = await log
        if (socket.request._query.id == room.playerB) {
            room.coinB = await data.coin
            room.invtB = await data.invt
        }
        if (socket.request._query.id == room.playerW) {
            room.coinW = await data.coin
            room.invtW = await data.invt
        }
        invtViewerUpdate(socket, room)
        await redisClient.set(socket.request._query.code, stringify(room), {
            NX: false
        })
        let move = {
            turn: turn,
            mine: data.mine,
            promoted: data.promoted,
            checked: data.checked,
            source: data.source,
            destination: data.destination,
            notation: data.notation,
            auctionend:room.auctionend
        }
        socket.broadcast.to(socket.request._query.code).emit(`move_server`, move)
        io.sockets.to(socket.id).emit('move_return',room.auctionend)
    })

    socket.on("drop", async (arg) => {
        const roomJSON = await redisClient.get(socket.request._query.code)
        const room = await JSON.parse(roomJSON)
        const data = JSON.parse(arg)
        let turn = await data.turn
        if (turn == "W") { turn = "B" } else if (turn == "B") { turn = "W" }
        room.board = await data.board
        room.turn = await turn
        room.mine = await data.mine
        room.turnCount = await room.turnCount + 1
        room.auctionStage = true
        room.auctionend = Date.now() + room.auctiontime * 1000
        let log = room.log
        console.log(data.notation);
        if (data.turn == "W") {
            log.push({
                W: data.notation,
                B: ''
            })
        } else if (data.turn == "B") {
            let element = log[log.length - 1]
            element.B = data.notation
        }
        room.log = await log
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
            mine: data.mine,
            piece: data.piece,
            turn: turn,
            notation: data.notation,
            auctionend:room.auctionend
        }
        socket.broadcast.to(socket.request._query.code).emit(`drop_server`, drop)
        io.sockets.to(socket.id).emit('drop_return',room.auctionend)
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
        setMineRedis(socket.request._query.code, data.mine)
    })

    socket.on("bid", async (arg) => {
        bid(arg, socket.request._query.code, socket)
    })

    socket.on("invtUpdate", async (arg) => {
        invtUpdate(socket, arg)
    })

    socket.on("get-auction", async (arg) => {
        getAuction(socket)

    })


    socket.on("disconnect", () => {
        console.log('dis')
    })
});


