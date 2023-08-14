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
    roomload()
}, 5000)


function roomtabview(room) {
    let player = ''
    if (room.playerB == null && room.playerW == null) {
        player = "No one play"
    }
    if (room.playerB != null && room.playerW == null) {
        player = `${room.playerBName} as Black`
    }
    if (room.playerB == null && room.playerW != null) {
        player = `${room.playerWName} as white`
    }
    if (room.playerB != null && room.playerW != null) {
        player = `${room.playerWName} VS ${room.playerBName}`
    }
    const text = `
                    <div class="room-code">
                    </div>
                    <div class="info">
                        <p class="player">${player}</p>
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
    const data = {
        user: user
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
























function logout() {
    window.location.href = "/clear";
}

function user() {
    window.location.href = "/user"
}

