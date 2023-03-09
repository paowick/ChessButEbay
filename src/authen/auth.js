import express from 'express';
const app = express();
const port = 8080;

import * as sc from "./fetchScript.js"

import * as mail from "./nodemailScript.js"

import * as redis from "./redisScript.js"

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
        res.sendStatus(500)
    }
})


app.post("/auth/getVerifyCode", async (req, res) => {
    try {
        const value = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        redis.insertVerifyCode(req.body.key,value)
        mail.sendVerifycode(req.body.key,value)
        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
})

app.post('/auth/signUp', async (req, res) => {
    try {
        if(!fillup(req.body.Name,req.body.Email,req.body.VerifyCode,req.body.Pass)) return res.sendStatus(400)
        if(!ValidatePassword(req.body.Pass)) return res.sendStatus(400)
        console.log(req.body);
        const signupRes = await sc.signUp(req)
        !signupRes ? res.status(500).json({
            Response: signupRes,
            Message: 'alredy have email'
        })
            : res.json({
                Response: signupRes
            })
    } catch (e) {
        console.log(e);
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




function fillup(Name, Email, VerifyCode, Pass) {
    if(Name == '') return false
    if(Email == '') return false
    if(VerifyCode == '') return false
    if(Pass == '') return false
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