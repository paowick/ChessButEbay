async function getVerifyCode() {
    const Email = document.getElementById("email")
    const next_btn = document.getElementById('next')
    next_btn.style.display = "inline-block"
    const data = {
        key: Email.value
    }
    const rescode = await fetch('/auth/getVerifyCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (rescode.status == 200) {
        return alert(`send verification code to ${Email.value}`)
    }
    return errText("Server error please try again later")
}

function stageOfbtn() {
    const email = document.getElementById('email')
    const sendbtn = document.getElementById("send_btn")
    if (!ValidateEmail(email.value)) {
        return errText("Email invalid plase check your email")
    } else {
        errText('')
        sendbtn.disabled = true
        sendbtn.classList.add("send_btn_tog")
        email.classList.remove('invalid')
        setTimeout(() => {
            sendbtn.classList.remove("send_btn_tog")
            sendbtn.disabled = false
        }, 60000);
        getVerifyCode()
    }
}

function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const email = document.getElementById('email')
    if (input.match(validRegex)) {
        email.classList.remove('invalid')
        return true;
    } else {
        email.setAttribute('class', 'invalid')
        return false
    }

}

function errText(Text) {
    const form = document.getElementById('err')
    form.innerHTML = ''
    form.innerHTML += `<h7 style="color: red;" class="err-text">${Text}<h7>`
}

function samePassword(Pass1, Pass2) {
    if (Pass1.value != Pass2.value) {
        Pass1.setAttribute('class', 'invalid')
        Pass2.setAttribute('class', 'invalid')
        return false
    }
    Pass1.classList.remove('invalid')
    Pass2.classList.remove('invalid')
    errText("")
    return true
}

async function nextBtn() {
    const email = document.getElementById('email')
    const verify = document.getElementById('verify')
    const send_btn = document.getElementById('send_btn')
    const pass = document.getElementById('password')
    const conPass = document.getElementById('password-confrim')
    const next_btn = document.getElementById('next')
    const submit_btn = document.getElementById('submit')

    const data = {
        email: email.value,
        code: verify.value
    }
    const resCodeCheck = await fetch(`/auth/codecheck`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (resCodeCheck.status == 406) { return errText("check your code on email") }
    if (resCodeCheck.status == 500) { return errText("Server error please try again later") }
    errText('')
    if (resCodeCheck.status == 200) {
        email.style.display = "none"
        verify.style.display = "none"
        send_btn.style.display = "none"
        pass.style.display = "inline-block"
        conPass.style.display = "inline-block"
        next_btn.style.display = "none"
        submit_btn.style.display = "inline-block"
    }
}

async function subMit() {

    const email = document.getElementById('email')
    const verify = document.getElementById('verify')
    const pass = document.getElementById('password')
    const passConfrim = document.getElementById('password-confrim')
    if (!samePassword(password, passConfrim)) { return errText("it,s not the same password") }

    const data = {
        email: email.value,
        code: verify.value,
        password: pass.value
    }
    const resetPassword = await fetch(`/auth/resetpassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })


    if (resetPassword.status == 200) {
        alert("reset password sucess")
        location.href = '/login'
    }
    if (resetPassword.status == 400) return errText('Password must containat least one letter and must be at least 8 characters')
    if (resetPassword.status == 500) { return errText("Server error please try again later") }
}