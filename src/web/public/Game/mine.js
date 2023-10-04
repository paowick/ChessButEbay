import { coinUpdate, mineSetUp } from "./script.js"
import { invtobj, logConv } from "./board.js"
import { coin, setCoin } from "./board.js";
import { king } from './king.js';
import { pawn } from './pawn.js';
import { queen } from './queen.js';
import { bishop } from './bishop.js';
import { knight } from './knight.js';
import { rook } from './rook.js';
import { board } from "./board.js";
import { returnRate } from "./board.js";
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
    setMineToNull(){
        this.mineList = []
    }
    mineListPop(obj) {
        const index = this.mineList.indexOf(obj)
        this.mineList.splice(index, 1)
        if (invtobj.invtList.length === 0) {
            invtobj.invtList = []
        }
        mineSetUp()
    }

    mineListCount() {
        let isReturn = false
        const currentGame = JSON.parse(localStorage.getItem("currentGame"))
        this.mineList.forEach(element => {
            element.countCurrentTimeInMine()
        });
        document.querySelectorAll('.mine-box').forEach(boxs => {
            const piece = this.mineList[boxs.id]
            const text = boxs.childNodes[1]
            if (text != undefined) {
                text.innerHTML = `${piece.currentTimeInMine}/${piece.timeInMine} turn`
            }
        })
        const temp = this.mineList
        let mustpop = []
        temp.forEach(element => {
            if (element.currentTimeInMine + 1 <= 0) {
                if (currentGame.role == element.team) {
                    mustpop.push(element)
                    if (element.name == "pawn") {
                        setCoin((coin + returnRate[element.timeInMine]) * 1)
                    }
                    if (element.name == "bishop") {
                        setCoin((coin + returnRate[element.timeInMine]) * 2)
                    }
                    if (element.name == "knight") {
                        setCoin((coin + returnRate[element.timeInMine]) * 2)
                    }
                    if (element.name == "rook") {
                        setCoin((coin + returnRate[element.timeInMine]) * 2)
                    }
                    if (element.name == "queen") {
                        setCoin((coin + returnRate[element.timeInMine]) * 3)
                    }
                    coinUpdate(coin)
                }
            }
        })
        if(mustpop.length > 0){
            isReturn = true
        }
        for (let index = 0; index < mustpop.length; index++) {
            const element = mustpop[index];
            for (let index2 = 0; index2 < this.mineList.length; index2++) {
                const element2 = this.mineList[index2];
                if(element === element2){
                    this.mineListPop(element2)
                    invtobj.invtPush(element2)
                }
            }
        }
    }


    drop_mine_server(element) {
        if (element.name == 'king') {
            const obj = new king("king", element.pos, element.team, true, board, element.timeInMine)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
        if (element.name == 'queen') {
            const obj = new queen("queen", element.pos, element.team, false, board, element.timeInMine)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
        if (element.name == 'bishop') {
            const obj = new bishop("bishop", element.pos, element.team, false, board, element.timeInMine)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
        if (element.name == 'rook') {
            const obj = new rook("rook", element.pos, element.team, false, board, element.timeInMine)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
        if (element.name == 'knight') {
            const obj = new knight("knight", element.pos, element.team, false, board, element.timeInMine)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
        if (element.name == 'pawn') {
            const obj = new pawn("pawn", element.pos, element.team, false, board, element.timeInMine, true)
            obj.currentTimeInMine = element.currentTimeInMine
            this.mineListPush(obj)
            return
        }
    }

}