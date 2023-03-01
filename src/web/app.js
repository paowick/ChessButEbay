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

app.get('/login', (req, res) => {
    try {
        res.sendFile(`${__dirname}/public/userAuth/loginPage/login.html`)
    } catch (e) {
        res.status(500)
    }

})

app.get('/signup', (req, res) => {
    try {
        res.sendFile(`${__dirname}/public/userAuth/signupPage/signup.html`)
    } catch (e) {
        res.status(500)
    }
})

app.get('/Game', (req, res) => {
    try {
        res.sendFile(`${__dirname}/public/Game/Game.html`)
    } catch (e) {
        res.status(500)
    }
})

app.get('/', async (req, res) => {
    try {
        await Script.isUser(req) ? res.sendFile(`${__dirname}/public/main/index.html`) : res.redirect('/login')
    } catch (e) {
        res.status(500)
    }
})


app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
