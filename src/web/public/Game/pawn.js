import { pieces } from "./piece.js"
import { queen } from "./queen.js"
import { bishop } from "./bishop.js"
import { rook } from "./rook.js"
import { knight } from "./knight.js"
import { win } from "./socket.js"
import { board } from "./board.js"
export class pawn extends pieces {
    constructor(name, pos, team, isKing, board, timeInMine, firstmove) {
        super(name, pos, team, isKing, board, timeInMine)
        this.firstmove = firstmove
        if (team == 'W') {
            this.promotedPos = ['00', '01', '02', '03', '04', '05', '06', '07']
        } else if (team = 'B') {
            this.promotedPos = ['70', '71', '72', '73', '74', '75', '76', '77']
        }


    };
    html() {
        if (this.team == "B") {
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("pawnBlack");
            newimg.src = "../assets/component/svg/pawn-black.svg"
            newDiv.appendChild(newimg)
            return newDiv
        } else if (this.team == "W") {
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("pawnWhite");
            newimg.src = "../assets/component/svg/pawn-white.svg"
            newDiv.appendChild(newimg)
            return newDiv
        }else{
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("pawnGray");
            newDiv.classList.add("auctionPiece");
            newimg.src = "../assets/component/svg/pawn-gray.svg"
            newDiv.appendChild(newimg)
            return newDiv
        }
    }
    setPiece() {
        if(this.board == null){this.board = board}
        if (this.team == "B") {
            if (this.board[this.pos[0]][this.pos[1]] != null && this.board[this.pos[0]][this.pos[1]].name == "king") {
                win("B")
            }
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = ''
                const newDiv = document.createElement("div");
                const newimg = document.createElement("img");
                newDiv.classList.add("boxpiece");
                newDiv.classList.add("pawnBlack");
                newimg.src = "../assets/component/svg/pawn-black.svg"
                newDiv.appendChild(newimg)
                element.appendChild(newDiv)
            });
        }
        if (this.team == "W") {
            if (this.board[this.pos[0]][this.pos[1]] != null && this.board[this.pos[0]][this.pos[1]].name == "king") {
                win("W")
            }
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                const newDiv = document.createElement("div");
                const newimg = document.createElement("img");
                newDiv.classList.add("boxpiece");
                newDiv.classList.add("pawnWhite");
                newimg.src = "../assets/component/svg/pawn-white.svg"
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
            this.unset
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