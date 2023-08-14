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

new pieces.king("king", "74", "W", true, board)
// new pieces.queen("queen", "73", "W", false, board)
// new pieces.bishop("bishop", "72", "W", false, board)
// new pieces.bishop("bishop", "75", "W", false, board)
// new pieces.rook("rook", "70", "W", false, board)
// new pieces.rook("rook", "77", "W", false, board)
// new pieces.knight("knight", "71", "W", false, board)
// new pieces.knight("knight", "76", "W", false, board)

// new pieces.pawn("pawn", "10", "W", false, board, true)
// new pieces.pawn("pawn", "21", "W", false, board, true)
// new pieces.pawn("pawn", "32", "W", false, board, true)
// new pieces.pawn("pawn", "13", "W", false, board, true)
// new pieces.pawn("pawn", "14", "W", false, board, true)
// new pieces.pawn("pawn", "15", "W", false, board, true)
// new pieces.pawn("pawn", "16", "W", false, board, true)
// new pieces.pawn("pawn", "17", "W", false, board, true)


new pieces.king("king", "04", "B", true, board)
// new pieces.queen("queen", "03", "B", false, board)
// new pieces.bishop("bishop", "02", "B", false, board)
// new pieces.bishop("bishop", "05", "B", false, board)
// new pieces.rook("rook", "00", "B", false, board)
// new pieces.rook("rook", "07", "B", false, board)
// new pieces.knight("knight", "01", "B", false, board)
// new pieces.knight("knight", "06", "B", false, board)

// new pieces.pawn("pawn", "60", "B", false, board, true)
// new pieces.pawn("pawn", "61", "B", false, board, true)
// new pieces.pawn("pawn", "62", "B", false, board, true)
// new pieces.pawn("pawn", "63", "B", false, board, true)
// new pieces.pawn("pawn", "64", "B", false, board, true)
// new pieces.pawn("pawn", "65", "B", false, board, true)
// new pieces.pawn("pawn", "66", "B", false, board, true)
// new pieces.pawn("pawn", "67", "B", false, board, true)

