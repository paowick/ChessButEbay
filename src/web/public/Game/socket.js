import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { board, moveClient_Server} from "./board.js";

const socket = io();
const user = JSON.parse(localStorage.getItem('user'))
socket.emit('userdata',{
    user:user,
    board:board
})
export function move(source, destination) {
    if (destination != source) {
        socket.emit("move", {
            source: source,
            destination: destination
        })
    }
}

socket.on('move_server', (arg)=>{
    console.log(arg);
    moveClient_Server(arg.source,arg.destination)
})

socket.on('gamedata', (arg)=>{
    console.log(arg);
})