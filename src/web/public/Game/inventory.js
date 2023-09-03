import { board } from "./board.js"
import { clearAllHightLight } from "./board.js"
import { hightLightDrop, showDropAble, hightLightMine } from "./script.js"
import { mineobj } from "./board.js"

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
        this.invtSetUp()
    }

    removeInvtList(index) {
        let intIndex = parseInt(index)
        this.invtList.splice(intIndex, 1)
        if (this.invtList.length === 0) {
            this.invtList = []
        }
        this.invtSetUp()
    }


    invtSetUp() {
        const invt = document.querySelector("#invt")
        invt.style.display = "flex"
        invt.innerHTML = ''
        this.invtList.forEach((element, index) => {
            var doc = element.html()
            console.log(doc);
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
}