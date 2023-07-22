export class pieces {
    constructor(name, pos, team, board) {
        this.name = name
        this.pos = pos
        this.board = board
        this.team = team
        this.setPiece()
    }
    tranSlateToId() {
        var temp = ""
        switch (`${this.pos[1]}`) {
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
        switch (`${this.pos[0]}`) {
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

    unset() {
        this.board[this.pos[0]][this.pos[1]] = null
        var id = this.tranSlateToId()
        var box = document.querySelector(`#${id}`)
        box.innerHTML = ""
    }
}

export class king extends pieces {
    
    setPiece() {
        this.board[this.pos[0]][this.pos[1]] = this
        var id = this.tranSlateToId()
        var box = document.querySelector(`#${id}`)
        box.innerHTML = `<div class="boxpiece kingWhite">&#9812;</div>`
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

        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            if (board[element[0]][element[1]] != null && board[element[0]][element[1]].team == this.team) {continue}
            filterResult.push(element)
        }

        return filterResult
    }


}
export class queen extends pieces {

    setPiece() {
        this.board[this.pos[0]][this.pos[1]] = this
        var id = this.tranSlateToId()
        var box = document.querySelector(`#${id}`)
        box.innerHTML = `<div class="boxpiece queenWhite">&#9813;</div>`
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

        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            if (board[element[0]][element[1]] != null && board[element[0]][element[1]].team == this.team) {continue}
            filterResult.push(element)
        }

        return filterResult
    }
}

