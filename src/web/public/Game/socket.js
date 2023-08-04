import { board, moveClient_Server } from "./board.js";
import { socket } from "./board.js";
import { run } from "./board.js";

const user = JSON.parse(localStorage.getItem('user'))


export function move(source, destination) {

    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    let data = {
        turn: currentGame.role,
        source: source,
        destination: destination,
        board: board
    }
    if (destination != source) {
        socket.emit("move", stringify(data))
    }
}
import('./board.js').then(({ socket }) => {
    socket.on('move_server', (arg) => {
        console.log(arg);
        moveClient_Server(arg.source, arg.destination)
    })

    socket.on('join_server', async (arg) => {
        const info = JSON.parse(arg.board)
        if (info.playerB != null) { document.querySelector('#join_black').style.display = 'none' }
        if (info.playerW != null) { document.querySelector('#join_white').style.display = 'none' }
    })


}).catch((error) => {
    console.error('Error loading socket:', error);
});

export function join(game, username) {
    let data = {
        data: game,
        username: username
    }
    import('./board.js').then(({ socket }) => {
        socket.emit('join', data)
    }).catch((error) => {
        console.error('Error loading socket:', error);
    })
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
