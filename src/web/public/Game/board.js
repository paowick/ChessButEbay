export var board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
]
import * as pieces from './piece.js';
import { move } from './socket.js';
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { join } from './socket.js';
import { waitingForPlayer,askPlayer } from './script.js';

const currentGame = JSON.parse(localStorage.getItem("currentGame"))
const user = JSON.parse(localStorage.getItem("user"))
export var socket = io(window.location.origin, {
    query: {
        code: currentGame.code,
        id: user.id
    }
});
let myturn = false

export function changeMyTurn(data) {
    myturn = data
}
run()
export async function run() {
    socket.on('board', async (arg) => {
        const info = await JSON.parse(arg.board)
        console.log(arg);
        for (let index = 0; index < info.board.length; index++) {
            const elements = info.board[index];
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                if (element == null) { continue }
                if (element.name == 'king') {
                    new pieces.king("king", element.pos, element.team, true, board)
                    continue
                }
                if (element.name == 'queen') {
                    new pieces.queen("queen", element.pos, element.team, false, board)
                    continue
                }
                if (element.name == 'bishop') {
                    new pieces.bishop("bishop", element.pos, element.team, false, board)
                    continue
                }
                if (element.name == 'rook') {
                    new pieces.rook("rook", element.pos, element.team, false, board)
                    continue
                }
                if (element.name == 'knight') {
                    new pieces.knight("knight", element.pos, element.team, false, board)
                    continue
                }
                if (element.name == 'pawn') {
                    new pieces.pawn("pawn", element.pos, element.team, false, board, true)
                    continue
                }
            }
        }
        if (arg.role != 'viewer') {
            const join_con = document.querySelector(".join-butt-con")
            join_con.style.display = 'none'
            const inhand = document.querySelector(".inhand")
            inhand.style.display = 'none'
            if (arg.role == "B") {
                const board_white = document.querySelector('#board-white')
                board_white.style.display = "none"
                const board_black = document.querySelector('#board-black')
                board_black.style.display = 'flex'
            } else {
                const board_white = document.querySelector('#board-white')
                board_white.style.display = "flex"
                const board_black = document.querySelector('#board-black')
                board_black.style.display = 'none'
            }
        } else if (arg.role == 'viewer') {
            if (info.playerB != null) { document.querySelector('#join_black').style.display = 'none' }
            if (info.playerW != null) { document.querySelector('#join_white').style.display = 'none' }
        }
        currentGame.role = arg.role
        localStorage.setItem('currentGame', JSON.stringify(currentGame))
        if (arg.turn === arg.role) {
            myturn = true
        } else {
            myturn = false
        }
    })

}



// White_King	  = "&#9812"
// White_Queen   = "&#9813"
// White_Rook	  = "&#9814"
// White_BishopU = "&#9815"
// White_KnightU = "&#9816"
// White_Pawn	  = "&#9817"
// Black_King	  = "&#9818"
// Black_Queen	  = "&#9819"
// Black_Rook	  = "&#9820"
// Black_BishopU = "&#9821"
// Black_KnightU = "&#9822"
// Black_Pawn	  = "&#9823"

document.querySelector('#join_black')
    .addEventListener('click', () => {
        const join_con = document.querySelector(".join-butt-con")
        join_con.style.display = 'none'
        const inhand = document.querySelector(".inhand")
        inhand.style.display = 'none'
        const board_white = document.querySelector('#board-white')
        board_white.style.display = "none"
        const board_black = document.querySelector('#board-black')
        board_black.style.display = 'flex'
        const data = {
            code: currentGame.code,
            role: "B"
        }
        myturn = false
        localStorage.setItem('currentGame', JSON.stringify(data))
        join(data, user.name)
    })
document.querySelector('#join_white')
    .addEventListener('click', () => {
        const join_con = document.querySelector(".join-butt-con")
        join_con.style.display = 'none'
        const inhand = document.querySelector(".inhand")
        inhand.style.display = 'none'
        const board_white = document.querySelector('#board-white')
        board_white.style.display = "flex"
        const board_black = document.querySelector('#board-black')
        board_black.style.display = 'none'
        const data = {
            code: currentGame.code,
            role: "W"
        }
        myturn = false
        localStorage.setItem('currentGame', JSON.stringify(data))
        join(data, user.name)
    })
var source = null
var destination = null
document.querySelectorAll('.box')
    .forEach(div => {
        div.addEventListener('click', function () {
            const currentGame = JSON.parse(localStorage.getItem("currentGame"))
            if (currentGame.role != 'viewer') {
                if (source == null && destination == null) {
                    // source position ====================================================================
                    const piece = havePiece(this.id)
                    if (piece == null) { return source = null; }
                    source = this.id;
                    showMoveAble(piece)


                } else if (source != null && destination == null) {
                    // destination position ===============================================================


                    if (!myturn) {
                        waitingForPlayer()
                        clearHightLight(havePiece(source))
                        source = null;
                        destination = null;
                        return
                    }
                    const piece = havePiece(source)
                    if (currentGame.role != piece.team) {
                        clearHightLight(havePiece(source))
                        source = null
                        return
                    }
                    if (!pieceMoveable(piece, this.id)) {
                        clearHightLight(piece)
                        source = null
                        return destination = null
                    }
                    const oldpos = tranSlateTopos(source)
                    const thispiece = board[oldpos[0]][oldpos[1]];
                    if (thispiece.name == "pawn") {
                        if (thispiece.promotedPos.includes(tranSlateTopos(this.id))) {
                            destination = this.id;
                            askPlayer(source, destination)
                            clearHightLight(havePiece(source))
                            source = null
                            destination = null
                            return
                        }
                    }
                    destination = this.id;
                    clearHightLight(havePiece(source))
                    moveClient(source, destination, null)
                    source = null
                    destination = null



                    // end here ===========================================================================
                }


            }
        })


    })







export async function moveClient(source, destination, promoted) {

    const oldpos = tranSlateTopos(source)
    const newpos = tranSlateTopos(destination)
    const piece = board[oldpos[0]][oldpos[1]];
    piece.unset()
    piece.pos = newpos
    piece.setPiece()
    if (piece.firstmove != undefined) { piece.firstmove = false }
    if (typeof piece.promoted === 'function' && promoted != null) {
        const newPiece = await piece.promoted(board, promoted)
        if (newPiece != null) {
            const dataNewPiece = {
                name: newPiece.name,
                pos: newPiece.pos,
                team: newPiece.team,
                isKing: false
            }
            move(source, destination, dataNewPiece)
            destination = null
            source = null
            localStorage.setItem("board", stringify(board))
            myturn = false
        }
    }
    move(source, destination, null)
    destination = null
    source = null
    localStorage.setItem("board", stringify(board))
    myturn = false

}
export function moveClient_Server(source, destination, promoted) {
    const oldpos = tranSlateTopos(source)
    const newpos = tranSlateTopos(destination)
    const piece = board[oldpos[0]][oldpos[1]];
    piece.unset()
    piece.pos = newpos
    piece.setPiece()
    if (piece.firstmove != undefined) { piece.firstmove = false }
    if (typeof piece.promoted === 'function' && promoted != null) {
        const newPiece = piece.promoted_server(board, promoted)
        destination = null
        source = null
        localStorage.setItem("board", stringify(board))
        myturn = true
    } else {
        destination = null
        source = null
        localStorage.setItem("board", stringify(board))
        myturn = true
    }
}
function clearHightLight(piece) {
    const posList = piece.moveAblepos(board)
    posList.forEach(element => {
        const id = tranSlateToId(element)
        document.querySelectorAll(`#${id}`).forEach(element => {
            element.removeChild(element.lastChild)
            element.style.backgroundColor = ``

        })

    });
}

function showMoveAble(piece) {
    const posList = piece.moveAblepos(board)
    posList.forEach(element => {
        const id = tranSlateToId(element)

        document.querySelectorAll(`#${id}`).forEach(element => {

            if (element.childNodes.length > 0) {

                element.style.backgroundColor = `rgba(255, 0, 0,0.5)`
                element.innerHTML += `<div></div>`
                return 0
            }
            element.innerHTML += `<div class="hight-light">&#9900</div>`
        })
    });
}

function pieceMoveable(piece, source) {
    if (!piece.moveAblepos(board).includes(tranSlateTopos(source))) {
        return false
    }
    return true
}

function havePiece(id) {
    const pos = tranSlateTopos(id)
    const piece = board[pos[0]][pos[1]];
    return piece
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
function tranSlateTopos(id) {
    var temp = ""
    switch (`${id[1]}`) {
        case "8":
            temp += "0"
            break;

        case "7":
            temp += "1"
            break;

        case "6":
            temp += "2"
            break;

        case "5":
            temp += "3"
            break;

        case "4":
            temp += "4"
            break;

        case "3":
            temp += "5"
            break;

        case "2":
            temp += "6"
            break;

        case "1":
            temp += "7"
            break;
    }
    switch (`${id[0]}`) {
        case "a":
            temp += "0"
            break;

        case "b":
            temp += "1"
            break;

        case "c":
            temp += "2"
            break;

        case "d":
            temp += "3"
            break;

        case "e":
            temp += "4"
            break;

        case "f":
            temp += "5"
            break;

        case "g":
            temp += "6"
            break;

        case "h":
            temp += "7"
            break;
    }
    return temp
}


function tranSlateToId(pos) {
    var temp = ""
    switch (`${pos[1]}`) {
        case "0":
            temp += "a"
            break;

        case "1":
            temp += "b"
            break;

        case "2":
            temp += "c"
            break;

        case "3":
            temp += "d"
            break;

        case "4":
            temp += "e"
            break;

        case "5":
            temp += "f"
            break;

        case "6":
            temp += "g"
            break;

        case "7":
            temp += "h"
            break;
    }
    switch (`${pos[0]}`) {
        case "0":
            temp += "8"
            break;

        case "1":
            temp += "7"
            break;

        case "2":
            temp += "6"
            break;

        case "3":
            temp += "5"
            break;

        case "4":
            temp += "4"
            break;

        case "5":
            temp += "3"
            break;

        case "6":
            temp += "2"
            break;

        case "7":
            temp += "1"
            break;
    }
    return temp;
}