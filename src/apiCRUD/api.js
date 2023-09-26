import express from 'express';
import * as db from './dbScript.js';
const app = express();
const port = 8080;

app.use(express.json())

app.post('/api/userCheckBackEnd', async (req, res) => {
    try {
        if (req.body.password == null) {
            const dbres = await db.userCheckBackEnd(req.body.email, req.body.id)
            res.json({
                Response: dbres
            })
        } else {
            const dbres = await db.userCheckBackEndPass(req.body.email, req.body.password)
            res.json({
                Response: dbres.Response,
                body: dbres.data
            })
        }
    } catch (e) {
        res.status(500)
    }
})

app.get("/api/qureyEmail", async (req, res) => {
    try {
        const dbres = await db.userQurey(req.query.Email)
        res.json({
            Response: dbres.Response
        })
    } catch (e) {
        res.status(500)
    }
})



app.post("/api/insertUser", async (req, res) => {
    const insertres = await db.InsertUser(req.body.email, req.body.password, req.body.name, req.body.score, req.body.admin)
    if (insertres) {
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
})

app.post('/api/resetpassword', async (req, res) => {
    const resetpassword = await db.resetPassword(req.body.email, req.body.pass)
    if (resetpassword) {
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
})

app.post('/api/editinfo', async (req, res) => {
    try {
        const editinfo = db.editinfo(req.body.id, req.body.name, req.body.fname, req.body.lname)
        if (editinfo) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})

app.post('/api/editpassword', async (req, res) => {
    try {
        const editpassword = db.editpassword(req.body.id,req.body.password)
        if (editpassword) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})

app.get('/api/getalluser',async (req,res)=>{
    try {
        const allUser = await db.getAllUser()
        res.send(allUser)
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})
app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
