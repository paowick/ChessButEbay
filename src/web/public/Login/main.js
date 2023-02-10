async function login() {
    const loginInput = document.getElementById('email').value
    const passInput = document.getElementById('password').value
    const data = {
        email: loginInput,
        password: passInput
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
    !resdata.Response ? errEmailPassword() : loginPass(resdata.body)


}

function signUp() {
    console.log("signUp");
}

function errEmailPassword() {
    const form = document.getElementById('err')
    if(form.innerHTML == '')form.innerHTML += '<h7 style="color: red;">Please check your email or password<h7>'
}

function loginPass(newCookie) {
    cookieSet(newCookie)
    location.href = '/'
}

function cookieSet(newCookie) {
    document.cookie = `email=${newCookie.Email}; password=${newCookie.Password};`
}