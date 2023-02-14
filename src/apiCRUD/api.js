import express from 'express';
import * as db from './dbScript.js';
const app = express();
const port = 8080;

app.use(express.json())

app.post('/api/userCheckBackEnd',async(req,res)=>{
    const dbres = await db.userCheckBackEnd(req.body.email)
    res.json({
        Response:dbres.Response
    })
})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
