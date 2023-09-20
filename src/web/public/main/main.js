window.onload = async () => {
    roomload()
}

let roomList = []

async function roomload() {

    const room = await fetch('/getroom')
    const roomlist = await room.json()
    roomList = []
    roomList = roomlist.datares
    document.getElementById('board').innerHTML = ""
    roomlist.datares.forEach(element => {
        document.getElementById("board").appendChild(roomtabview(element))
    });
}

setInterval(() => {
    // roomload()
}, 5000)


function roomtabview(room) {
    const text = `
                    <div class="room-code">
                    </div>
                    <div class="info">
                        <p class="player">${room.name}</p>
                    </div>
                    <button class="join-butt" type="button" value="${room.code}" onclick="joingame(this.value)">Enter</button>
    `
    const tag = document.createElement("div");
    tag.classList.add("room")
    tag.innerHTML = text
    return tag
}



function joingame(code) {
    const currentGame = localStorage.getItem('currentGame')
    const currentGameJSON = JSON.parse(currentGame)
    roomList.forEach(element => {
        if (element.code == code) {
            if (currentGame != null && currentGameJSON.code == code) { return window.location = '/Game' }
            const userdata = {
                code: code,
                role: "viewer"
            }
            localStorage.setItem('currentGame', JSON.stringify(userdata))
            window.location = '/Game'
        }
    });
    console.log("dint have this room"); // <------
}





async function createRoom() {
    const user = JSON.parse(localStorage.getItem('user'))
    let roomName = user.name
    if (document.querySelector("#roomName").value != "") {
        roomName = document.querySelector("#roomName").value
    }
    let coins = document.querySelector('#coins').value
    let aucTime = document.querySelector("#auc-time").value
    console.log(roomName, coins, aucTime);
    const data = {
        roomName:roomName,
        coins:coins,
        aucTime:aucTime
    }
    const res = await fetch("/createRoom", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const resdata = await res.json()
    const userdata = {
        code: resdata.roomcode,
        role: "viewer"
    }
    localStorage.setItem('currentGame', JSON.stringify(userdata))
    window.location = `/Game`
    if (res.status == 500) {
        alert('server down')
    }
}



async function roomconfig() {
    document.querySelector(".roomconfPOP").style.display = "flex"
    const user = JSON.parse(localStorage.getItem('user'))
    const inRoomName = document.querySelector('#roomName')
    inRoomName.placeholder = `default: ${user.name}`
    document.querySelector('.close').addEventListener("click", () => {
        document.querySelector(".roomconfPOP").style.display = "none"
    })
}





















function logout() {
    window.location.href = "/clear";
}

function user() {
    window.location.href = "/user"
}

