import { moveClient } from "./board.js";
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