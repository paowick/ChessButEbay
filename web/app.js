import express from 'express';
const app = express();
const port = 80;

import path from "path"
const __dirname = path.resolve();

app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.sendFile(`${__dirname}/public/index`)
})

app.get('/Game.html',(req,res)=>{
    res.sendFile(`${__dirname}/public/Game.html`)
})

app.listen(port,()=>{
    console.log(`listen on port ${port}`);
})