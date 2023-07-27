import { board, moveClient_Server } from "./board.js";
import { socket } from "./board.js";

const currentGame = JSON.parse(localStorage.getItem('currentGame'))
const user = JSON.parse(localStorage.getItem('user'))

export function move(source, destination) {
    if (destination != source) {
        socket.emit("move", {
            source: source,
            destination: destination
        })
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