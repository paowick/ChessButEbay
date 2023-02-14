import express from 'express';
const app = express();
const port = 8080;

app.use(express.json())

app.post('/login/logInVerify',async (req,res)=>{
    const data = {
        email:req.body.email,
        password:req.body.password
    }
    const result = await fetch('http://api:8080/api/userCheckBackEnd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const resResult = await result.json()
    if(!resResult.Response){
        return res.json({
            Response:false
        })
    }
    res.json({
        Response:true,
        body:{
            Email:resResult.body.Email,
            Id:resResult.body.Id
        }
    })
})

app.post('/login/signUp',(req,res)=>{

})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
