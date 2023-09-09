import { board } from "./board.js"
import { clearAllHightLight } from "./board.js"
import { hightLightDrop, showDropAble, hightLightMine } from "./script.js"
import { mineobj } from "./board.js"


import { king } from './king.js';
import { pawn } from './pawn.js';
import { queen } from './queen.js';
import { bishop } from './bishop.js';
import { knight } from './knight.js';
import { rook } from './rook.js';

export class inventory {
    constructor(invtList) {
        this.invtList = invtList
    }

    invtPush(obj) {
        const currentGame = JSON.parse(localStorage.getItem("currentGame"))
        if (obj.team != currentGame.role) {
            this.invtSetUp()
            return
        }
        this.invtList.push(obj)
        this.invtSetUp();
    }

    invtPushViewer(obj) {
        this.invtList.push(obj)
    }

    removeInvtList(index) {
        let intIndex = parseInt(index)
        this.invtList.splice(intIndex, 1)
        if (this.invtList.length === 0) {
            this.invtList = []
        }
        this.invtSetUp()
    }

    clearInvtList() {
        this.invtList = []
    }

    invtSetUpViewer(list) {
        console.log(list);
        const invtBdoc = document.querySelector("#invt-B")
        const invtWdoc = document.querySelector("#invt-W")
        this.invtList = []
        list.forEach(ele => {
            this.invtPushViewer(this.pieceToObjViewer(ele.name, ele.team))
        })
        this.invtList.forEach(element => {
            if (element.team == 'W') {
                var doc = element.html()
                doc.classList.add('invt-box')
                invtWdoc.appendChild(doc)
            }
            if (element.team == 'B') {
                var doc = element.html()
                doc.classList.add('invt-box')
                invtBdoc.appendChild(doc)
            }
        })
    }

    invtSetUp() {
        const invt = document.querySelector("#invt")
        invt.style.display = "flex"
        invt.innerHTML = ''
        this.invtList.forEach((element, index) => {
            var doc = element.html()
            doc.setAttribute('id', index)
            doc.classList.add('invt-box')
            invt.appendChild(doc)
        })

        const invtListTemp = this.invtList

        document.querySelectorAll('.invt-box').forEach(div => {
            div.addEventListener('click', function (e) {
                // when click on invt-box in second time ti will be clear all hightlight
                clearAllHightLight()
                showDropAble(invtListTemp[this.id].dropPieceAble(board))
                hightLightDrop(invtListTemp[this.id], this.id)
                removeAllEvent()
                if (mineobj.mineList.length >= mineobj.minelimit) {
                    return
                }
                hightLightMine(invtListTemp[this.id], this.id)
            })
        })

        const removeAllEvent = () => {
            this.temp()
            document.querySelectorAll('.invt-box').forEach(div => {
                const newdiv = div.cloneNode(true)
                div.parentNode.replaceChild(newdiv, div)
            })
        }

    }

    temp() {
        this.invtSetUp()
    }

    pieceToObjViewer(piece, team) {
        if (piece == 'king') {
            return new king("king", null, team, true, board, 3)
        }
        if (piece == 'queen') {
            return new queen("queen", null, team, false, board, 3)

        }
        if (piece == 'bishop') {
            return new bishop("bishop", null, team, false, board, 3)

        }
        if (piece == 'rook') {
            return new rook("rook", null, team, false, board, 3)

        }
        if (piece == 'knight') {
            return new knight("knight", null, team, false, board, 3)

        }
        if (piece == 'pawn') {
            return new pawn("pawn", null, team, false, board, 3, true)
        }
    }

    pieceToObj(piece) {
        const currentGame = JSON.parse(localStorage.getItem("currentGame"))
        if (piece == 'king') {
            return new king("king", null, currentGame.role, true, board, 3)
        }
        if (piece == 'queen') {
            return new queen("queen", null, currentGame.role, false, board, 3)

        }
        if (piece == 'bishop') {
            return new bishop("bishop", null, currentGame.role, false, board, 3)

        }
        if (piece == 'rook') {
            return new rook("rook", null, currentGame.role, false, board, 3)

        }
        if (piece == 'knight') {
            return new knight("knight", null, currentGame.role, false, board, 3)

        }
        if (piece == 'pawn') {
            return new pawn("pawn", null, currentGame.role, false, board, 3, true)
        }
    }
}