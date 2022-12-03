const express = require("express")
const path = require('path')
let app = express()



app.listen(8080,() =>{
    console.log("on port 8080")
})

app.use(express.static(path.join(__dirname,'web')))

app.post("/posts",express.json(),(req,res,next) => {
    
})

