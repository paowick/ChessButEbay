


export async function isUser(req){
    try{
        console.log(req.session);
        if (req.session.user == null) {
            return false
        }
        
        const data = {
            email: req.session.user.email,
            id: req.session.user.id
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
            return false
        }
        return true

    }catch(e){
        console.log(e);
    }
}