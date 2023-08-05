
export class pieces {
    constructor(name, pos, team, isKing, board) {
        this.name = name
        this.pos = pos
        this.board = board
        this.team = team
        this.isKing = isKing
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
        var box = document.querySelectorAll(`#${id}`)
        box.forEach(element => {
            element.innerHTML = ""
        });
    }

    recur_top(list, row, col, board) {
        if (col - 1 > -1) {
            if (board[col - 1][row] != null && board[col - 1][row].team == this.team) { return }
            if (board[col - 1][row] != null && board[col - 1][row].team != this.team) { return list.push(`${col - 1}${row}`) }
            list.push(`${col - 1}${row}`)
            this.recur_top(list, row, col - 1, board)
        }
        return
    }
    recur_buttom(list, row, col, board) {
        if (col + 1 < 8) {
            if (board[col + 1][row] != null && board[col + 1][row].team == this.team) { return }
            if (board[col + 1][row] != null && board[col + 1][row].team != this.team) { return list.push(`${col + 1}${row}`) }
            list.push(`${col + 1}${row}`)
            this.recur_buttom(list, row, col + 1, board)
        }
        return
    }

    recur_right(list, row, col, board) {
        if (row + 1 < 8) {
            if (board[col][row + 1] != null && board[col][row + 1].team == this.team) { return }
            if (board[col][row + 1] != null && board[col][row + 1].team != this.team) { return list.push(`${col}${row + 1}`) }
            list.push(`${col}${row + 1}`)
            this.recur_right(list, row + 1, col, board)
        }
        return
    }
    recur_left(list, row, col, board) {
        if (row - 1 > -1) {
            if (board[col][row - 1] != null && board[col][row - 1].team == this.team) { return }
            if (board[col][row - 1] != null && board[col][row - 1].team != this.team) { return list.push(`${col}${row - 1}`) }
            list.push(`${col}${row - 1}`)
            this.recur_left(list, row - 1, col, board)
        }
        return
    }
    recur_bottom_right(list, row, col, board) {
        if (col + 1 < 8 && row + 1 < 8) {
            if (board[col + 1][row + 1] != null && board[col + 1][row + 1].team == this.team) { return }
            if (board[col + 1][row + 1] != null && board[col + 1][row + 1].team != this.team) { return list.push(`${col + 1}${row + 1}`) }
            list.push(`${col + 1}${row + 1}`)
            this.recur_bottom_right(list, row + 1, col + 1, board)
        }
        return
    }
    recur_bottom_left(list, row, col, board) {
        if (col + 1 < 8 && row - 1 > -1) {
            if (board[col + 1][row - 1] != null && board[col + 1][row - 1].team == this.team) { return }
            if (board[col + 1][row - 1] != null && board[col + 1][row - 1].team != this.team) { return list.push(`${col + 1}${row - 1}`) }
            list.push(`${col + 1}${row - 1}`)
            this.recur_bottom_left(list, row - 1, col + 1, board)
        }
        return
    }
    recur_top_right(list, row, col, board) {
        if (col - 1 > -1 && row + 1 < 8) {
            if (board[col - 1][row + 1] != null && board[col - 1][row + 1].team == this.team) { return }
            if (board[col - 1][row + 1] != null && board[col - 1][row + 1].team != this.team) { return list.push(`${col - 1}${row + 1}`) }
            list.push(`${col - 1}${row + 1}`)
            this.recur_top_right(list, row + 1, col - 1, board)
        }
        return
    }
    recur_top_left(list, row, col, board) {
        if (col - 1 > -1 && row - 1 > -1) {
            if (board[col - 1][row - 1] != null && board[col - 1][row - 1].team == this.team) { return }
            if (board[col - 1][row - 1] != null && board[col - 1][row - 1].team != this.team) { return list.push(`${col - 1}${row - 1}`) }
            list.push(`${col - 1}${row - 1}`)
            this.recur_top_left(list, row - 1, col - 1, board)
        }
        return
    }

}

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
export class queen extends pieces {

    setPiece() {
        if (this.team == "B") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece queenBlack">&#9819;</div>`
            });
        }
        if (this.team == "W") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece queenWhite">&#9813;</div>`
            });
        }
    }
    moveAblepos(board) {
        const result = []
        const filterResult = []
        const row = parseInt(this.pos[1])
        const col = parseInt(this.pos[0])
        this.recur_top(result, row, col, board)
        this.recur_buttom(result, row, col, board)
        this.recur_right(result, row, col, board)
        this.recur_left(result, row, col, board)
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


export class bishop extends pieces {

    setPiece() {
        if (this.team == "B") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece bishopBlack">&#9821;</div>`
            });
        }
        if (this.team == "W") {
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

export class rook extends pieces {

    setPiece() {
        if (this.team == "B") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece rookBlack">&#9820;</div>`
            });
        }
        if (this.team == "W") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece rookWhite">&#9814;</div>`
            });
        }
    }
    moveAblepos(board) {
        const result = []
        const filterResult = []
        const row = parseInt(this.pos[1])
        const col = parseInt(this.pos[0])
        this.recur_top(result, row, col, board)
        this.recur_buttom(result, row, col, board)
        this.recur_right(result, row, col, board)
        this.recur_left(result, row, col, board)
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            if (board[element[0]][element[1]] != null && board[element[0]][element[1]].team == this.team) { continue }
            filterResult.push(element)
        }
        return filterResult
    }

}

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

export class pawn extends pieces {
    constructor(name, pos, team, isKing, board, firstmove) {
        super(name, pos, team, isKing, board)
        this.firstmove = firstmove
        if (team == 'W') {
            this.promotedPos = ['00', '01', '02', '03', '04', '05', '06', '07']
        } else if (team = 'B') {
            this.promotedPos = ['70', '71', '72', '73', '74', '75', '76', '77']
        }


    };

    setPiece() {
        if (this.team == "B") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece rookBlack">&#9823;</div>`

            });
        }
        if (this.team == "W") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = `<div class="boxpiece rookWhite">&#9817;</div>`

            });
        }
    }
    moveAblepos(board) {
        const result = []
        const filterResult = []
        const row = parseInt(this.pos[1])
        const col = parseInt(this.pos[0])
        if (this.team == 'B') {
            if (this.firstmove == true) {

                if (col + 1 < 8) {
                    if (board[col + 1][row] == null) {
                        result.push(`${col + 1}${row}`)
                        if (col + 2 < 8) {
                            if (board[col + 2][row] == null) {
                                result.push(`${col + 2}${row}`)
                            }
                        }
                    }
                    if (board[col + 1][row + 1] != null && board[col + 1][row + 1].team != this.team) {
                        result.push(`${col + 1}${row + 1}`)
                    }
                    if (board[col + 1][row - 1] != null && board[col + 1][row - 1].team != this.team) {
                        result.push(`${col + 1}${row - 1}`)
                    }
                } else if (col + 1 < 8) {
                    if (board[col + 1][row] == null) {
                        result.push(`${col + 1}${row}`)
                    }
                    if (board[col + 1][row + 1] != null && board[col + 1][row + 1].team != this.team) {
                        result.push(`${col + 1}${row + 1}`)
                    }
                    if (board[col + 1][row - 1] != null && board[col + 1][row - 1].team != this.team) {
                        result.push(`${col + 1}${row - 1}`)
                    }

                };
            }


        }
        if (this.team == 'W') {
            if (col - 1 > -1) {
                if (this.firstmove == true) {
                    if (board[col - 1][row] == null) {
                        result.push(`${col - 1}${row}`)
                        if (col - 2 > -1) {
                            if (board[col - 2][row] == null) {
                                result.push(`${col - 2}${row}`)
                            }
                        }

                    }
                    if (board[col - 1][row + 1] != null && board[col - 1][row + 1].team != this.team) {
                        result.push(`${col - 1}${row + 1}`)
                    }
                    if (board[col - 1][row - 1] != null && board[col - 1][row - 1].team != this.team) {
                        result.push(`${col - 1}${row - 1}`)
                    }
                } else if (col - 1 > -1) {
                    if (board[col - 1][row] == null) {
                        result.push(`${col - 1}${row}`)
                    }
                    if (board[col - 1][row + 1] != null && board[col - 1][row + 1].team != this.team) {
                        result.push(`${col - 1}${row + 1}`)
                    }
                    if (board[col - 1][row - 1] != null && board[col - 1][row - 1].team != this.team) {
                        result.push(`${col - 1}${row - 1}`)
                    }
                };
            }
        }
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            if (board[element[0]][element[1]] != null && board[element[0]][element[1]].team == this.team) { continue }
            filterResult.push(element)
        }
        return filterResult
    }



    async promoted(board, promoted) {
        const currentGame = JSON.parse(localStorage.getItem("currentGame"))
        if (currentGame.role != this.team) { return 0 }
        console.log(this.promotedPos);
        console.log(this.pos);
        if (this.promotedPos.includes(`${this.pos}`)) {
            if (promoted == 'queen') {
                this.unset
                return new queen("queen", this.pos, this.team, true, board)
            }
            if (promoted == 'bishop') {
                this.unset
                return new bishop("bishop", this.pos, this.team, true, board)
            }
            if (promoted == 'rook') {
                this.unset
                return new rook("rook", this.pos, this.team, true, board)
            }
            if (promoted == 'knight') {
                this.unset
                return new knight("knight", this.pos, this.team, true, board)
            }

        }
    }

    promoted_server(board, promoted) {
        if (this.promotedPos.includes(`${this.pos}`)) {
            console.log('must promote');
            this.unset
            console.log(promoted);
            if (promoted.name == "queen") {

                return new queen("queen", promoted.pos, promoted.team, false, board)
            }
            if (promoted.name == "bishop") {

                return new bishop("bishop", promoted.pos, promoted.team, false, board)
            }
            if (promoted.name == "rook") {

                return new rook("rook", promoted.pos, promoted.team, false, board)
            }
            if (promoted.name == "knight") {

                return new knight("knight", promoted.pos, promoted.team, false, board)
            }

        }
    }

}
