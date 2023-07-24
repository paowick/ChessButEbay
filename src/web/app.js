import express from 'express';
import cookieParser from 'cookie-parser';
import sessions from 'express-session';
import RedisStore from "connect-redis"
import {createClient} from "redis"
import bodyParser from 'body-parser'
import * as sc from './script.js'

const app = express();
const port = 8080;
import path from "path"
const __dirname = path.resolve();

import * as dotenv from 'dotenv'
dotenv.config()

app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let redisClient = createClient({
    socket: {
        host: 'authredis',
        port: '6379'
    }
})
redisClient.connect().catch(console.error)

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})




const age = 365 * 24 * 60 * 60 * 1000;
app.use(sessions({
    store: redisStore,
    secret: process.env.SESSIONKEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: age
    },
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

app.get('/forgotPassword', (req, res) => {
    try {
        res.sendFile(`${__dirname}/public/userAuth/forgotpasswordPage/forgot.html`)
    } catch (e) {
        console.log(e);
        res.status(500)
    }
})

app.get('/user', (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login")
        }
        res.sendFile(`${__dirname}/public/userPage/user.html`)
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
            Response: resdata.Response
        })
        console.log(req.session.user);
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})

app.post(`/editinfo`, async (req, res) => {
    try {
        console.log(req.session.user.name);
        req.session.user.name = req.body.Username
        req.session.user.fname = req.body.Fname
        req.session.user.lname = req.body.Lname
        const data = {
            id: req.session.user.id,
            name: req.body.Username,
            fname: req.body.Fname,
            lname: req.body.Lname
        }
        const editinfoRES = await fetch(`http://api:8080/api/editinfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        if (editinfoRES.status == 500) { res.sendStatus(500) }
        res.sendStatus(200)
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})

app.post(`/editpassword`, async (req, res) => {
    try {
        console.log(req.session.user);
        req.session.user.password = req.body.password
        const data = {
            id: req.session.user.id,
            password:req.body.password
        }
        const editinfoRES = await fetch(`http://api:8080/api/editpassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        if (editinfoRES.status == 500) { res.sendStatus(500) }
        res.sendStatus(200)
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})

app.post(`/createRoom`, async (req,res)=>{
    try {
        const roomcode = await sc.createRoom(req.body.user.id,req.body.user.name)
        res.json({
            roomcode:roomcode
        })
    } catch (error) {
        res.sendStatus(500)
    }
})

app.get(`/getroom`, async (req,res)=>{
    try{
        const data = await sc.getallRoom()
        res.json({data})
    }catch(e){

    }
})

app.get(`/getsession`, (req, res) => {
    try {
        console.log(req.session.user);
        res.json({
            data: req.session.user
        })
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})

app.get(`/about`, (req, res) => {
    try {
        res.sendFile(`${__dirname}/public/about/about.html`)
    } catch (e) {
        res.status(500)
    }
})

app.get(`/clear`, (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/') // will always fire after session is destroyed
    })
})
app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
