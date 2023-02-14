import express from 'express';
const app = express();
const port = 8080;

import path from "path"
const __dirname = path.resolve();

app.use(express.static('public'));
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/main/index.html`)
})

app.get('/auth', (req, res) => {
    res.sendFile(`${__dirname}/public/userAuth/login.html`)
})

app.get('/Game', (req, res) => {
    res.sendFile(`${__dirname}/public/Game/Game.html`)
})

app.post('/session', (req,res) => {
    if(req.body.data == ''){
        res.redirect('/auth')
        return
    }
    // do it after we have login sevice yet
    res.json(
        {
            test:'login'
        }
    )
})


app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
