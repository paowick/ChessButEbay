import express from 'express'
const app =express()
import { createServer } from 'http'
import { disconnect } from 'process'
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
    console.log('conn')
    socket.on("disconnect",()=>{
        console.log('dis')
    })
  });