import { pieces } from "./piece.js";
import { board } from "./board.js"
import { win } from "./socket.js";
export class knight extends pieces {
    html() {
        if (this.team == "B") {
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("knightBlack");
            newimg.src = "../assets/component/svg/knight-black.svg"
            newDiv.appendChild(newimg)
            return newDiv
        } else if (this.team == "W") {
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("knightWhite");
            newimg.src = "../assets/component/svg/knight-white.svg"
            newDiv.appendChild(newimg)
            return newDiv
        }else{
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("knightGray");
            newDiv.classList.add("auctionPiece");
            newimg.src = "../assets/component/svg/knight-gray.svg"
            newDiv.appendChild(newimg)
            return newDiv
        }
    }
    setPiece() {
        if(this.board == null){this.board = board}
        if (this.team == "B") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = ''
                const newDiv = document.createElement("div");
                const newimg = document.createElement("img");
                newDiv.classList.add("boxpiece");
                newDiv.classList.add("knightBlack");
                newimg.src = "../assets/component/svg/knight-black.svg"
                newDiv.appendChild(newimg)
                element.appendChild(newDiv)
            });
        }
        if (this.team == "W") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = ''
                const newDiv = document.createElement("div");
                const newimg = document.createElement("img");
                newDiv.classList.add("boxpiece");
                newDiv.classList.add("knightWhite");
                newimg.src = "../assets/component/svg/knight-white.svg"
                newDiv.appendChild(newimg)
                element.appendChild(newDiv)
            });
        }
    }
    moveAblepos(board) {
        const result = []
        const filterResult = []
        const row = parseInt(this.pos[1])
        const col = parseInt(this.pos[0])
        if (col + 2 < 8 && row + 1 < 8) { result.push(`${col + 2}${row + 1}`) };
        if (col + 2 < 8 && row - 1 > -1) { result.push(`${col + 2}${row - 1}`) };
        if (col - 2 > -1 && row + 1 < 8) { result.push(`${col - 2}${row + 1}`) };
        if (col - 2 > -1 && row - 1 > -1) { result.push(`${col - 2}${row - 1}`) };
        if (col + 1 < 8 && row + 2 < 8) { result.push(`${col + 1}${row + 2}`) };
        if (col - 1 > -1 && row + 2 < 8) { result.push(`${col - 1}${row + 2}`) };
        if (col + 1 < 8 && row - 2 > -1) { result.push(`${col + 1}${row - 2}`) };
        if (col - 1 > -1 && row - 2 > -1) { result.push(`${col - 1}${row - 2}`) };
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            if (board[element[0]][element[1]] != null && board[element[0]][element[1]].team == this.team) { continue }
            filterResult.push(element)
        }
        return filterResult
    }

}
