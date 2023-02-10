import express from 'express';
const app = express();
const port = 8080;

import path from "path"
const __dirname = path.resolve();

app.use(express.static('public'));
app.use(express.static('public/Game'));
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

app.get('/userVerify', (req, res) => {
    res.sendFile(`${__dirname}/public/Login/login.html`)
})

app.post('/session', (req,res) => {
    if(req.body.data == ''){
        res.redirect('/userVerify')
        return
    }
    // do it after we have login sevice yet
    res.json(
        {
            test:'login'
        }
    )
})

app.get('/Game', (req, res) => {
    res.sendFile(`${__dirname}/public/Game/Game.html`)
})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
