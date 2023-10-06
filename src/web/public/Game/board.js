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
import { boardSetupUi } from './script.js';
import { boardSetUpNoStart } from './script.js';
import { dropEmit } from './socket.js';
import { mineSetUp } from './script.js';
import { mine } from './mine.js';
import { inventory } from './inventory.js';
import { auction } from './auction.js';
import { bid } from './socket.js'
import { coinUpdate, coinUpdate_Server } from './script.js';
import { currentBidUpdate } from './script.js';
import { auctionStageBlink } from './script.js';
import { mainTimeInit } from './script.js';
var invtList = []
var mineList = []
var minelimt = 3
export let coin = 0

export const returnRate = {
    2: 50,
    4: 120,
    6: 150,
}
export function setCoin(data) {
    coin = data
}


export let whiteKing = null
export let blackKing = null
export const invtobj = new inventory(invtList)
export const mineobj = new mine(mineList, minelimt, 1000)
export const auctionobj = new auction(null, null, null, null, null)
export const invtBlack = new inventory([])
export const invtWhite = new inventory([])

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
    myturn = data
    mineobj.changeMineDropAble(data)
}

// maybe it bug
window.onload = run()
export async function run() {
    socket.on('board', async (arg) => {
        const info = arg.boardRedis
        invtBlack.invtSetUpViewer(info.invtB, "B")
        invtWhite.invtSetUpViewer(info.invtW, "W")
        if(arg.starttime != null){
            mainTimeInit(info.starttime)
        }
        let newMine = info.mine.filter(function (item) {
            return item !== null
        });
        newMine.forEach(element => {
            mineobj.drop_mine_server(element);
        })
        if (arg.role == "W") {
            info.invtW.forEach(element => {
                invtobj.invtPush(invtobj.pieceToObj(element.name))
            })
            invtobj.invtSetUp()
            mineSetUp()
        } else if (arg.role == "B") {
            info.invtB.forEach(element => {
                invtobj.invtPush(invtobj.pieceToObj(element.name))
            })
            invtobj.invtSetUp()
            mineSetUp()
        }
        currentBidUpdate(info)
        auctionobj.auctionSetUp(info)
        chessBoardSetUp(info)
        uiSetUpControll(info, arg, currentGame)
    })
}


export function uiSetUpControll(info, arg, currentGame) {
    if (!info.gameStart) {
        boardSetUpNoStart()
        updateJoinPop(info.playerB, info.playerW, info.playerBName, info.playerWName)
        return
    }
    boardSetupUi(currentGame, info)
    if (arg.turn === arg.role) {
        myturn = true
    } else {
        myturn = false
    }
    coinUpdate_Server(info)
}




export function chessBoardSetUp(info) {
    for (let index = 0; index < info.board.length; index++) {
        const elements = info.board[index];
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            if (element == null) { continue }
            if (element.name == 'king') {
                if (element.checked == undefined) {
                    element.checked = false
                }
                if (element.team == "W") {
                    whiteKing = new king("king", element.pos, element.team, true, board, 2, element.checked)
                }
                if (element.team == "B") {
                    blackKing = new king("king", element.pos, element.team, true, board, 2, element.checked)
                }
                continue
            }
            if (element.name == 'queen') {
                new queen("queen", element.pos, element.team, false, board, 2)
                continue
            }
            if (element.name == 'bishop') {
                new bishop("bishop", element.pos, element.team, false, board, 2)
                continue
            }
            if (element.name == 'rook') {
                new rook("rook", element.pos, element.team, false, board, 2)
                continue
            }
            if (element.name == 'knight') {
                new knight("knight", element.pos, element.team, false, board, 2)
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



document.querySelector('#bid-butt')
    .addEventListener('click', () => {
        const amout = document.querySelector('#bid-input').value
        bid(amout)
        document.querySelector('#bid-input').value = ''
    })

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
export function setSourceNull() {
    source = null
}
let onDrop = false
export function setOnDrop(stage){
    onDrop = stage
}
document.querySelectorAll('.box').forEach(div => {
    div.addEventListener('click', function () {
        const currentGame = JSON.parse(localStorage.getItem("currentGame"))
        if (currentGame.role != 'viewer') {
            if (source == null && destination == null) {
                // console.log(new DOMParser().parseFromString(this.innerHTML, "text/xml").documentElement);
                // source position ====================================================================

                document.querySelector("#askmine-con").style.display = "none"
                document.querySelector("#askmine-pop").removeAttribute("show")
                document.querySelector("#askmine-pop").style.visibility = "hidden"
                document.querySelector('#mine').style.borderColor = "#252525"
                if(onDrop){
                    onDrop = false
                    return
                }       
                if (auctionobj.auctionStage == true) {
                    auctionStageBlink()
                    return
                }
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
                if (!piece.moveAblepos(board).includes(tranSlateTopos(this.id))) {
                    source = null
                    destination = null
                    return
                }
                if (piece.name == "king") {
                    if (piece.checked == false) {
                        if (this.id == 'g1' || this.id == 'c1' ||
                            this.id == 'g8' || this.id == 'c8') {
                            castle(source, this.id)
                            source = null
                            destination = null
                            clearAllHightLight()
                            return
                        }
                    }
                    moveClient(source, this.id, null)
                    source = null
                    destination = null
                    clearAllHightLight()
                    return
                }
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
                if (piece.name == "pawn") {
                    if (piece.promotedPos.includes(tranSlateTopos(this.id))) {
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


function castle(source, destination) {
    const newpos = tranSlateTopos(destination)
    const piece = havePiece(source)
    piece.setChecked(true)
    console.log(piece);
    let kingSource = source
    let kingDestination = destination
    let notation = null
    if (tranSlateTopos(destination)[1] == 6) {
        if (piece.team == "W") {
            if (tranSlateTopos(destination)[0] != 7) { return }
            const rook = havePiece("h1")
            piece.unset()
            piece.pos = newpos
            piece.setPiece()
            rook.unset()
            rook.pos = tranSlateTopos("f1")
            rook.setPiece()
            notation = "0-0"
        }
        if (piece.team == "B") {
            if (tranSlateTopos(destination)[0] != 0) { return }
            const rook = havePiece("h8")
            piece.unset()
            piece.pos = newpos
            piece.setPiece()
            rook.unset()
            rook.pos = tranSlateTopos("f8")
            rook.setPiece()
            notation = "0-0"
        }

    }
    if (tranSlateTopos(destination)[1] == 2) {
        if (piece.team == "W") {
            if (tranSlateTopos(destination)[0] != 7) { return }
            const rook = havePiece("a1")
            piece.unset()
            piece.pos = newpos
            piece.setPiece()
            rook.unset()
            rook.pos = tranSlateTopos("d1")
            rook.setPiece()
            notation = "0-0-0"
        }
        if (piece.team == "B") {
            if (tranSlateTopos(destination)[0] != 0) { return }
            const rook = havePiece("a8")
            piece.unset()
            piece.pos = newpos
            piece.setPiece()
            rook.unset()
            rook.pos = tranSlateTopos("d8")
            rook.setPiece()
            notation = "0-0-0"
        }
    }
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
    let data = {
        turn: currentGame.role,
        kingSource: kingSource,
        kingDestination: kingDestination,
        board: board,
        mine: mineValidate,
        invt: invtValidate,
        coin: coin,
        notation: notation
    }
    changeMyTurn(false)
    auctionobj.setAuctionStage(true)
    socket.emit("castle", stringify(data))
    const turndoc = document.querySelectorAll("#turn")
    turndoc.forEach(ele => {
        if (currentGame.role == "B") {
            ele.style.backgroundColor = "white"
            if (currentGame.role == "W") {
                ele.innerHTML = "Your Turn!"
                ele.style.color = "black"
            } else {
                ele.innerHTML = "White Turn"
                ele.style.color = "black"
            }
        }
        if (currentGame.role == "W") {
            ele.style.backgroundColor = "black"
            if (currentGame.role == "B") {
                ele.innerHTML = "Your Turn!"
                ele.style.color = "white"
            } else {
                ele.innerHTML = "Balck Turn"
                ele.style.color = "white"
            }

        }
    })
}
export function castle_server(source, destination, turn) {

    const newpos = tranSlateTopos(destination)
    const piece = havePiece(source)
    piece.setChecked(true)
    console.log(piece);
    if (tranSlateTopos(destination)[1] == 6) {
        if (piece.team == "W") {
            console.log("h");
            const rook = havePiece("h1")
            piece.unset()
            piece.pos = newpos
            piece.setPiece()
            rook.unset()
            rook.pos = tranSlateTopos("f1")
            rook.setPiece()
        }
        if (piece.team == "B") {
            const rook = havePiece("h8")
            piece.unset()
            piece.pos = newpos
            piece.setPiece()
            rook.unset()
            rook.pos = tranSlateTopos("f8")
            rook.setPiece()
        }

    }
    if (tranSlateTopos(destination)[1] == 2) {
        if (piece.team == "W") {
            console.log("h2");
            const rook = havePiece("a1")
            piece.unset()
            piece.pos = newpos
            piece.setPiece()
            rook.unset()
            rook.pos = tranSlateTopos("d1")
            rook.setPiece()
        }
        if (piece.team == "B") {
            const rook = havePiece("a8")
            piece.unset()
            piece.pos = newpos
            piece.setPiece()
            rook.unset()
            rook.pos = tranSlateTopos("d8")
            rook.setPiece()

        }
    }
    auctionobj.setAuctionStage(true)
    clearAllHightLight()
    changeMyTurn(true)

    const turndoc = document.querySelectorAll("#turn")
    turndoc.forEach(ele => {
        if (turn == "W") {
            ele.style.backgroundColor = "white"
            if (currentGame.role == "W") {
                ele.innerHTML = "Your Turn!"
                ele.style.color = "black"
            } else {
                ele.innerHTML = "White Turn"
                ele.style.color = "black"
            }
        }
        if (turn == "B") {
            ele.style.backgroundColor = "black"
            if (currentGame.role == "B") {
                ele.innerHTML = "Your Turn!"
                ele.style.color = "white"
            } else {
                ele.innerHTML = "Balck Turn"
                ele.style.color = "white"
            }

        }
    })
}

export function drop(piece, destination, invtId) {

    notation = ''
    notation = `${pieceToNotation[piece.name]}*${destination}`
    console.log(notation);
    const pos = tranSlateTopos(destination)
    piece.setpos(pos)
    piece.setInInvt(false)
    piece.setPiece()
    invtobj.removeInvtList(invtId)
    source = null
    changeMyTurn(false)
    clearAllHightLight()
    dropEmit(piece, board, notation)
    auctionobj.setAuctionStage(true)
    const turndoc = document.querySelectorAll("#turn")
    turndoc.forEach(ele => {
        if (currentGame.role == "B") {
            ele.style.backgroundColor = "white"
            if (currentGame.role == "W") {
                ele.innerHTML = "Your Turn!"
                ele.style.color = "black"
            } else {
                ele.innerHTML = "White Turn"
                ele.style.color = "black"
            }
        }
        if (currentGame.role == "W") {
            ele.style.backgroundColor = "black"
            if (currentGame.role == "B") {
                ele.innerHTML = "Your Turn!"
                ele.style.color = "white"
            } else {
                ele.innerHTML = "Balck Turn"
                ele.style.color = "white"
            }

        }
    })
}

let notation = ''
const pieceToNotation = {
    "pawn": "P",
    "knight": "N",
    "bishop": "B",
    "rook": "R",
    "queen": "Q",
    "king": "K",
};
export function logConv(source, destination, promoted) {
    // Reversible algebraic Chess notation
    notation = ''
    const oldpos = tranSlateTopos(source);
    const newpos = tranSlateTopos(destination);
    const sourcepiece = board[oldpos[0]][oldpos[1]];
    const destinationpiece = board[newpos[0]][newpos[1]];

    if (destinationpiece == null) {
        notation = `${pieceToNotation[sourcepiece.name]}${source}-${destination}`
    }
    if (destinationpiece != null) {
        notation = `${pieceToNotation[sourcepiece.name]}${source}x${pieceToNotation[destinationpiece.name]}${destination}`
    }
}
export function logKingCheck(piece) {
    const moveable = piece.moveAblepos(board)
    moveable.forEach(element => {
        const box = board[element[0]][element[1]]
        if (box != null) {
            if (box.name == "king" && box.team != piece.team) {
                box.setChecked(true)
                notation += "+"
            }
        }
    })
}
export async function moveClient(source, destination, promoted) {
    const oldpos = tranSlateTopos(source)
    const newpos = tranSlateTopos(destination)
    logConv(source, destination, promoted)
    const piece = board[oldpos[0]][oldpos[1]];
    piece.unset()
    piece.pos = newpos
    piece.setPiece()
    logKingCheck(piece)
    if (piece.name == 'king') {
        piece.setChecked(true)
        move(source, destination, null, piece, notation)
        destination = null
        source = null
        changeMyTurn(false)
        const turndoc = document.querySelectorAll("#turn")
        turndoc.forEach(ele => {
            if (currentGame.role == "B") {
                ele.style.backgroundColor = "white"
                if (currentGame.role == "W") {
                    ele.innerHTML = "Your Turn!"
                    ele.style.color = "black"
                } else {
                    ele.innerHTML = "White Turn"
                    ele.style.color = "black"
                }
            }
            if (currentGame.role == "W") {
                ele.style.backgroundColor = "black"
                if (currentGame.role == "B") {
                    ele.innerHTML = "Your Turn!"
                    ele.style.color = "white"
                } else {
                    ele.innerHTML = "Balck Turn"
                    ele.style.color = "white"
                }

            }
        })
        return
    }
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
            move(source, destination, dataNewPiece, null, notation)
            destination = null
            source = null
            localStorage.setItem("board", stringify(board))
            changeMyTurn(false)
        }
    }
    move(source, destination, null, null, notation)
    destination = null
    source = null
    localStorage.setItem("board", stringify(board))
    auctionobj.setAuctionStage(true)
    changeMyTurn(false)
    clearAllHightLight()
    const turndoc = document.querySelectorAll("#turn")
    turndoc.forEach(ele => {
        if (currentGame.role == "B") {
            ele.style.backgroundColor = "white"
            if (currentGame.role == "W") {
                ele.innerHTML = "Your Turn!"
                ele.style.color = "black"
            } else {
                ele.innerHTML = "White Turn"
                ele.style.color = "black"
            }
        }
        if (currentGame.role == "W") {
            ele.style.backgroundColor = "black"
            if (currentGame.role == "B") {
                ele.innerHTML = "Your Turn!"
                ele.style.color = "white"
            } else {
                ele.innerHTML = "Balck Turn"
                ele.style.color = "white"
            }

        }
    })
}
export function moveClient_Server(turn, source, destination, promoted, pos) {
    const oldpos = tranSlateTopos(source)
    const newpos = tranSlateTopos(destination)
    const piece = board[oldpos[0]][oldpos[1]];
    piece.unset()
    piece.pos = newpos
    piece.setPiece()
    if (pos != null) {
        board[pos[0]][pos[1]].setChecked(true)
    }
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

    auctionobj.setAuctionStage(true)
    clearAllHightLight()

    const turndoc = document.querySelectorAll("#turn")
    turndoc.forEach(ele => {
        if (turn == "W") {
            ele.style.backgroundColor = "white"
            if (currentGame.role == "W") {
                ele.innerHTML = "Your Turn!"
                ele.style.color = "black"
            } else {
                ele.innerHTML = "White Turn"
                ele.style.color = "black"
            }
        }
        if (turn == "B") {
            ele.style.backgroundColor = "black"
            if (currentGame.role == "B") {
                ele.innerHTML = "Your Turn!"
                ele.style.color = "white"
            } else {
                ele.innerHTML = "Balck Turn"
                ele.style.color = "white"
            }

        }
    })
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