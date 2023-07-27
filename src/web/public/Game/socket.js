import { board, moveClient_Server } from "./board.js";
import { socket } from "./board.js";

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
    socket.on("req-board",(arg)=>{
        const board = localStorage.getItem('board')
        if(arg.id == user.id){
            socket.emit('res-board',{
                board:board
            })
        }
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