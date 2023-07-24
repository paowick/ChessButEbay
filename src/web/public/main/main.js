window.onload = () => {
    const roomlist = [
        {
            code: "N8O5",
            player1: "Halla",
            player2: null
        },
        {
            code: "J8C5",
            player1: "Charity",
            player2: "Phoebe"
        },
        {
            code: "Z8H5",
            player1: "Adrian",
            player2: null
        },
        {
            code: "G5M2",
            player1: "Rooney",
            player2: null
        },
        {
            code: "B3G4",
            player1: "Ross",
            player2: "Imani"
        },
        {
            code: "Y7O5",
            player1: "Ezekiel",
            player2: "Kane"
        },
        {
            code: "C2K4",
            player1: "Daniel",
            player2: null
        },
        {
            code: "P1S4",
            player1: "Allistair",
            player2: null
        },
        {
            code: "W3D5",
            player1: "Kaseem",
            player2: "Colleen"
        },
        {
            code: "F4U9",
            player1: "Preston",
            player2: "Kimberley"
        },
    ]

    roomlist.forEach(element => {
        if (element.player2 == null) {

            document.getElementById("board").appendChild(roomtabview(element.code, element.player1))
        }else{

            document.getElementById("board").appendChild(roomtab(element.code, element.player1, element.player2))
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
    const data = {}
    const res = await fetch("/createRoom",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
}
























function logout() {
    window.location.href = "/clear";
}

function user() {
    window.location.href = "/user"
}

