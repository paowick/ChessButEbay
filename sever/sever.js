import express from 'express'
const app =express()
import { createServer } from 'http'
import { Server } from "socket.io"


const sever = createServer()
const io = new Server(sever,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
})


sever.listen(8080,()=>{
    console.log('8080')
})

io.on("connection", (socket) => {
    console.log(`connnect ${socket.id}`)
    socket.on("hi",(arg) =>{
        console.log(arg)
    })
    socket.on("move",(arg) =>{
        console.log(`move ${arg.source} to ${arg.destination}`)
    })
    socket.on("disconnect",()=>{
        console.log('dis')
    })
  });