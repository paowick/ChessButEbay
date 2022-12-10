import { pieces, king } from './piece.js';



const a8 = document.querySelector("#a8")
const b8 = document.querySelector("#b8")
const c8 = document.querySelector("#c8")
const d8 = document.querySelector("#d8")
const e8 = document.querySelector("#e8")
const f8 = document.querySelector("#f8")
const g8 = document.querySelector("#g8")
const h8 = document.querySelector("#h8")

const a7 = document.querySelector("#a7")
const b7 = document.querySelector("#b7")
const c7 = document.querySelector("#c7")
const d7 = document.querySelector("#d7")
const e7 = document.querySelector("#e7")
const f7 = document.querySelector("#f7")
const g7 = document.querySelector("#g7")
const h7 = document.querySelector("#h7")

const a6 = document.querySelector("#a6")
const b6 = document.querySelector("#b6")
const c6 = document.querySelector("#c6")
const d6 = document.querySelector("#d6")
const e6 = document.querySelector("#e6")
const f6 = document.querySelector("#f6")
const g6 = document.querySelector("#g6")
const h6 = document.querySelector("#h6")

const a5 = document.querySelector("#a5")
const b5 = document.querySelector("#b5")
const c5 = document.querySelector("#c5")
const d5 = document.querySelector("#d5")
const e5 = document.querySelector("#e5")
const f5 = document.querySelector("#f5")
const g5 = document.querySelector("#g5")
const h5 = document.querySelector("#h5")

const a4 = document.querySelector("#a4")
const b4 = document.querySelector("#b4")
const c4 = document.querySelector("#c4")
const d4 = document.querySelector("#d4")
const e4 = document.querySelector("#e4")
const f4 = document.querySelector("#f4")
const g4 = document.querySelector("#g4")
const h4 = document.querySelector("#h4")

const a3 = document.querySelector("#a3")
const b3 = document.querySelector("#b3")
const c3 = document.querySelector("#c3")
const d3 = document.querySelector("#d3")
const e3 = document.querySelector("#e3")
const f3 = document.querySelector("#f3")
const g3 = document.querySelector("#g3")
const h3 = document.querySelector("#h3")

const a2 = document.querySelector("#a2")
const b2 = document.querySelector("#b2")
const c2 = document.querySelector("#c2")
const d2 = document.querySelector("#d2")
const e2 = document.querySelector("#e2")
const f2 = document.querySelector("#f2")
const g2 = document.querySelector("#g2")
const h2 = document.querySelector("#h2")

const a1 = document.querySelector("#a1")
const b1 = document.querySelector("#b1")
const c1 = document.querySelector("#c1")
const d1 = document.querySelector("#d1")
const e1 = document.querySelector("#e1")
const f1 = document.querySelector("#f1")
const g1 = document.querySelector("#g1")
const h1 = document.querySelector("#h1")

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
    [[a8, null], [b8, null], [c8, null], [d8, null], [e8, null], [f8, null], [g8, null], [h8, null]],
    [[a7, null], [b7, null], [c7, null], [d7, null], [e7, null], [f7, null], [g7, null], [h7, null]],
    [[a6, null], [b6, null], [c6, null], [d6, null], [e6, null], [f6, null], [g6, null], [h6, null]],
    [[a5, null], [b5, null], [c5, null], [d5, null], [e5, null], [f5, null], [g5, null], [h5, null]],
    [[a4, null], [b4, null], [c4, null], [d4, null], [e4, null], [f4, null], [g4, null], [h4, null]],
    [[a3, null], [b3, null], [c3, null], [d3, null], [e3, null], [f3, null], [g3, null], [h3, null]],
    [[a2, null], [b2, null], [c2, null], [d2, null], [e2, null], [f2, null], [g2, null], [h2, null]],
    [[a1, null], [b1, null], [c1, null], [d1, null], [e1, null], [f1, null], [g1, null], [h1, null]],
]

var kingWhite = new king("king", a8, "00")
board[0][0][1] = kingWhite
console.log(board[0][0][0])
console.log(board[0][0][1])
board[0][0][0].innerHTML = `<div class="boxpiece kingWhite">&#9812;</div>`;


var source = null
var destination = null
var nextTurn = false
document.querySelectorAll('th')
    .forEach(div => {
        div.addEventListener('click', function () {
            if (source == null) { return 0 }
            destination = this.id
            console.log(`dest = ${destination}`)
            move(source,destination)
        })
    })

document.querySelectorAll('th')
    .forEach(div => {
        div.addEventListener('click', function () {
            if (source != null) { return 0 }
            if(nextTurn == true){ nextTurn = false; return 0}
            source = this.id
            console.log(`sour = ${source}`)
        })
    })



function move(sour, dest) {
    if(destination != source){
        console.log(`${sour} => ${dest}`)
        socket.emit("move", `${sour} => ${dest}`)
        nextTurn = true
        destination = null
        source = null
    }else{
        nextTurn = true
        destination = null
        source = null
    }
}

