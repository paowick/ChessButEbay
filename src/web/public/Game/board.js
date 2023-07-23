import * as pieces from './piece.js';



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

new pieces.king("king", "74", "W", true,board)
new pieces.queen("queen", "73", "W", false,board)
new pieces.bishop("bishop", "72", "W", false,board)
new pieces.bishop("bishop", "75", "W", false,board)
new pieces.rook("rook", "70", "W", false,board)
new pieces.rook("rook", "77", "W", false,board)
new pieces.knight("knight", "71", "W", false,board)
new pieces.knight("knight", "76", "W", false,board)

new pieces.pawn("pawn", "60", "W", false,board,true)
new pieces.pawn("pawn", "61", "W", false,board,true)
new pieces.pawn("pawn", "62", "W", false,board,true)
new pieces.pawn("pawn", "63", "W", false,board,true)
new pieces.pawn("pawn", "64", "W", false,board,true)
new pieces.pawn("pawn", "65", "W", false,board,true)
new pieces.pawn("pawn", "66", "W", false,board,true)
new pieces.pawn("pawn", "67", "W", false,board,true)


new pieces.king("king", "04", "B", true,board)
new pieces.queen("queen", "03", "B", false,board)
new pieces.bishop("bishop", "02", "B", false,board)
new pieces.bishop("bishop", "05", "B", false,board)
new pieces.rook("rook", "00", "B", false,board)
new pieces.rook("rook", "07", "B", false,board)
new pieces.knight("knight", "01", "B", false,board)
new pieces.knight("knight", "06", "B", false,board)

new pieces.pawn("pawn", "10", "B", false,board,true)
new pieces.pawn("pawn", "11", "B", false,board,true)
new pieces.pawn("pawn", "12", "B", false,board,true)
new pieces.pawn("pawn", "13", "B", false,board,true)
new pieces.pawn("pawn", "14", "B", false,board,true)
new pieces.pawn("pawn", "15", "B", false,board,true)
new pieces.pawn("pawn", "16", "B", false,board,true)
new pieces.pawn("pawn", "17", "B", false,board,true)

var source = null
var destination = null
document.querySelectorAll('.box')
    .forEach(div => {
        div.addEventListener('click', function () {


            if (source == null && destination == null) {
                // source position ====================================================================

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
    if(piece.firstmove != undefined){piece.firstmove = false}
    // move(source, destination)
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