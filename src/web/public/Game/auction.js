
import { king } from './king.js';
import { pawn } from './pawn.js';
import { queen } from './queen.js';
import { bishop } from './bishop.js';
import { knight } from './knight.js';
import { rook } from './rook.js';
import { board } from './board.js';
export class auction {
    constructor(slot1, slot2,currentBid,currentBidder) {
        this.slot1 = slot1
        this.slot2 = slot2
        this.currentBid = currentBid
        this.currentBidder = currentBidder
    }

    setSlot1(obj) {
        this.slot1 = obj
    }
    setSlot2(obj) {
        this.slot2 = obj
    }
    setCurrentBidder(id) {
        this.currentBidder = id
    }
    setCurrentBid(amout) {
        this.currentBid = amout
    }

    auctionSetUp(info) {
        if (info.auctionslot1 == null) { return }
        if (info.auctionslot2 == null) { return }
        this.slot1 = this.pieceToObj(info.auctionslot1)
        this.slot2 = this.pieceToObj(info.auctionslot2)
        document.querySelectorAll("#ac-piece").forEach(element => {
            element.innerHTML = ""
            element.appendChild(this.slot1.html())
        });
    }

    pieceToObj(piece) {
        if (piece == 'king') {
            return new king("king", null, null, true, board, 3)
        }
        if (piece == 'queen') {
            return new queen("queen", null, null, false, board, 3)

        }
        if (piece == 'bishop') {
            return new bishop("bishop", null, null, false, board, 3)

        }
        if (piece == 'rook') {
            return new rook("rook", null, null, false, board, 3)
            
        }
        if (piece == 'knight') {
            return new knight("knight", null, null, false, board, 3)

        }
        if (piece == 'pawn') {
            return new pawn("pawn", null, null, false, board, 3, true)
        }
    }
}