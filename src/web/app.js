import express from 'express';
import cookieParser from 'cookie-parser';
import * as Script from './script.js'
import sessions from 'express-session';
const app = express();
const port = 8080;
import path from "path"
const __dirname = path.resolve();

import * as dotenv from 'dotenv'
dotenv.config()

app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())


const age = 365 * 24 * 60 * 60 * 1000;
app.use(sessions({
    secret: process.env.SESSIONKEY,
    saveUninitialized: true,
    cookie: { maxAge: age },
    resave: false
}));


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
        if (!req.session.user) {
            return res.redirect("/login")
        }
        res.sendFile(`${__dirname}/public/Game/Game.html`)
    } catch (e) {
        res.status(500)
    }
})

app.get('/forgotPassword',(req,res) => {
    try {
        res.sendFile(`${__dirname}/public/userAuth/forgotpasswordPage/forgot.html`)
    } catch (e) {
        console.log(e);
        res.status(500)
    }
})

app.get('/', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login")
        }
        res.sendFile(`${__dirname}/public/main/index.html`)
    } catch (e) {
        console.log(e);
        res.status(500)
    }
})
app.post(`/logInVerify`, async (req, res) => {
    try {
        const data = {
            email: req.body.email,
            password: req.body.password
        }
        const login = await fetch(`http://auth:8080/auth/logInVerify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        const resdata = await login.json()
        
        
        req.session.user = resdata.user
        res.json({
            Response : resdata.Response
        })
        console.log(req.session.user);
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})


app.get(`/clear`,(req,res)=>{
    req.session.destroy((err) => {
    res.redirect('/') // will always fire after session is destroyed
})
})
app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
