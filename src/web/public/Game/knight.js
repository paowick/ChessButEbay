import { pieces } from "./piece.js";
export class knight extends pieces {

    setPiece() {
        if (this.team == "B") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece rookBlack">&#9822;</div>`
            });
        }
        if (this.team == "W") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece rookWhite">&#9816;</div>`

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
