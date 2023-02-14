import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();
const port = 8080;
import path from "path"
const __dirname = path.resolve();

app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/main/index.html`)
})

app.get('/auth', (req, res) => {
    res.sendFile(`${__dirname}/public/userAuth/login.html`)
})

app.get('/Game', (req, res) => {
    res.sendFile(`${__dirname}/public/Game/Game.html`)
})

app.post('/session', async (req, res) => {
    if (req.cookies.email == null) {
        res.redirect('/auth')
        return
    }
    const data = {
        email: req.cookies.email
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
    res.status(200).end()




})


app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
