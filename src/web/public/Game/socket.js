import { board, moveClient_Server } from "./board.js";
import { socket } from "./board.js";
import { changeMyTurn } from "./board.js";
import { winPop } from "./script.js";
import { king } from './king.js';
import { pawn } from './pawn.js';
import { queen } from './queen.js';
import { bishop } from './bishop.js';
import { knight } from './knight.js';
import { rook } from './rook.js';
import { mineobj } from "./board.js";
import { startGame } from "./script.js";
import { updateJoinPop } from "./script.js";
import { coin } from "./board.js";
import { coinUpdate,coinUpdate_Server } from "./script.js";
import { currentBidUpdate } from "./script.js";
import { auctionobj } from "./board.js";
import { invtobj } from "./board.js";
import { mine } from "./mine.js";
const user = JSON.parse(localStorage.getItem('user'))

document.querySelector("#test").addEventListener("click", () => {
    if(auctionobj.auctionStage){ 
        socket.emit('test-auction', "test")
    }
})


import('./board.js').then(({ socket }) => {
    socket.on('move_server', (arg) => {
        mineobj.mineListCount()
        moveClient_Server(arg.source, arg.destination, arg.promoted)
    })
    
    socket.on('get-piece_auction_server', async (arg) => {
        const user = JSON.parse(localStorage.getItem('user'))
        if(user.id == arg.id){
            invtobj.invtPush(invtobj.pieceToObj(arg.newPiece))
            invtUpdate()
            invtobj.invtSetUp()
        }
        auctionobj.setAuctionStage(arg.room.auctionStage)
        auctionobj.auctionSetUp(arg.room)
        currentBidUpdate(arg.room)
        coinUpdate_Server(arg.room)
    })

    socket.on('join_server', async (arg) => {
        const info = JSON.parse(arg.board)
        updateJoinPop(info.playerB, info.playerW, info.playerBName, info.playerWName)
    })

    socket.on('win_server', async (arg) => {
        winPop(arg)
    })

    socket.on('start', async (arg) => {

        const currentGame = JSON.parse(localStorage.getItem("currentGame"))
        const info = JSON.parse(arg.board)
        if (info.turn === currentGame.role) {
            changeMyTurn(true)
        } else {
            changeMyTurn(false)
        }
        startGame(info, arg, currentGame)
    })

    socket.on('drop_server', async (arg) => {
        const currentGame = JSON.parse(localStorage.getItem("currentGame"))
        mineobj.mineListCount()
        if (arg.turn === currentGame.role) {
            changeMyTurn(true)
        } else {
            changeMyTurn(false)
        }
        drop_server(arg.piece)
    })

    socket.on('drop_mine_server', async (arg) => {
        mineobj.drop_mine_server(arg.piece)

    })

    socket.on('bid_server', async (arg) => {
        const info = await JSON.parse(arg)
        currentBidUpdate(info)
        coinUpdate_Server(info)
    }) 
}).catch((error) => {
    console.error('Error loading socket:', error);
});


export function bid(amout) {
    if(auctionobj.auctionStage == false){ return }
    if (amout == "") { return }
    amout = parseInt(amout)
    if (amout == 0) { return }
    if (isNaN(amout)) { return }
    if (amout > coin) { return }
    const user = JSON.parse(localStorage.getItem('user'))
    const data = {
        id: user.id,
        amout: amout
    }
    socket.emit('bid', data)
}

export function invtUpdate(){
    const invtValidate = [] 
    invtobj.invtList.forEach(element => {
        element.board = null
        invtValidate.push(element)
    });
    let data = {
        invt: invtValidate,
}
    socket.emit('invtUpdate', stringify(data))
}

export function mineUpdate(mine,isReturn) {
    const mineValidate = []
    mine.forEach(element => {
        element.board = null
        mineValidate.push(element)
    });
    const invtValidate = []
    invtobj.invtList.forEach(element => {
        element.board = null
        invtValidate.push(element)
    });
    let data = {
        mine: mineValidate
    }
    if(isReturn){return}
    socket.emit('mineUpdate', stringify(data))
}

export function move(source, destination, promoted) {
    mineobj.mineListCount()
    const mineValidate = []
    mineobj.mineList.forEach(element => {
        element.board = null
        mineValidate.push(element)
    });
    const invtValidate = []
    invtobj.invtList.forEach(element => {
        element.board = null
        invtValidate.push(element)
    });
    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    let data = {
        promoted: promoted,
        turn: currentGame.role,
        source: source,
        destination: destination,
        board: board,
        mine: mineValidate,
        invt: invtValidate,
    }
    if (destination != source) {
        socket.emit("move", stringify(data))
    }
}

function drop_server(element) {

    if (element.name == 'king') {
        new king("king", element.pos, element.team, true, board, 3)
        return
    }
    if (element.name == 'queen') {
        new queen("queen", element.pos, element.team, false, board, 3)
        return
    }
    if (element.name == 'bishop') {
        new bishop("bishop", element.pos, element.team, false, board, 3)
        return
    }
    if (element.name == 'rook') {
        new rook("rook", element.pos, element.team, false, board, 3)
        return
    }
    if (element.name == 'knight') {
        new knight("knight", element.pos, element.team, false, board, 3)
        return
    }
    if (element.name == 'pawn') {
        new pawn("pawn", element.pos, element.team, false, board, 3, true)
        return
    }
}

export function returnPieceFromMine(){
}

export function dropEmit(piece, des, board) {
    mineobj.mineListCount()
    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    const invtValidate = [] 
    invtobj.invtList.forEach(element => {
        element.board = null
        invtValidate.push(element)
    });
    const mineValidate = []
    mineobj.mineList.forEach(element => {
        element.board = null
        mineValidate.push(element)
    });
    let data = {
        turn: currentGame.role,
        piece: {
            name: piece.name,
            pos: piece.pos,
            team: piece.team,
            isKing: piece.isKing,
            inInvt: piece.inInvt,
            timeInMine: piece.timeInMine,
        },
        mine: mineValidate,
        invt: invtValidate,
        board: board
    }
    socket.emit('drop', stringify(data))
}

export function dropMineEmit(piece, board, mine) {
    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    piece.setCurrentTimeInMine()
    const invtValidate = [] 
    invtobj.invtList.forEach(element => {
        element.board = null
        invtValidate.push(element)
    });
    const mineValidate = []
    mine.forEach(element => {
        element.board = null
        mineValidate.push(element)
    });
    let data = {
        turn: currentGame.role,
        piece: {
            name: piece.name,
            pos: piece.pos,
            team: piece.team,
            isKing: piece.isKing,
            inInvt: piece.inInvt,
            timeInMine: piece.timeInMine,
            currentTimeInMine: piece.currentTimeInMine
        },
        mine: mineValidate,
        invt: invtValidate,
        board: board
    }
    socket.emit('drop_mine', stringify(data))
}

export function join(game, username) {
    let data = {
        data: game,
        username: username,
    }
    import('./board.js').then(({ socket }) => {
        socket.emit('join', data)
    }).catch((error) => {
        console.error('Error loading socket:', error);
    })
}
export function win(team) {
    let data = {
        team: team,
        username: user.id
    }
    import('./board.js').then(({ socket }) => {
        socket.emit('win', data)
    }).catch((error) => {
        console.error('Error loading socket:', error);
    })
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
