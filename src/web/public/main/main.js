window.onload = async () => {
    const room = await fetch('/getroom')
    const roomlist = await room.json()
    console.log(roomlist);

    roomlist.data.forEach(element => {
        const room = JSON.parse(element)
        if (room.player2 == null) {

            document.getElementById("board").appendChild(roomtabview(room.code, room.player1))
        }else{

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
                    <button class="join-butt" type="button" onclick="window.location = '/Game?code=${code}'">join</button>
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
                    <button class="join-butt" type="button" onclick="window.location = '/Game?code=${code}'">view</button>
    `
    const tag = document.createElement("div");
    tag.classList.add("room")
    tag.innerHTML = text
    return tag
}

async function createRoom() {
    const user = JSON.parse(localStorage.getItem('user'))
    const data = {
        user : user
    }
    const res = await fetch("/createRoom",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const resdata = await res.json()
    localStorage.setItem('currentGame',resdata.roomcode)
    window.location = `/Game?code=${resdata.roomcode}`
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

