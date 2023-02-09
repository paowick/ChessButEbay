async function login() {
    const loginInput = document.getElementById('email').value
    const passInput = document.getElementById('password').value
    const data ={
        email : loginInput,
        password : passInput
    }
    const resLogin = await fetch(`/login/logInVerify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const resdata = await resLogin.json()
    console.log(resdata);
}

function signUp() {
    
}