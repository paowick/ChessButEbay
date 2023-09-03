import { move } from './socket.js';
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { join } from './socket.js';
import { waitingForPlayer, askPlayer, updateJoinPop } from './script.js';
import { king } from './king.js';
import { pawn } from './pawn.js';
import { queen } from './queen.js';
import { bishop } from './bishop.js';
import { knight } from './knight.js';
import { rook } from './rook.js';
import { boardSetupUi} from './script.js';
import { boardSetUpNoStart } from './script.js';
import { dropEmit } from './socket.js';
import { mineSetUp } from './script.js';
import { drop_mine_server } from './socket.js';
import { mine } from './mine.js';
import { inventory } from './inventory.js';

var invtList = []
var mineList = []
var minelimt = 3

export var invtobj = new inventory(invtList)
export const mineobj = new mine(mineList, minelimt, 1000)

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
const currentGame = JSON.parse(localStorage.getItem("currentGame"))
const user = JSON.parse(localStorage.getItem("user"))
export var socket = io(window.location.origin, {
    query: {
        code: currentGame.code,
        id: user.id
    }
});
export let myturn = false

export function changeMyTurn(data) {
    if (data == true) {
        mineobj.changeMineDropAble(true)
    }
    myturn = data
}

// maybe it bug
window.onload = run()
export async function run() {
    socket.on('board', async (arg) => {
        invtobj.invtList.push(new queen("queen", null, arg.role, false, board, 3))
        invtobj.invtList.push(new rook("rook", null, arg.role, false, board, 3))
        invtobj.invtList.push(new knight("knight", null, arg.role, false, board, 3))
        const info = await JSON.parse(arg.board)
        info.mine.forEach(element => {
            drop_mine_server(element);
        })
        if (arg.role == "W") {
            // invtobj.invtList = info.invtW
            invtobj.invtSetUp()
            mineSetUp()
        } else if (arg.role == "B") {
            // invtobj.invtList = info.invtB
            invtobj.invtSetUp()
            mineSetUp()
        } else {
            // invtobj.invtList = []
        }
        chessBoardSetUp(info)
        uiSetUpControll(info,arg,currentGame)
    })
}



export function uiSetUpControll(info,arg,currentGame){
    if(!info.gameStart){
        boardSetUpNoStart()
        updateJoinPop(info.playerB,info.playerW,info.playerBName,info.playerWName)
        return
    }
    boardSetupUi(currentGame, info)
    if (arg.turn === arg.role) {
        myturn = true
    } else {
        myturn = false
    }
}

export function chessBoardSetUp(info) {
    for (let index = 0; index < info.board.length; index++) {
        const elements = info.board[index];
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            if (element == null) { continue }
            if (element.name == 'king') {
                new king("king", element.pos, element.team, true, board, 3)
                continue
            }
            if (element.name == 'queen') {
                new queen("queen", element.pos, element.team, false, board, 3)
                continue
            }
            if (element.name == 'bishop') {
                new bishop("bishop", element.pos, element.team, false, board, 3)
                continue
            }
            if (element.name == 'rook') {
                new rook("rook", element.pos, element.team, false, board, 3)
                continue
            }
            if (element.name == 'knight') {
                new knight("knight", element.pos, element.team, false, board, 3)
                continue
            }
            if (element.name == 'pawn') {
                new pawn("pawn", element.pos, element.team, false, board, 3, true)
                continue
            }
        }
    }
    
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
                    // console.log(new DOMParser().parseFromString(this.innerHTML, "text/xml").documentElement);
                    // source position ====================================================================
                    const piece = havePiece(this.id)
                    clearAllHightLight()
                    if (piece == null) { return source = null; }
                    source = this.id;
                    showMoveAble(piece)


                } else if (source != null && destination == null) {
                    // destination position ===============================================================
                    
                    clearAllHightLight()
                    
                    if (!myturn) {
                        waitingForPlayer()
                        clearAllHightLight()
                        source = null;
                        destination = null;
                        return
                    }
                    const piece = havePiece(source)
                    if (currentGame.role != piece.team) {
                        clearAllHightLight()
                        source = null
                        return
                    }
                    if (!pieceMoveable(piece, this.id)) {
                        clearAllHightLight()
                        source = null
                        return destination = null
                    }
                    const oldpos = tranSlateTopos(source)
                    const thispiece = board[oldpos[0]][oldpos[1]];
                    if (thispiece.name == "pawn") {
                        if (thispiece.promotedPos.includes(tranSlateTopos(this.id))) {
                            destination = this.id;
                            askPlayer(source, destination)
                            clearAllHightLight()
                            source = null
                            destination = null
                            return
                        }
                    }
                    destination = this.id;
                    clearAllHightLight()
                    moveClient(source, destination, null)
                    source = null
                    destination = null
                    
                    
                    
                    // end here ===========================================================================
                }


            }
        })
        
        
    })




export function drop(piece, destination) {
    const pos = tranSlateTopos(destination)
    piece.setpos(pos)
    piece.setInInvt(false)
    piece.setPiece()
    clearAllHightLight()
    source = null
    changeMyTurn(false)
    dropEmit(piece, destination, board)
}


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
            changeMyTurn(false)
        }
    }
    move(source, destination, null)
    destination = null
    source = null
    localStorage.setItem("board", stringify(board))
    changeMyTurn(false)
    clearAllHightLight()
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
        changeMyTurn(true)
    } else {
        destination = null
        source = null
        changeMyTurn(true)
    }
    clearAllHightLight()
}
export function clearAllHightLight() {

    document.querySelectorAll(".hight-light").forEach(div => {
        div.parentNode.removeChild(div)
    })
}


export function showMoveAble(piece) {
    const posList = piece.moveAblepos(board)
    posList.forEach(element => {
        const id = tranSlateToId(element)

        document.querySelectorAll(`#${id}`).forEach(element => {

            if (element.childNodes.length > 0) {

                element.innerHTML += `<div id="hight-light" class="hight-light hight-light-red" ></div>`
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
export function tranSlateTopos(id) {
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


export function tranSlateToId(pos) {
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