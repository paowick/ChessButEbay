const express = require("express")
let app = express()

app.listen(8080,() =>{
    console.log("test")
})

app.get("/"),(req,res,next) =>{
    res.send("hi bro")
}
