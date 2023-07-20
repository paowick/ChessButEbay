import { pieces, king } from './piece.js';



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

var board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
]

var kingWhite = new king("king", "02", board)


var source = null
var destination = null
document.querySelectorAll('.box')
    .forEach(div => {
        div.addEventListener('click', function () {
            console.log();
            if (source == null && destination == null) {
                const piece = havePiece(this.id)
                if (piece == null) { return source = null; }
                source = this.id;
                showMoveAble(piece)
            } else if (source != null && destination == null) {
                const piece = havePiece(source)
                if (!pieceMoveable(piece, this.id)) { return destination = null }
                destination = this.id;
                clearHightLight(havePiece(source))
                moveClient(source, destination)
                source = null
                destination = null
            }
        })
    })

    
function clearHightLight(piece) {
    const posList = piece.moveAblepos()
    posList.forEach(element => {
        const id = tranSlateToId(element)
        console.log(document.getElementById(id).classList);
        if (document.getElementById(id).classList[0] == `boxwhite-hight-light`) {
            document.getElementById(id).setAttribute('class', `boxwhite`)
        }
        if (document.getElementById(id).classList[0] == `boxblack-hight-light`) {
            document.getElementById(id).setAttribute('class', `boxblack`)
        }
    });
}

function showMoveAble(piece) {
    const posList = piece.moveAblepos()
    posList.forEach(element => {
        const id = tranSlateToId(element)
        if (document.getElementById(id).classList[0] == `boxblack`) {
            document.getElementById(id).setAttribute('class', `boxblack-hight-light`)
        }
        if (document.getElementById(id).classList[0] == `boxwhite`) {
            document.getElementById(id).setAttribute('class', `boxwhite-hight-light`)
        }
    });
}

function pieceMoveable(piece, source) {
    if (!piece.moveAblepos().includes(tranSlateTopos(source))) {
        return false
    }
    return true
}

function havePiece(id) {
    const pos = tranSlateTopos(id)
    const piece = board[pos[0]][pos[1]];
    return piece
}

function move(source, destination) {
    if (destination != source) {
        socket.emit("move", {
            source: source,
            destination: destination
        })


        destination = null
        source = null
    } else {
        destination = null
        source = null
    }

}

function moveClient(source, destination) {
    const oldpos = tranSlateTopos(source)
    const newpos = tranSlateTopos(destination)
    const piece = board[oldpos[0]][oldpos[1]];
    piece.unset()
    piece.pos = newpos
    piece.setPiece()
    move(source, destination)
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