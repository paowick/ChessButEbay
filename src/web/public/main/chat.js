import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const user = JSON.parse(localStorage.getItem('user'))
export var socket = io(window.location.origin, {
    path:"/chat/",
    query: {
        code:null,
        id: user.id
    }
});