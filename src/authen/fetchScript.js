import jwt from "jsonwebtoken"

const secret = "56709";



export async function signUp(req) {
    const isHaveUser = await haveUser(req.body.Email)
    return isHaveUser ? false
        : !await InsertUser(req) ? (function () { throw "an error occurred please try again later" }()) : true
}

export async function haveUser(Email) {
    const isHaveUser = await fetch(`http://api:8080/api/qureyEmail?Email=${Email}`)
    const res = await isHaveUser.json()
    return res.Response
}

export async function InsertUser(req) {
    const data = {
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

export async function userCheck(req) {
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
        return {
            Response: true,
            user:{
                id:resResult.body.Id,
                email:resResult.body.Email,
                password:resResult.body.Password,
                name:resResult.body.Name,
                fname:resResult.body.Fname,
                lname:resResult.body.Lname,
                score:resResult.body.Score,
                admin:resResult.body.Admin,
            }
        }
    } catch (e) {
        console.log(e);
    }

}