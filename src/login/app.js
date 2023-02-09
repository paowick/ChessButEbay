import express from 'express';
const app = express();
const port = 8080;

app.use(express.json())

app.post('/login/logInVerify',(req,res)=>{
    console.log(req.body)
    res.json(
        {
            'hi':'hi'
        }
    )
})

app.post('/login/signUp',(req,res)=>{

})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
