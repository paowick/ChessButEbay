import { mineSetUp } from "./script.js"
import { invtPush } from "./board.js"
import { mineUpdate } from "./socket.js"
import { invtList } from "./board.js"

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
        if (invtList.length === 0) {
            invtList = []
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
                invtPush(element)
            }
        }),

            mineUpdate(this.mineList)
    }

}