import { io } from "socket.io-client";



const socket = io("ws://socket:8080", {})

export function createRoom() {
    socket.emit('createRoom','random');
}