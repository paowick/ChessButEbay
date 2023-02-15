import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
const port = 8080;
import path from "path"
const __dirname = path.resolve();

app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

app.get('/auth', (req, res) => {
    res.sendFile(`${__dirname}/public/userAuth/login.html`)
})

app.get('/Game', (req, res) => {
    res.sendFile(`${__dirname}/public/Game/Game.html`)
})

app.get('/', async (req, res) => {
    try{
        if (req.cookies.email == null || req.cookies.id == null) {
            res.redirect('/auth')
            return
        }
        const data = {
            email: req.cookies.email,
            id: req.cookies.id
        }
        const result = await fetch('http://api:8080/api/userCheckBackEnd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        const JsonResult = await result.json()
        console.log(JsonResult);
        if (!JsonResult.Response) {
            res.redirect('/auth')
            return
        }
        res.sendFile(`${__dirname}/public/main/index.html`)

    }catch(e){
        console.log(e);
    }
})


app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
