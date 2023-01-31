import express from 'express';
const app = express();
const port = 8080;

import path from "path"
const __dirname = path.resolve();

app.use(express.static('public'));
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/public/login.html`)
})

app.post('/session', (req,res) => {
    console.log(req.body);
    res.json(
        {
            test:'test'
        }
    )
})

app.get('/Game.html', (req, res) => {
    res.sendFile(`${__dirname}/public/Game.html`)
})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
