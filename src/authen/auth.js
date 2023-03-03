import express from 'express';
const app = express();
const port = 8080;

import * as sc from "./fetchScript.js"

import * as mail from "./nodemailScript.js"
app.use(express.json())

app.post('/auth/logInVerify', async (req, res, next) => {
    try {
        const userCheckres = await sc.userCheck(req)
        !userCheckres ? res.json({ userCheckres })
            : res.cookie('tokencookie', userCheckres.tokencookie)
                .json({
                    Response: userCheckres.Response
                })
    } catch (e) {
        res.status(500)
    }
})


app.post("/auth/getVerifyCode", async (req, res) => {
    try {
        
        // mail.sendVerifycode('korn2k9@gmail.com','1234')

        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
})

app.post('/auth/signUp', async (req, res) => {
    try {
        console.log(req.body);
        const signupRes = await sc.signUp(req)
        !signupRes ? res.json({
            Response: signupRes,
            Message: 'alredy have email'
        })
            : res.json({
                Response: signupRes
            })
    } catch (e) {
        if (e instanceof TypeError) {
            return res.status(500).json({
                Message: "an error occurred please try again later"
            })
        }
        console.log(e);
        res.status(500).json({
            Message: e
        })
    }
})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})
