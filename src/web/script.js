export async function isUser(req){
    try{
        if (req.cookies.email == null || req.cookies.id == null) {
            return false
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
        if (!JsonResult.Response) {
            return false
        }
        return true

    }catch(e){
        console.log(e);
    }
}