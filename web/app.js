import express from 'express';
const app = express();
const port = 8080;

import path from "path"
import { nextTick } from 'process';
const __dirname = path.resolve();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index`)
})

app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/public/login.html`)
})

app.get('/Game.html', (req, res) => {
    res.sendFile(`${__dirname}/public/Game.html`)
})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
