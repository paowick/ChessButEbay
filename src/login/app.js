import express from 'express';
import * as db from './dbScript.js';
const app = express();
const port = 8080;

app.use(express.json())

app.post('/login/logInVerify',async (req,res)=>{
    const dbres = await db.connect()
    res.json(
        {
            'hi':'hi',
            'data':req.body,
            'db':dbres
            
        }
    )
})

app.post('/login/signUp',(req,res)=>{

})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
