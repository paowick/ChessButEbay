import { moveClient, uiSetUpControll } from "./board.js";
import { board } from "./board.js";
import { tranSlateToId } from "./board.js";
import { drop } from "./board.js";
import { clearAllHightLight } from "./board.js";
import { myturn } from "./board.js";
import { dropMineEmit } from "./socket.js";
import { mineobj } from "./board.js";
import { invtobj } from "./board.js";
import { auctionSetUp } from "./board.js";

const user = JSON.parse(localStorage.getItem("user"))
export function updateJoinPop(playerB, playerW, playerBName, playerWName) {
    // console.log(playerB, playerW, playerBName, playerWName);
    document.querySelector("#join-butt-con").style.display = 'flex'
    if (playerB === null || playerB === undefined) {
        playerBName = 'Black'
    }
    if (playerW === null || playerW === undefined) {
        playerWName = 'White'
    }
    document.querySelector("#join_black").innerHTML = `<h1>${playerBName}</h1>`
    document.querySelector("#join_white").innerHTML = `<h1>${playerWName}</h1>`
}

export function startGame(info, arg, currentGame) {
    uiSetUpControll(info, arg, currentGame)
    auctionSetUp(info.auctionpiece)
    invtobj.invtSetUp()
    mineSetUp()
}

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

export function boardSetUpNoStart() {
    document.querySelector("#invt").style.display = "none"
    document.querySelector("#action").style.display = "none"
    document.querySelector("#inhand").style.display = "flex"
    document.querySelector("#player").style.display = "none"
    document.querySelectorAll("#viewer").forEach(element => {
        element.style.display = "flex"
    })
}
export function boardSetupUi(currentGame, info) {
    const playerIdList = [parseInt(info.playerB), parseInt(info.playerW)]
    if (playerIdList.includes(user.id)) {
        document.querySelector("#invt").style.display = "flex"
        document.querySelector(".join-butt-con").style.display = 'none'
        document.querySelector(".inhand").style.display = 'none'
        document.querySelector("#player").style.display = "flex"
        document.querySelector("#action").style.display = "flex"
        document.querySelectorAll("#viewer").forEach(element => {
            element.style.display = "none"
        })
        if (user.id == parseInt(info.playerB)) {
            document.querySelector('#board-white').style.display = "none"
            document.querySelector('#board-black').style.display = 'flex'
            currentGame.role = "B"
        }
        if (user.id == parseInt(info.playerW)) {
            document.querySelector('#board-white').style.display = "flex"
            document.querySelector('#board-black').style.display = 'none'
            currentGame.role = "W"
        }
    } else {
        document.querySelector("#invt").style.display = "none"
        document.querySelector("#action").style.display = "none"
        document.querySelector("#inhand").style.display = "flex"
        document.querySelector("#player").style.display = "none"
        document.querySelector("#join-butt-con").style.display = 'none'
        document.querySelector("#invt-con").style.display = 'none'
        document.querySelectorAll("#viewer").forEach(element => {
            element.style.display = "flex"
        })
        currentGame.role = "viewer"
    }
    localStorage.setItem('currentGame', JSON.stringify(currentGame))
}


// export function codePart(code) {
//     const para = document.createElement("h1");
//     para.innerText = code
//     document.querySelector(".room-code").appendChild(para)
// }



export let posListTemp = null



export function mineSetUp() {
    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    const mine = document.querySelector("#mine")
    mine.style.display = "flex"
    mine.innerHTML = ''
    mineobj.mineList.forEach((element, index) => {
        var doc = null
        if (element.team == currentGame.role || currentGame.role == 'viewer') {
            doc = element.html()
        } else {
            doc = new DOMParser().parseFromString(`<div class="blind"></div>`, "text/xml").documentElement
        }
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
            if (!mineobj.mineDropAble) {
                clearAllHightLight()
                return
            }
            removeAllEvent()
            invtobj.removeInvtList(id)
            clearAllHightLight()
            piece.setCurrentTimeInMine()
            mineobj.mineListPush(piece)
            mineSetUp()
            mineobj.changeMineDropAble(false)
            dropMineEmit(piece, board, mineobj.mineList)
        })
    })

    function removeAllEvent() {
        document.querySelectorAll('.mine').forEach(div => {
            const newdiv = div.cloneNode(true)
            div.parentNode.replaceChild(newdiv, div)
        })
    }
}






export function hightLightDrop(piece, id) {
    document.querySelectorAll('.drop').forEach(div => {
        div.addEventListener('click', function () {
            if (!myturn) {
                clearAllHightLight()
                return
            }
            drop(piece, this.id)
            removeAllEvent()
            invtobj.removeInvtList(id)
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
export function showDropAble(posList) {
    posList.forEach(element => {
        const id = tranSlateToId(element)

        document.querySelectorAll(`#${id}`).forEach(element => {
            if (element.childNodes.length > 0) {

                element.style.backgroundColor = `rgba(255, 0, 0,0.5)`
                element.innerHTML += `<div id="hight-light" class="hight-light"></div>`
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