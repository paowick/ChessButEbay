
import { king } from './king.js';
import { pawn } from './pawn.js';
import { queen } from './queen.js';
import { bishop } from './bishop.js';
import { knight } from './knight.js';
import { rook } from './rook.js';
import { board, clearTimer, countdownTime, setCountTime, setTimer, socket, timer } from './board.js';
export class auction {
    constructor(slot1, slot2, currentBid, currentBidder, auctionStage) {
        this.slot1 = slot1
        this.slot2 = slot2
        this.currentBid = currentBid
        this.currentBidder = currentBidder
        this.auctionStage = auctionStage
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
    setAuctionStage(stage) {
        this.auctionStage = stage
    }

    auctionSetUp(info) {
        this.auctionStage = info.auctionStage
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
            return new king("king", null, null, true, board, 2)
        }
        if (piece == 'queen') {
            return new queen("queen", null, null, false, board, 2)

        }
        if (piece == 'bishop') {
            return new bishop("bishop", null, null, false, board, 2)

        }
        if (piece == 'rook') {
            return new rook("rook", null, null, false, board, 2)

        }
        if (piece == 'knight') {
            return new knight("knight", null, null, false, board, 2)

        }
        if (piece == 'pawn') {
            return new pawn("pawn", null, null, false, board, 2, true)
        }
    }


    aucTimeSet(endTime) {
        if (this.auctionStage == false) { return }

        const timeDifference = endTime - Date.now();

        // Convert time difference to seconds
        const secondsDifference = Math.floor(timeDifference / 1000);
        // const formattedTimeDifference = formatTime(secondsDifference);
        setCountTime(secondsDifference)
        this.updateCountdown();
        setTimer(setInterval(this.updateCountdown, 1000))
    }
    updateCountdown() {

        const currentGame = JSON.parse(localStorage.getItem("currentGame"))
        const Element = document.querySelectorAll("#time-action");
        setCountTime(countdownTime - 1)
        Element.forEach(countdownElement => {
            countdownElement.innerHTML = countdownTime;
        })
        if (countdownTime < 0) {
            clearTimer() // Stop the countdown when it reaches 0
            Element.forEach(countdownElement => {
                countdownElement.innerHTML = "0";
            });
            if(currentGame.role == "viewer"){return}
            if(currentGame.role == "B"){return}
            socket.emit('get-auction', "")
            this.auctionStage = false
        }
    }
}