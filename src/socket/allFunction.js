import { redisClient, io } from './socket.js';


export async function invtUpdate(socket, arg) {
    const data = JSON.parse(arg);
    const roomJSON = await redisClient.get(socket.request._query.code);
    const room = await JSON.parse(roomJSON);
    if (socket.request._query.id == room.playerB) {
        room.invtB = await data.invt;
    }
    if (socket.request._query.id == room.playerW) {
        room.invtW = await data.invt;
    }
    await redisClient.set(socket.request._query.code, stringify(room), {
        NX: false
    });
    invtViewerUpdate(socket, room);
}export async function invtViewerUpdate(socket, room) {
    const data = {
        playerB: room.playerB,
        playerW: room.playerW,
        invtB: room.invtB,
        invtW: room.invtW,
        coinB: room.coinB,
        coinW: room.coinW,
    };
    io.sockets.to(socket.request._query.code).emit(`invtViewerUpdate`, data);
}
export async function getAuction(socket) {
    const roomJSON = await redisClient.get(socket.request._query.code);
    const room = await JSON.parse(roomJSON);
    const slotTemp = room.auctionslot1;
    const bidderTemp = room.currentBidder;
    room.auctionslot1 = room.auctionslot2;
    room.auctionslot2 = getRandomChessPiece(room.turnCount);
    room.currentBid = 0;
    room.currentBidder = null;
    room.auctionStage = false;
    const data = {
        id: bidderTemp,
        newPiece: slotTemp,
        room: room
    };
    io.sockets.to(socket.request._query.code).emit(`get-piece_auction_server`, data);
    redisClient.set(socket.request._query.code, stringify(room), {
        NX: false
    });
}
export async function bid(arg, code, socket) {
    const roomJSON = await redisClient.get(code);
    const room = await JSON.parse(roomJSON);
    if (arg.id == room.playerB) {
        if (arg.amout > room.coinB) { return; }
        room.coinB -= arg.amout;
    }
    if (arg.id == room.playerW) {
        if (arg.amout > room.coinW) { return; }
        room.coinW -= arg.amout;
    }
    if (room.currentBidder == arg.id) { return; }
    if (room.currentBid < arg.amout) {
        room.currentBid = arg.amout;
        room.currentBidder = arg.id;
        redisClient.set(code, stringify(room), {
            NX: false
        });
        io.sockets.to(socket.request._query.code).emit(`bid_server`, stringify(room));
    }
}
export function getRandomChessPiece(turnCount) {
    const randomNum = Math.random() * 100; // Generate a random number between 0 and 100


    // Define the percentages for each chess piece
    let percentages = null;
    if (turnCount <= 4) {
        percentages = {
            'pawn': 100,
            'rook': 0,
            'knight': 0,
            'bishop': 0,
            'queen': 0,
        };
    }
    if (turnCount > 4 && turnCount <= 10) {
        percentages = {
            'pawn': 70,
            'rook': 10,
            'knight': 10,
            'bishop': 10,
            'queen': 0,
        };
    }
    if (turnCount > 10) {
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
export async function dropmineInvtRedis(socket, data) {
    const roomJSON = await redisClient.get(socket.request._query.code);
    const room = await JSON.parse(roomJSON);
    room.mine = await data.mine;
    if (socket.request._query.id == room.playerB) {
        room.invtB = await data.invt;
    }
    if (socket.request._query.id == room.playerW) {
        room.invtW = await data.invt;
    }
    redisClient.set(socket.request._query.code, stringify(room), {
        NX: false
    });
    invtViewerUpdate(socket, room);
}
export async function setMineRedis(code, mine) {
    const roomJSON = await redisClient.get(code);
    const room = await JSON.parse(roomJSON);
    room.mine = await mine;
    redisClient.set(code, stringify(room), {
        NX: false
    });
}
export async function storedata(arg, socket) {
    const roomJSON = await redisClient.get(arg.data.code);
    const room = await JSON.parse(roomJSON);
    if (socket.request._query.id == room.playerB) {
        room.playerBName = null;
        room.playerB = null;
    }
    if (socket.request._query.id == room.playerW) {
        room.playerWName = null;
        room.playerW = null;
    }

    if (arg.data.role == 'B' && room.playerB == null) {
        room.playerB = socket.request._query.id;
        room.playerBName = arg.username;
    }
    if (arg.data.role == 'W' && room.playerW == null) {
        room.playerW = socket.request._query.id;
        room.playerWName = arg.username;
    }
    if (room.playerB != null && room.playerW != null) {
        room.turn = "W";
    }
    redisClient.set(arg.data.code, stringify(room), {
        NX: false
    });
    return room;
}
export function now() {
    var date = new Date();
    let now = new Date(date.valueOf() + 25200000);
    return ((now.getMonth() + 1) + '/' +
        (now.getDate()) + '/' +
        now.getFullYear() + " " +
        now.getHours() + ':' +
        ((now.getMinutes() < 10)
            ? ("0" + now.getMinutes())
            : (now.getMinutes())) + ':' +
        ((now.getSeconds() < 10)
            ? ("0" + now.getSeconds())
            : (now.getSeconds())));
}
export function stringify(obj) {
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

