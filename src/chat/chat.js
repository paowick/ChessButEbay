import { createServer, get } from 'http'
import { Server } from "socket.io"


const sever = createServer()
const io = new Server(sever, {
    path:"/chat/",
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
})

sever.listen(8080, () => {
    console.log('8080')
})

io.use(function (socket, next) {
    var handshakeData = socket.request;
    console.log("middleware:", handshakeData._query['code']);
    next();
});

io.sockets.on("connection",async(socket)=>{
    console.log(`connnect ${socket.id}`)
})




