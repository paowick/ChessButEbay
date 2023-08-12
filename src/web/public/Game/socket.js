import { board, moveClient_Server } from "./board.js";
import { socket } from "./board.js";
import { changeMyTurn } from "./board.js";
import { winPop } from "./script.js";
import { run } from "./board.js";

const user = JSON.parse(localStorage.getItem('user'))


export function move(source, destination, promoted) {
    console.log(`socket ${promoted}`);
    const currentGame = JSON.parse(localStorage.getItem("currentGame"))
    let data = {
        promoted: promoted,
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
        moveClient_Server(arg.source, arg.destination, arg.promoted)
    })

    socket.on('join_server', async (arg) => {
        const info = JSON.parse(arg.board)
        if (info.playerB != null) { document.querySelector('#join_black').style.display = 'none' }
        if (info.playerW != null) { document.querySelector('#join_white').style.display = 'none' }
    })

    socket.on('win_server', async (arg) => {
        winPop(arg)
    })

    socket.on('start', async (arg) => {

        const currentGame = JSON.parse(localStorage.getItem("currentGame"))
        const info = JSON.parse(arg.board)
        if (info.turn === currentGame.role){
            changeMyTurn(true)
        }else{
            changeMyTurn(false)
        }
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
export function win(team) { 
    let data = {
        team: team,
        username: user.id
    }
    import('./board.js').then(({socket})=>{
        socket.emit('win',data)
    }).catch((error)=>{
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
