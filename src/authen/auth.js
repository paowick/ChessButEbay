import express, { json } from 'express';
const app = express();
const port = 8080;
import * as redis from './redisScript.js'

import jwt from "jsonwebtoken"

const secret = "56709";
// chage it!!!

app.use(express.json())

app.post('/auth/logInVerify', async (req, res) => {
    res.json(await userCheck(req))

})








app.post('/auth/signUp', async (req, res) => {
    console.log(req.body);
    const signupRes = await signUp(req)
    !signupRes? res.json({
        Response : signupRes,
        Message : 'alredy have email'
    })
    : res.json({
        Response : signupRes
    })
    console.log(signupRes);
    
})

app.listen(port, () => {
    console.log(`listen on port ${port}`);
})

async function signUp(req) {
    const isHaveUser = await haveUser(req.body.Email)
    return isHaveUser ? false
        : true //here
}

async function haveUser(Email) {
    const isHaveUser = await fetch(`http://api:8080/api/qureyEmail?Email=${Email}`)
    const res = await isHaveUser.json()
    return res.Response
}

async function InsertUser(req) {
    // here
}

































async function userCheck(req) {
    try {

        const data = {
            email: req.body.email,
            password: req.body.password
        }
        const result = await fetch('http://api:8080/api/userCheckBackEnd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        const resResult = await result.json()
        if (!resResult.Response) {
            return {
                Response: false
            }
        }

        const token = jwt.sign({
            Id: resResult.body.Id,
            Email: resResult.body.Email
        }, secret, { expiresIn: 5 });

        return {
            Response: true,
            tokencookie: token
        }
    } catch (e) {
        console.log(e);
    }

}