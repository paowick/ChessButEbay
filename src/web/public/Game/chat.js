import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const user = JSON.parse(localStorage.getItem('user'))
const currentGame = JSON.parse(localStorage.getItem('currentGame'))
export var socket = io(window.location.origin, {
    path: "/chat/",
    query: {
        code: currentGame.code,
        id: user.id
    }
});
let chatGlobalArray = []
let chatInGameArray = []
window.onload = load()
function load() {
    socket.on("chatInit", async (arg) => {
        chatGlobalArray = await arg.chat
        chatInGameArray = await arg.inGameChat
        arg.chat.forEach(element => {
            const msg = JSON.parse(element)
            msgUpdate(msg)
        });
    })
}

socket.on('msgGlobal', async (arg) => {
    if (chatmode) {
        chatGlobalArray.push(stringify(arg))
        msgUpdate(arg)
        return
    }
    chatGlobalArray.push(stringify(arg))
})

socket.on('msgInGame', async (arg) => {
    if(!chatmode){
        chatInGameArray.push(stringify(arg))
        msgUpdate(arg)
        return
    }
    chatInGameArray.push(stringify(arg))
})

let chatmode = true
// true is global
// false is in game
const openChatButton = document.getElementById('open-chat');
const chatPopup = document.getElementById('chat-popup');
const closeChatButton = document.getElementById('close-chat');
const chatGlobalButton = document.getElementById('ch-gl')
const chatInGameButton = document.getElementById('ch-in')

if (chatmode) {
    chatGlobalButton.style.color = "#8FF7FF"
}

chatGlobalButton.addEventListener('click', () => {
    chatInGameButton.style.color = "#FFF"
    chatGlobalButton.style.color = "#8FF7FF"
    chatmode = true
    chatModeSwitch()
})

chatInGameButton.addEventListener('click', () => {
    chatInGameButton.style.color = "#8FF7FF"
    chatGlobalButton.style.color = "#FFF"
    chatmode = false
    chatModeSwitch()
})


openChatButton.addEventListener('click', () => {
    chatPopup.style.display = 'block';
    openChatButton.style.display = 'none'
});

closeChatButton.addEventListener('click', () => {
    chatPopup.style.display = 'none';
    openChatButton.style.display = 'block'
});



document.querySelector("#send-button")
    .addEventListener("click", () => {
        if (chatmode) {
            msgGlobal()
        } else {
            msgInGame()
        }
    })
document.querySelector('#message-input')
    .addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (chatmode) {
                msgGlobal()
            } else {
                msgInGame()
            }
        }
    });


export function chatModeSwitch() {
    if (chatmode) {
        document.querySelector(".chat-content").innerHTML = ""
        chatGlobalArray.forEach(element => {
            const msg = JSON.parse(element)
            msgUpdate(msg)
        });
    } else {
        document.querySelector(".chat-content").innerHTML = ""
        chatInGameArray.forEach(element => {
            const msg = JSON.parse(element)
            msgUpdate(msg)
        })
    }
}

export function msgGlobal() {
    const user = JSON.parse(localStorage.getItem('user'))
    const msg = document.querySelector("#message-input").value
    if (msg == "") { return }
    const data = {
        senderID: user.id,
        sender: user.name,
        msg: msg
    }
    socket.emit("msgGlobal", data)
    document.querySelector("#message-input").value = ''
}
export function msgInGame() {
    const user = JSON.parse(localStorage.getItem('user'))
    const msg = document.querySelector("#message-input").value
    if (msg == "") { return }
    const data = {
        senderID: user.id,
        sender: user.name,
        msg: msg
    }
    socket.emit("msgInGame", data)
    document.querySelector("#message-input").value = ''
}

export function msgUpdate(arg) {
    const user = JSON.parse(localStorage.getItem('user'))
    let html = `
            <div id="msg">${arg.timestamp} => ${arg.sender}: ${arg.msg}</div>
    `
    if (user.id == arg.senderID) {
        html = `
            <div id="My-msg">${arg.timestamp} => ${arg.sender}: ${arg.msg}</div>
        `
    }
    const htmldom = new DOMParser().parseFromString(html, 'text/xml').documentElement
    let doc = document.querySelector(".chat-content")
    doc.appendChild(htmldom)
    doc.scrollTop = doc.scrollHeight
}

function stringify(obj) {
    let cache = [];
    let str = JSON.stringify(obj, function (key, value) {
        if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // reset the cache
    return str;
}