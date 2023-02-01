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
    [[null], [null], [null], [null], [null], [null], [null], [null]],
    [[null], [null], [null], [null], [null], [null], [null], [null]],
    [[null], [null], [null], [null], [null], [null], [null], [null]],
    [[null], [null], [null], [null], [null], [null], [null], [null]],
    [[null], [null], [null], [null], [null], [null], [null], [null]],
    [[null], [null], [null], [null], [null], [null], [null], [null]],
    [[null], [null], [null], [null], [null], [null], [null], [null]],
    [[null], [null], [null], [null], [null], [null], [null], [null]],
]

var kingWhite = new king("king","00",board)
console.log(board);

var source = null
var destination = null
document.querySelectorAll('th')
    .forEach(div => {
        div.addEventListener('click', function () {
            if (source == null && destination == null) {
                source = this.id;
            } else if (source != null && destination == null) {
                destination = this.id;
                move()
            }
        })
    })
function move(){
    if (destination != source) {
        console.log(`${source} => ${destination}`)
        socket.emit("move", {
            source: source,
            destination: destination
        })

        kingWhite.unset()
        kingWhite.pos = "01" 
        kingWhite.setPiece()

        destination = null
        source = null
    } else {
        destination = null
        source = null
    }

}