import express from 'express';
import * as db from './dbScript.js';
const app = express();
const port = 8080;

app.use(express.json())

app.post('/login/logInVerify',async (req,res)=>{
    const dbres = await db.userCheck(req.body.email,req.body.password)
    if(!dbres.Response){
        return res.json({
            body:false
        })
    }
    res.json({
        Response:true,
        body:{
            Email:dbres.data[0].Email,
            Password:dbres.data[0].Password
        }
    })
})

app.post('/login/signUp',(req,res)=>{

})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
