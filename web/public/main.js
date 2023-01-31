async function cookieCheck(){
    let root = document.location.hostname
    const allCookies = document.cookie;
    console.log(allCookies);
    const data = {
        test:'test'
    }
    await fetch(`http://${root}/addUser`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((res))
}

cookieCheck()
