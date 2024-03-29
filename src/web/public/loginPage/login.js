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
    const resLogin = await fetch(`/logInVerify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const resdata = await resLogin.json()
    console.log(resdata);
    !resdata.Response ? errEmailPassword() : loginPass()

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

function loginPass() {
    getSession()
    location.href = '/'
}

function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const email = document.getElementById('email')
    if (input.match(validRegex)) {
        email.classList.remove('email-invalid')
        return true;
    } else {
        email.setAttribute('class', 'email-invalid')
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

function popup() {
    const form = document.getElementById("login-form")
    form.style.display = "inline-block"
}
async function getSession() {
    const response = await fetch("/getsession");
    const user = await response.json();


    localStorage.setItem("user",JSON.stringify(user.data))
    console.log(localStorage.getItem('user'));
}