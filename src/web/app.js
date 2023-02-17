import express from 'express';
import cookieParser from 'cookie-parser';
import * as Script from './script.js'
const app = express();
const port = 8080;
import path from "path"
const __dirname = path.resolve();

app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

app.get('/auth', (req, res) => {
    res.sendFile(`${__dirname}/public/userAuth/login.html`)
})

app.get('/Game', (req, res) => {
    res.sendFile(`${__dirname}/public/Game/Game.html`)
})

app.get('/', async (req, res) => {
    await Script.isUser(req)? res.sendFile(`${__dirname}/public/main/index.html`):res.redirect('/auth')
})


app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
