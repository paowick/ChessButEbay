import { pieces } from "./piece.js";
export class king extends pieces {

    findEnamyMove(board) {
        let result = []
        for (let index = 0; index < board.length; index++) {
            const elements = board[index];
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                if (element == null || element.team == this.team) { continue }
                if (element.isKing) { result = result.concat(element.moveAbleposForKing(board)); continue }
                result = result.concat(element.moveAblepos(board))
            }
        }
        return result
    }
    setPiece() {
        if (this.team == "B") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece kingBlack">&#9818;</div>`
            });
        }
        if (this.team == "W") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece kingWhite">&#9812;</div>`

            });
        }
    }
    moveAblepos(board) {
        const result = []
        const filterResult = []
        const row = parseInt(this.pos[1])
        const col = parseInt(this.pos[0])
        if (col + 1 < 8) { result.push(`${col + 1}${row}`) };
        if (col - 1 > -1) { result.push(`${col - 1}${row}`) };
        if (row + 1 < 8) { result.push(`${col}${row + 1}`) };
        if (row - 1 > -1) { result.push(`${col}${row - 1}`) };
        if (col + 1 < 8 && row + 1 < 8) { result.push(`${col + 1}${row + 1}`) };
        if (col + 1 < 8 && row - 1 > -1) { result.push(`${col + 1}${row - 1}`) };
        if (col - 1 > -1 && row + 1 < 8) { result.push(`${col - 1}${row + 1}`) };
        if (col - 1 > -1 && row - 1 > -1) { result.push(`${col - 1}${row - 1}`) };
        const allEnamyMove = this.findEnamyMove(board)
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            const box = board[element[0]][element[1]]
            if (box != null &&
                box.team == this.team) { continue }
            if (allEnamyMove.includes(element)) { continue }
            filterResult.push(element)
        }
        return filterResult
    }

    moveAbleposForKing(board) {
        const result = []
        const filterResult = []
        const row = parseInt(this.pos[1])
        const col = parseInt(this.pos[0])
        if (col + 1 < 8) { result.push(`${col + 1}${row}`) };
        if (col - 1 > -1) { result.push(`${col - 1}${row}`) };
        if (row + 1 < 8) { result.push(`${col}${row + 1}`) };
        if (row - 1 > -1) { result.push(`${col}${row - 1}`) };
        if (col + 1 < 8 && row + 1 < 8) { result.push(`${col + 1}${row + 1}`) };
        if (col + 1 < 8 && row - 1 > -1) { result.push(`${col + 1}${row - 1}`) };
        if (col - 1 > -1 && row + 1 < 8) { result.push(`${col - 1}${row + 1}`) };
        if (col - 1 > -1 && row - 1 > -1) { result.push(`${col - 1}${row - 1}`) };
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            const box = board[element[0]][element[1]]
            if (box != null &&
                box.team == this.team) { continue }
            filterResult.push(element)
        }
        return filterResult
    }
}