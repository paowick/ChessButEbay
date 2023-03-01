import express from 'express';
import * as db from './dbScript.js';
const app = express();
const port = 8080;

app.use(express.json())

app.post('/api/userCheckBackEnd', async (req, res) => {
    try{
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
    }catch(e){
        res.status(500)
    }
})

app.get("/api/qureyEmail", async (req,res)=>{
    try{
        const dbres = await db.userQurey(req.query.Email)
        res.json({
            Response:dbres.Response
        })
    }catch(e){
        res.status(500)
    }
})

app.get("/api/qureyId",async (req,res)=>{
    try{
        const id = await db.qureyId()
        res.json(id)
    }catch(e){
        res.status(500)
    }
})

app.post("/api/insertUser",async (req,res)=>{
    const insertres = await db.InsertUser(req.body.id,req.body.email,req.body.password,req.body.name,req.body.score,req.body.admin)
    res.json({Response:insertres})
})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
