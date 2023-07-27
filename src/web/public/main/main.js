window.onload = async () => {
    const room = await fetch('/getroom')
    const roomlist = await room.json()
    roomlist.data.forEach(element => {
        const room = JSON.parse(element)
        if (room.player2 == null) {

            document.getElementById("board").appendChild(roomtabview(room.code, room.player1))
        } else {

            document.getElementById("board").appendChild(roomtab(room.code, room.player1, room.player2))
        }

    });


}


function roomtabview(code, player1) {
    const text = `
                    <div class="room-code">
                        <p class="code">Room code: ${code}</p>
                    </div>
                    <div class="player-info">
                        <p class="player">${player1} vs     </p>
                    </div>
                    <button class="join-butt" type="button" value="${code}" onclick="joingame(this.value)">join</button>
    `
    const tag = document.createElement("div");
    tag.classList.add("room")
    tag.innerHTML = text
    return tag
}


function roomtab(code, player1, player2) {
    const text = `
                    <div class="room-code">
                    <p class="code">Room code: ${code}</p>
                    </div>
                    <div class="player-info">
                    <p class="player">${player1} vs ${player2}</p>
                    </div>
                    <button class="join-butt" type="button" onclick="">view</button>
                    `
    const tag = document.createElement("div");
    tag.classList.add("room")
    tag.innerHTML = text
    return tag
}

function joingame(code) {

    const currentGame = localStorage.getItem('currentGame')
    const currentGameJSON = JSON.parse(currentGame)
    console.log(currentGameJSON);
    if (currentGame != null && currentGameJSON.code == code ) { return window.location = '/Game' }
    const userdata = {
        code: code,
        role: "viewer"
    }
    localStorage.setItem('currentGame', JSON.stringify(userdata))
    window.location = '/Game'
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

