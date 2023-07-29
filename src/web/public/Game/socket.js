import { board, moveClient_Server } from "./board.js";
import { socket } from "./board.js";

const user = JSON.parse(localStorage.getItem('user'))


export function move(source, destination) {
    let data = {
        source: source,
        destination: destination,
        board:board
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


}).catch((error) => {
    console.error('Error loading socket:', error);
});

export function join(data) {
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