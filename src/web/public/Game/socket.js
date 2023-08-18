import { board, moveClient_Server } from "./board.js";
import { socket } from "./board.js";
import { changeMyTurn } from "./board.js";
import { winPop } from "./script.js";
import { run } from "./board.js";
import { king } from './king.js';
import { pawn } from './pawn.js';
import { queen } from './queen.js';
import { bishop } from './bishop.js';
import { knight } from './knight.js';
import { rook } from './rook.js';
import { invtList,mineList } from "./board.js";
import { mineSetUp } from "./script.js";
import { mineListPush } from "./board.js";
import { mineDropAble,chaangeMineDropAble } from "./board.js";
const user = JSON.parse(localStorage.getItem('user'))


export function move(source, destination, promoted) {
    console.log(`socket ${promoted}`);
    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    let data = {
        promoted: promoted,
        turn: currentGame.role,
        source: source,
        destination: destination,
        board: board
    }
    if (destination != source) {
        socket.emit("move", stringify(data))
    }
}
import('./board.js').then(({ socket }) => {
    socket.on('move_server', (arg) => {
        moveClient_Server(arg.source, arg.destination, arg.promoted)
    })

    socket.on('join_server', async (arg) => {
        const info = JSON.parse(arg.board)
        if (info.playerB != null) { document.querySelector('#join_black').style.display = 'none' }
        if (info.playerW != null) { document.querySelector('#join_white').style.display = 'none' }
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
    })

    socket.on('drop_server', async (arg) => {
        const currentGame = JSON.parse(localStorage.getItem("currentGame"))
        console.log(arg);
        if (arg.turn === currentGame.role) {
            changeMyTurn(true)
        } else {
            changeMyTurn(false)
        }
        drop_server(arg.piece)
    })

    socket.on('drop_mine_server', async (arg) => {
        chaangeMineDropAble(true)
        drop_mine_server(arg.piece)
    
    })
}).catch((error) => {
    console.error('Error loading socket:', error);
});

export function drop_mine_server(element) {
    if (element.name == 'king') {
        mineListPush(new king("king", element.pos, element.team, true, board, 3))
        return
    }
    if (element.name == 'queen') {
        mineListPush(new queen("queen", element.pos, element.team, false, board, 3))
        return
    }
    if (element.name == 'bishop') {
        mineListPush(new bishop("bishop", element.pos, element.team, false, board, 3))
        return
    }
    if (element.name == 'rook') {
        mineListPush(new rook("rook", element.pos, element.team, false, board, 3))
        return
    }
    if (element.name == 'knight') {
        mineListPush(new knight("knight", element.pos, element.team, false, board, 3))
        return
    }
    if (element.name == 'pawn') {
        mineListPush(new pawn("pawn", element.pos, element.team, false, board, 3, true))
        return
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

export function dropEmit(piece, des, board) {
    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    let data = {
        turn: currentGame.role,
        piece: {
            name: piece.name,
            pos: piece.pos,
            team: piece.team,
            isKing: piece.isKing,
            inInvt: piece.inInvt,
            timeInMine: piece.timeInMine
        },
        board: board
    }
    socket.emit('drop', stringify(data))
}

export function dropMineEmit(piece,board) {
    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    let data = {
        turn: currentGame.role,
        piece: {
            name: piece.name,
            pos: piece.pos,
            team: piece.team,
            isKing: piece.isKing,
            inInvt: piece.inInvt,
            timeInMine: piece.timeInMine
        },
        mine : mineList,
        board: board
    }
    socket.emit('drop_mine', stringify(data))
}

export function join(game, username) {
    let data = {
        data: game,
        username: username
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
