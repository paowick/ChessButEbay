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
                Response: dbres.Response
            })
        } else {
            const dbres = await db.userCheckBackEndPass(req.body.email, req.body.password)
            res.json({
                Response: dbres.Response,
                body: dbres.data
            })
        }
    }catch(e){
        console.log(e);
    }
})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
