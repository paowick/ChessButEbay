import express from 'express';
const app = express();
const port = 8080;

import jwt from "jsonwebtoken"

const secret = "56709";
// chage it!!!

app.use(express.json())

app.post('/auth/logInVerify', async (req, res, next) => {
    try {
        const userCheckres = await userCheck(req)
        !userCheckres ? res.json({ userCheckres })
            : res.cookie('tokencookie', userCheckres.tokencookie)
                .json({
                    Response: userCheckres.Response
                })
    } catch (e) {
        res.status(500)
    }
})


app.post("/auth/getVerifyCode", async (req,res)=>{
    try{
        
        res.sendStatus(200)
    }catch{
        res.sendStatus(500)
    }
})

app.post('/auth/signUp', async (req, res) => {
    try {
        console.log(req.body);
        const signupRes = await signUp(req)
        !signupRes ? res.json({
            Response: signupRes,
            Message: 'alredy have email'
        })
            : res.json({
                Response: signupRes
            })
    } catch (e) {
        if(e instanceof TypeError){
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

async function signUp(req) {
    const isHaveUser = await haveUser(req.body.Email)
    return isHaveUser ? false
        : !await InsertUser(req) ? (function () { throw "an error occurred please try again later" }()) : true
}

async function haveUser(Email) {
    const isHaveUser = await fetch(`http://api:8080/api/qureyEmail?Email=${Email}`)
    const res = await isHaveUser.json()
    return res.Response
}

async function InsertUser(req) {
    // here

    const id = await lastid()
    const newid = parseInt(id.Id) + 1
    const data = {
        id: newid,
        email: req.body.Email,
        password: req.body.Pass,
        name: req.body.Name,
        score: 0,
        admin: 0x0
    }

    const insert = await fetch('http://api:8080/api/insertUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const insertres = await insert.json()
    return insertres.Response
}

async function lastid() {
    const id = await fetch('http://api:8080/api/qureyId')
    const idjson = await id.json()
    return idjson
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
        }, secret, { expiresIn: "30d" });

        return {
            Response: true,
            tokencookie: token
        }
    } catch (e) {
        console.log(e);
    }

}