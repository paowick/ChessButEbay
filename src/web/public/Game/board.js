import * as pieces from './piece.js';
import { move } from './socket.js';
window.onload = async () => {
    const code = localStorage.getItem("currentGame")
    const res = await fetch(`/getboardInfo?code=${code}`)
    if(res.status == 500 ){window.location = '/'}
    const info = await res.json()
    for (let index = 0; index < info.data.length; index++) {
        const elements = info.data[index];
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];
            if (element == null) { continue }
            console.log(element);
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
}
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


var source = null
var destination = null
document.querySelectorAll('.box')
    .forEach(div => {
        div.addEventListener('click', function () {


            if (source == null && destination == null) {
                // source position ====================================================================

                // if (!myTurn) { return source = null; }
                const piece = havePiece(this.id)
                if (piece == null) { return source = null; }
                source = this.id;
                showMoveAble(piece)


            } else if (source != null && destination == null) {
                // destination position ===============================================================


                const piece = havePiece(source)
                if (!pieceMoveable(piece, this.id)) {
                    clearHightLight(piece)
                    source = null
                    return destination = null
                }
                destination = this.id;
                clearHightLight(havePiece(source))
                moveClient(source, destination)
                source = null
                destination = null




                // end here ===========================================================================
            }



        })
    })


function moveClient(source, destination) {
    const oldpos = tranSlateTopos(source)
    const newpos = tranSlateTopos(destination)
    const piece = board[oldpos[0]][oldpos[1]];
    piece.unset()
    piece.pos = newpos
    piece.setPiece()
    if (piece.firstmove != undefined) { piece.firstmove = false }
    move(source, destination)
    destination = null
    source = null
}
export function moveClient_Server(source, destination) {
    const oldpos = tranSlateTopos(source)
    const newpos = tranSlateTopos(destination)
    const piece = board[oldpos[0]][oldpos[1]];
    piece.unset()
    piece.pos = newpos
    piece.setPiece()
    if (piece.firstmove != undefined) { piece.firstmove = false }
    destination = null
    source = null
}
function clearHightLight(piece) {
    const posList = piece.moveAblepos(board)
    posList.forEach(element => {
        const id = tranSlateToId(element)
        document.getElementById(id).removeChild(document.getElementById(id).lastChild)
        document.getElementById(id).style.backgroundColor = ``

    });
}

function showMoveAble(piece) {
    const posList = piece.moveAblepos(board)
    posList.forEach(element => {
        const id = tranSlateToId(element)
        if (document.getElementById(id).childNodes.length > 0) {

            document.getElementById(id).style.backgroundColor = `rgba(255, 0, 0,0.5)`
            document.getElementById(id).innerHTML += `<div></div>`
            return 0
        }
        document.getElementById(id).innerHTML += `<div class="hight-light">&#9900</div>`
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