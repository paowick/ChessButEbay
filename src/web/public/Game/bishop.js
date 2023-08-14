import { pieces } from "./piece.js";
export class bishop extends pieces {
    html(){
        if (this.team == "B") {
            return `<div class="boxpiece bishopBlack">&#9821;</div>`
        }else if(this.team == "W") {
            return `<div class="boxpiece bishopWhite">&#9815;</div>`
        }
    }
    setPiece() {
        if (this.team == "B") {
            if(this.board[this.pos[0]][this.pos[1]] != null &&this.board[this.pos[0]][this.pos[1]].name == "king"){
                win("B")
            }
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece bishopBlack">&#9821;</div>`
            });
        }
        if (this.team == "W") {
            if(this.board[this.pos[0]][this.pos[1]] != null && this.board[this.pos[0]][this.pos[1]].name == "king"){
                win("W")
            }
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece bishopWhite">&#9815;</div>`
            });
        }
    }
    moveAblepos(board) {
        const result = []
        const filterResult = []
        const row = parseInt(this.pos[1])
        const col = parseInt(this.pos[0])
        this.recur_bottom_right(result, row, col, board)
        this.recur_bottom_left(result, row, col, board)
        this.recur_top_right(result, row, col, board)
        this.recur_top_left(result, row, col, board)
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            if (board[element[0]][element[1]] != null && board[element[0]][element[1]].team == this.team) { continue }
            filterResult.push(element)
        }
        return filterResult
    }

}