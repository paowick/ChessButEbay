import { mineSetUp } from "./script.js"
import { mineUpdate } from "./socket.js"
import { invtobj } from "./board.js"
export class mine {
    constructor(mineList, minelimit, mineresource) {
        this.mineList = mineList
        this.minelimit = minelimit
        this.mineresource = mineresource
        this.mineDropAble = true
    }
    changeMineDropAble(data) {
        this.mineDropAble = data
    }
    mineListPush(obj) {
        this.mineList.push(obj)
        mineSetUp()
    }

    mineListPop(obj) {
        const index = this.mineList.indexOf(obj)
        this.mineList.splice(index, 1)
        if (invtobj.invtList.length === 0) {
            invtobj.invtList = []
        }
        mineSetUp()
        // decrease coin
    }

    mineListCount() {
        this.mineList.forEach(element => {
            element.countCurrentTimeInMine()
            console.log(`${element.name} ${element.team} ${element.currentTimeInMine}`)
        });
        this.mineList.forEach(element => {
            if (element.currentTimeInMine <= 0) {
                this.mineListPop(element)
                invtobj.invtPush(element)
            }
        }),

            mineUpdate(this.mineList)
    }


    drop_mine_server(element) {
        if (element.name == 'king') {
            const obj = new king("king", element.pos, element.team, true, board, 3)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
        if (element.name == 'queen') {
            const obj = new queen("queen", element.pos, element.team, false, board, 3)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
        if (element.name == 'bishop') {
            const obj = new bishop("bishop", element.pos, element.team, false, board, 3)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
        if (element.name == 'rook') {
            const obj = new rook("rook", element.pos, element.team, false, board, 3)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
        if (element.name == 'knight') {
            const obj = new knight("knight", element.pos, element.team, false, board, 3)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
        if (element.name == 'pawn') {
            const obj = new pawn("pawn", element.pos, element.team, false, board, 3, true)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
    }

}