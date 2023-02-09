async function cookieCheck() {
    let root = document.location.hostname
    const allCookies = document.cookie;
    const data = {
        data: allCookies
    }
    const sesssion = await fetch(`/session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if(sesssion.redirected){ return location.href = `${sesssion.url}`}
    const resdata = await sesssion.json()
    console.log(resdata);
}

cookieCheck()