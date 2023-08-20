import { moveClient } from "./board.js";
import { invtList } from "./board.js";
import { removeInvtList } from "./board.js";
import { bishop } from "./bishop.js";
import { board } from "./board.js";
import { tranSlateToId } from "./board.js";
import { drop } from "./board.js";
import { clearAllHightLight } from "./board.js";
import { myturn } from "./board.js";
import { mineList, mineListPush } from "./board.js";
import { minelimt } from "./board.js";
import { dropMineEmit } from "./socket.js";

import { mineDropAble, chaangeMineDropAble } from "./board.js";
export function waitingForPlayer() {
    // document.querySelector("#waiting-pop").style.display = 'block'
    // setTimeout(() => {

    //     document.querySelector("#waiting-pop").style.display = 'none'
    // }, 5000)
}

export function askPlayer(source, destination) {
    const buttons = document.querySelectorAll('#choi');

    function handleButtonClick(button) {
        document.querySelector('#prom-pop').style.display = 'none';
        moveClient(source, destination, button.value); // Assuming moveClient is not an async function
    }

    function removeAllEventListeners() {
        buttons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        });
    }

    document.querySelector('#prom-pop').style.display = 'block';

    buttons.forEach(button => {
        button.addEventListener('click', function onClick(event) {
            handleButtonClick(event.target);
            removeAllEventListeners();
        });
    });
}

export function winPop(arg) {
    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    if (currentGame.role == arg) {
        document.querySelector("#win-pop").style.display = "flex"
        const para = document.createElement("h1");
        para.innerText = "You Win";
        document.querySelector("#win-pop-text").appendChild(para)
    } else {
        document.querySelector("#win-pop").style.display = "flex"
        const para = document.createElement("h1");
        para.innerText = "You Lose";
        document.querySelector("#win-pop-text").appendChild(para)
    }
    document.querySelector("#win-pop-butt").addEventListener("click", () => {
        location.reload()
    })
}

export function boardSetupUi(arg, currentGame, info) {
    if (arg.role != 'viewer') {
        document.querySelector("#invt").style.display = "block"
        const join_con = document.querySelector(".join-butt-con")
        join_con.style.display = 'none'
        const inhand = document.querySelector(".inhand")
        inhand.style.display = 'none'
        if (arg.role == "B") {
            const board_white = document.querySelector('#board-white')
            board_white.style.display = "none"
            const board_black = document.querySelector('#board-black')
            board_black.style.display = 'flex'
        } else {
            const board_white = document.querySelector('#board-white')
            board_white.style.display = "flex"
            const board_black = document.querySelector('#board-black')
            board_black.style.display = 'none'
        }
    } else if (arg.role == 'viewer') {
        document.querySelector("#invt").style.display = "none"
        if (info.playerB != null) { document.querySelector('#join_black').style.display = 'none' }
        if (info.playerW != null) { document.querySelector('#join_white').style.display = 'none' }
    }
    currentGame.role = arg.role
    localStorage.setItem('currentGame', JSON.stringify(currentGame))
}

export function codePart(code) {
    const para = document.createElement("h1");
    para.innerText = code
    document.querySelector(".room-code").appendChild(para)
}



export let posListTemp = null
export function invt() {
    const invt = document.querySelector("#invt")
    invt.style.display = "block"
    invt.innerHTML = ''
    invtList.forEach((element, index) => {
        var doc = new DOMParser().parseFromString(element.html(), "text/xml").documentElement
        doc.setAttribute('id', index)
        doc.classList.add('invt-box')
        invt.appendChild(doc)
    })



    document.querySelectorAll('.invt-box').forEach(div => {
        div.addEventListener('click', function () {
            // when click on invt-box in second time ti will be clear all hightlight
            clearAllHightLight()
            showDropAble(invtList[this.id].dropPieceAble(board))
            hightLightDrop(invtList[this.id], this.id)
            removeAllEvent()
            temp()
            if (mineList.length >= minelimt) {
                return
            }
            hightLightMine(invtList[this.id], this.id)
        })
    })

    function removeAllEvent() {
        document.querySelectorAll('.invt-box').forEach(div => {
            const newdiv = div.cloneNode(true)
            div.parentNode.replaceChild(newdiv, div)
        })
    }

}

function temp() {
    invt()
}



export function mineSetUp() {
    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    const mine = document.querySelector("#mine")
    mine.style.display = "flex"
    mine.innerHTML = ''
    mineList.forEach((element, index) => {
        var doc = null
        if (element.team == currentGame.role) {
            doc = new DOMParser().parseFromString(element.html(), "text/xml").documentElement
        } else {
            doc = new DOMParser().parseFromString(`<div class="blind"></div>`, "text/xml").documentElement
        }
        console.log(doc);
        doc.setAttribute('id', index)
        doc.classList.add('mine-box')
        mine.appendChild(doc)
    })
}

export function hightLightMine(piece, id) {
    document.querySelectorAll('.mine').forEach(div => {
        div.addEventListener('click', function () {
            if (!myturn) {
                clearAllHightLight()
                return
            }
            if (!mineDropAble) {
                clearAllHightLight()
                return
            }
            removeAllEvent()
            removeInvtList(id)
            clearAllHightLight()
            piece.setCurrentTimeInMine()
            mineListPush(piece)
            mineSetUp()
            chaangeMineDropAble(false)
            dropMineEmit(piece, board, mineList)
        })
    })

    function removeAllEvent() {
        document.querySelectorAll('.mine').forEach(div => {
            const newdiv = div.cloneNode(true)
            div.parentNode.replaceChild(newdiv, div)
        })
    }
}






function hightLightDrop(piece, id) {
    document.querySelectorAll('.drop').forEach(div => {
        div.addEventListener('click', function () {
            if (!myturn) {
                clearAllHightLight()
                return
            }
            drop(piece, this.id)
            removeAllEvent()
            removeInvtList(id)
            clearAllHightLight()
        })
    })

    function removeAllEvent() {
        document.querySelectorAll('.drop').forEach(div => {
            const newdiv = div.cloneNode(true)
            div.parentNode.replaceChild(newdiv, div)
        })
    }
}







// document.querySelector("#auctiontest").addEventListener('click', () => {

//     const currentGame = JSON.parse(localStorage.getItem("currentGame"))
//     invtList.push(new bishop("bishop", null, currentGame.role, true, board))
//     // invtList.push(new king("king", null, "W", true, board))
//     // invtList.push(new queen("queen", null, "W", true, board))
//     invt()
// })
function showDropAble(posList) {
    posList.forEach(element => {
        const id = tranSlateToId(element)

        document.querySelectorAll(`#${id}`).forEach(element => {
            if (element.childNodes.length > 0) {

                element.style.backgroundColor = `rgba(255, 0, 0,0.5)`
                element.innerHTML += `<div></div>`
                return 0
            }
            element.innerHTML += `<div class="hight-light drop" id="${id}" value="drop" >&#9900</div>`
        })
    });
}
export function clearHightLightDrop(posList) {
    posList.forEach(element => {
        const id = tranSlateToId(element)
        document.querySelectorAll(`#${id}`).forEach(element => {
            element.removeChild(element.lastChild)
            element.style.backgroundColor = ``

        })

    });
}