
export class pieces {
    constructor(name, pos, team, isKing, board, timeInMine) {
        this.name = name
        this.pos = pos
        this.board = board
        this.team = team
        this.isKing = isKing
        this.timeInMine = timeInMine
        this.currentTimeInMine = 0
        if(pos == null){
            this.inInvt = true
        }else{
            this.inInvt = false
            this.setPiece()
        }
    }
    setTimeInMine(data){
        this.timeInMine = data
    }
    countCurrentTimeInMine(){
        this.currentTimeInMine -= 1
    }
    setCurrentTimeInMine(){
        this.currentTimeInMine = this.timeInMine
    }
    setpos(newpos){
        this.pos = newpos
    }
    setInInvt(newvalue){
        this.inInvt = newvalue
    }
    dropPieceAble(board){
        let temp = null
        if(this.team == "B"){
            temp = ['00', '01', '02', '03', '04', '05', '06', '07','10', '11', '12', '13', '14', '15', '16', '17']
        }
        if(this.team == "W"){
            temp = ['70', '71', '72', '73', '74', '75', '76', '77','60', '61', '62', '63', '64', '65', '66', '67']
        }
        console.log(temp);
        let mustpop = []
        temp.forEach((element) => {
            if(board[element[0]][element[1]] != null){
                mustpop.push(element)
            }
        });
        let result = temp.filter(item => !mustpop.includes(item));
        return result
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



