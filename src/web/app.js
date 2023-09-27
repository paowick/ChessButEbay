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


app.get('/admin',(req,res)=>{
    console.log(typeof(req.session.user.admin.data[0]));
    try {
        if(req.session.user.admin.data[0] == 0){
            return res.redirect("/")
        }
        if (!req.session.user) {
            return res.redirect("/login")
        }
        res.sendFile(`${__dirname}/public/adminPage/admin.html`)
    } catch (e) {
        res.status(500)
    }
})

app.get("/admin/getalluser", async (req,res)=>{
    try {
        if(req.session.user.admin.data[0] == 0){
            return res.status(404)
        }
        if (!req.session.user) {
            return res.redirect("/login")
        }

        const alluser = await fetch(`http://api:8080/api/getalluser`)
        res.send(await alluser.json())
    } catch (e) {
        res.status(500)
    }
})



app.get('/login', (req, res) => {
    try {
        res.sendFile(`${__dirname}/public/loginPage/login.html`)
    } catch (e) {
        res.status(500)
    }

})

app.get('/signup', (req, res) => {
    try {
        res.sendFile(`${__dirname}/public/signupPage/signup.html`)
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
        res.sendFile(`${__dirname}/public/forgotpasswordPage/forgot.html`)
    } catch (e) {
        console.log(e);
        res.status(500)
    }
})



app.get('/', async (req, res) => {
    try {
        console.log(req)
        if (!req.session.user) {
            return res.redirect("/login")
        }
        res.sendFile(`${__dirname}/public/index/index.html`)
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
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})

app.post(`/editinfo`, async (req, res) => {
    try {
        req.session.user.name = req.body.Username
        req.session.user.fname = req.body.Fname
        req.session.user.lname = req.body.Lname
        const data = {
            id: req.body.id,
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

app.post(`/deleteuser`,async (req,res)=>{
    try {
        const delRES = await fetch(`http://api:8080/api/deleteuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        })

        if (delRES.status == 500) { res.sendStatus(500) }
        res.sendStatus(200)
    } catch (error) {
        console.log(e);
        res.sendStatus(500)
    }
})

app.post(`/editpassword`, async (req, res) => {
    try {
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
        const roomcode = await sc.createRoom(req.body)
        res.json({
            roomcode:roomcode,
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500)
    }
})

app.get(`/getroom`, async (req,res)=>{
    try{
        let datares = []
        const data = await sc.getallRoom()
        data.forEach(element => {
            const dataconvert = JSON.parse(element)
            let data = {
                code:dataconvert.code,
                playerB:dataconvert.playerB,
                playerBName:dataconvert.playerBName,
                playerW:dataconvert.playerW,
                playerWName:dataconvert.playerWName,
                name:dataconvert.roomname
            }
            datares.push(data)
        });
        res.json({datares})
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


app.get(`/clear`, (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/login') // will always fire after session is destroyed
    })
})
app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
