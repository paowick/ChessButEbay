import express from 'express';
const app = express();
const port = 8080;

import * as sc from "./fetchScript.js"

import * as mail from "./nodemailScript.js"

import * as redis from "./redisScript.js"

app.use(express.json())

app.post('/auth/logInVerify', async (req, res, next) => {
    try {

        console.log(req.body);

        const userCheckres = await sc.userCheck(req)
        !userCheckres ? res.json({ userCheckres })
            : res.json({
                user: userCheckres.user,
                Response: userCheckres.Response
            })
    } catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
})


app.post("/auth/getVerifyCode", async (req, res) => {
    try {
        const value = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        redis.insertVerifyCode(req.body.key, value)
        mail.sendVerifycode(req.body.key, value)
        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
})

app.post('/auth/signUp', async (req, res) => {
    try {
        console.log(req.body.Name);
        if (!fillup(req.body.Name, req.body.Email, req.body.VerifyCode, req.body.Pass)) return res.sendStatus(400)
        if (!ValidatePassword(req.body.Pass)) return res.sendStatus(400)
        const codeIsTruth = await redis.verifyCodeChecker(req.body.Email, req.body.VerifyCode)
        if (!codeIsTruth) return res.sendStatus(406)
        const signupRes = await sc.signUp(req)
        if (!signupRes) {
            return res.sendStatus(400)
        }
        res.sendStatus(200)
    } catch (e) {
        if( e instanceof SyntaxError){ return res.sendStatus(200)}
        res.sendStatus(500)
    }
})

app.post('/auth/codecheck', async (req, res) => {
    try {
        console.log(req.body);
        const codeIsTruth = await redis.verifyCodeChecker(req.body.email, req.body.code)
        if (!codeIsTruth) return res.sendStatus(406)
        res.sendStatus(200)
    } catch {
        console.log(e);
        res.sendStatus(500)
    }
})

app.post('/auth/resetpassword', async (req, res) => {

    try {
        console.log(req.body);
        if (!ValidatePassword(req.body.password)) { return res.sendStatus(400) }
        const codeIsTruth = await redis.verifyCodeChecker(req.body.email, req.body.code)
        if (!codeIsTruth) return res.sendStatus(406)

        const data = {
            email: req.body.email,
            pass: req.body.password
        }
        const resetPassword = await fetch(`http://api:8080/api/resetpassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })


    if (resetPassword.status == 200) { return res.sendStatus(200) }
    if (resetPassword.status == 500) { return res.sendStatus(500) }

    } catch (e){
        console.log(e);
        res.sendStatus(500)
    }
})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})




function fillup(Name, Email, VerifyCode, Pass) {
    if (Name == '') return false
    if (Email == '') return false
    if (VerifyCode == '') return false
    if (Pass == '') return false
    return true
}


function ValidatePassword(input) {
    var validRegex = /[a-z]/i;
    if (input.match(validRegex) && (input.length >= 6)) {
        return true;
    } else {
        return false
    }

}