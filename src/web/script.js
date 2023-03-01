import jwt from "jsonwebtoken"

const secret = "56709";
// chage it!!!


export async function isUser(req){
    try{
        if (req.cookies.tokencookie == null) {
            return false
        }
        const jwtverify = jwt.verify(req.cookies.tokencookie, secret, function(err,decoded) {
            if (err) console.log(err);
            else return decoded;
        });
        const data = {
            email: jwtverify.Email,
            id: jwtverify.Id
        }
        const result = await fetch('http://api:8080/api/userCheckBackEnd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        const JsonResult = await result.json()
        if (!JsonResult.Response) {
            return false
        }
        return true

    }catch(e){
        console.log(e);
    }
}