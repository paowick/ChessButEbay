async function login() {
    const loginInput = document.getElementById('email').value
    const passInput = document.getElementById('password').value
    ValidateEmail(loginInput) ? userCheck(loginInput, passInput) : errEmailInvalid();

}

async function userCheck(loginInput, passInput) {
    const data = {
        email: loginInput,
        password: passInput
    }
    const resLogin = await fetch(`/auth/logInVerify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const resdata = await resLogin.json()
    !resdata.Response ? errEmailPassword() : loginPass(resdata.tokencookie)

}

function signUp() {
    location.href = '/signup'
}

function errEmailInvalid() {
    const form = document.getElementById('err')
    form.innerHTML = ''
    form.innerHTML += '<h7 style="color: red;" class="err-text">Email invalid<h7>'

}

function errEmailPassword() {
    const form = document.getElementById('err')
    form.innerHTML = ''
    form.innerHTML += '<h7 style="color: red;" class="err-text" >Please check your email or password<h7>'
}

function loginPass(newCookie) {
    cookieSet(newCookie)
    location.href = '/'
}

function cookieSet(newCookie) {
    document.cookie = `tokencookie=${newCookie};`

}

function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const email = document.getElementById('email')
    if (input.match(validRegex)) {
        email.classList.remove('email-invalid')
        return true;
    } else {
        email.setAttribute('class','email-invalid')
        errEmailInvalid()
        const loginbutton = document.getElementById('login-bt')
        if (loginbutton.classList[0] == 'loginbuttRight') {
            loginbutton.setAttribute('class', 'loginbuttLeft')
        } else {
            loginbutton.setAttribute('class', 'loginbuttRight')
        }
        return false;
    }

}