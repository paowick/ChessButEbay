roomload()
if (typeof roomList === 'undefined' || roomList === null) {
    let roomList = []
    // variable is undefined or null
}

async function roomload() {
    const room = await fetch('/getroom')
    const roomlist = await room.json()
    roomList = []
    roomList = roomlist.datares
    if (!document.body.contains(document.getElementById('board'))) { return }
    document.getElementById('board').innerHTML = ""
    roomlist.datares.forEach(element => {
        document.getElementById("board").appendChild(roomtabview(element))
    });
}
function roomtabview(room) {
    // <div id="room-status">
    // </div>
    // <div class="info">
    //     <p class="player">${room.name}</p>
    // </div>
    // <button class="join-butt" type="button" value="${room.code}" onclick="enter(this.value)">Enter</button>
    

    const roomstatus = document.createElement('div')
    roomstatus.setAttribute("id", "room-status")

    const info = document.createElement('div')
    info.classList.add("info")

    const p = document.createElement('p')
    p.classList.add("player")
    p.innerHTML = room.name


    const button = document.createElement('button')
    button.classList.add("join-butt")
    button.setAttribute("type", "button")
    button.setAttribute("value", room.code)
    button.setAttribute("onclick","enter(this.value)")
    button.innerHTML = "Enter"

    info.appendChild(p)

    const tag = document.createElement("div");
    tag.classList.add("room")
    tag.appendChild(roomstatus)
    tag.appendChild(info)
    tag.appendChild(button)
    // tag.innerHTML = text
    return tag
}

document.querySelector("#code-input").addEventListener("input", (e) => {
    let searchByName = str => roomList.filter(item => item.name.toLowerCase().includes(str.toLowerCase()))
    const newroomlist = searchByName(e.target.value);
    if (!document.body.contains(document.getElementById('board'))) { return }
    document.getElementById('board').innerHTML = ""
    newroomlist.forEach(element => {
        document.getElementById("board").appendChild(roomtabview(element))
    })

})
function enter(code) {
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
}




document.querySelector('#auc-time').addEventListener('input', (e) => {
    if (e.target.value > 60) { e.target.value = 60 }
    if (e.target.value <= 0) { e.target.value = 5 }
})
document.querySelector('#coins').addEventListener('input', (e) => {
    if (e.target.value <= 0) { e.target.value = 1000 }
})

document.querySelector("#createroom").addEventListener("click", async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    let roomName = user.name
    if (document.querySelector("#roomName").value != "") {
        roomName = document.querySelector("#roomName").value
    }
    let coins = document.querySelector('#coins').value
    let aucTime = document.querySelector("#auc-time").value
    const data = {
        roomName: roomName,
        coins: coins,
        aucTime: aucTime
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
})


document.querySelector("#roomconfig").addEventListener('click', () => {
    document.querySelector("#roomconfPOP").style.display = "flex"
    const user = JSON.parse(localStorage.getItem('user'))
    const inRoomName = document.querySelector('#roomName')
    inRoomName.placeholder = `default: ${user.name}`
})
document.querySelector('.close').addEventListener("click", () => {
    document.querySelector(".roomconfPOP").style.display = "none"
})





















function logout() {
    window.location.href = "/clear";
}

function user() {
    window.location.href = "/user"
}

