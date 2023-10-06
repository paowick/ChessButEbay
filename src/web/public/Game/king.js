import { pieces } from "./piece.js";
import { board } from "./board.js"
import { win } from "./socket.js";
export class king extends pieces {

    constructor(name, pos, team, isKing, board, timeInMine, checked) {
        super(name, pos, team, isKing, board, timeInMine)
        this.checked = checked
    }
    setChecked(data){
        this.checked = data
    }
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
    html() {
        if (this.team == "B") {
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("kingBlack");
            newimg.src = "../assets/component/svg/king-black.svg"
            newDiv.appendChild(newimg)
            return newDiv
        } else if (this.team == "W") {
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("kingWhite");
            newimg.src = "../assets/component/svg/king-white.svg"
            newDiv.appendChild(newimg)
            return newDiv
        } else {
            const newDiv = document.createElement("div");
            const newimg = document.createElement("img");
            newDiv.classList.add("boxpiece");
            newDiv.classList.add("kingGray");
            newDiv.classList.add("auctionPiece");
            newimg.src = "../assets/component/svg/king-gray.svg"
            newDiv.appendChild(newimg)
            return newDiv
        }
    }
    setPiece() {
        if (this.board == null) { this.board = board }
        if (this.team == "B") {
            this.board[this.pos[0]][this.pos[1]] = this
            var id = this.tranSlateToId()
            var box = document.querySelectorAll(`#${id}`)
            box.forEach(element => {
                element.innerHTML = ''
                const newDiv = document.createElement("div");
                const newimg = document.createElement("img");
                newDiv.classList.add("boxpiece");
                newDiv.classList.add("kingBlack");
                newimg.src = "../assets/component/svg/king-black.svg"
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
                newDiv.classList.add("kingWhite");
                newimg.src = "../assets/component/svg/king-white.svg"
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
        if (col + 1 < 8) { result.push(`${col + 1}${row}`) };
        if (col - 1 > -1) { result.push(`${col - 1}${row}`) };
        if (row + 1 < 8) { result.push(`${col}${row + 1}`) };
        if (row - 1 > -1) { result.push(`${col}${row - 1}`) };
        if (col + 1 < 8 && row + 1 < 8) { result.push(`${col + 1}${row + 1}`) };
        if (col + 1 < 8 && row - 1 > -1) { result.push(`${col + 1}${row - 1}`) };
        if (col - 1 > -1 && row + 1 < 8) { result.push(`${col - 1}${row + 1}`) };
        if (col - 1 > -1 && row - 1 > -1) { result.push(`${col - 1}${row - 1}`) };
        if (this.checked == false) {
            if(this.team == "W"){
                if(board[7][7] != null){
                    if(board[7][7].name == "rook" && board[7][7].team == this.team ){
                        if(board[col][row+2] == null){
                            result.push(`${col}${row + 2}`)
                        }
                    }
                }
                if(board[7][0] != null){
                    if(board[7][0].name == "rook" && board[7][0].team == this.team ){
                        if(board[col][row+2] == null){
                            result.push(`${col}${row - 2}`)
                        }
                    }
                }
            }
            if(this.team == "B"){
                if(board[0][7] != null){
                    if(board[0][7].name == "rook" && board[0][7].team == this.team ){
                        if(board[col][row+2] == null){
                            result.push(`${col}${row + 2}`)
                        }
                    }
                }
                if(board[0][0] != null){
                    if(board[0][0].name == "rook" && board[0][0].team == this.team ){
                        if(board[col][row+2] == null){
                            result.push(`${col}${row - 2}`)
                        }
                    }
                }
            }
        }
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