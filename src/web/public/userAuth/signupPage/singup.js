function signup() {
    const Name = document.getElementById("name")
    const Email = document.getElementById("email")
    const VerifyCode = document.getElementById("verify")
    const Pass = document.getElementById("password")
    const Passcomfrim = document.getElementById("password-confrim")
    !fillup(Name, Email, VerifyCode, Pass, Passcomfrim) ? errText('Plase fill all of info')
        : !ValidateEmail(Email.value) ? errText('Email invalid')
            : !samePassword(Pass, Passcomfrim) ? errText('Password do not match')
                : signupFecth(Name.value, Email.value, VerifyCode.value, Pass.value);
}

async function getVerifyCode() {
    const rescode = await fetch('/auth/getVerifyCode', {
        method: 'POST',
    })
    if (rescode.status == 200) {
        return alert(`send verification code to ${email.value}`)
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


async function signupFecth(Name, Email, VerifyCode, Pass) {
    errText('')
    const data = {
        Name: Name,
        Email: Email,
        VerifyCode: VerifyCode,
        Pass: Pass
    }

    const ressignup = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const datasignup = await ressignup.json()
    !datasignup.Response ? errText(datasignup.Message) : pass()
}


function pass() {
    alert("sign up sucess")
    location.href = '/login'
}

function samePassword(Pass1, Pass2) {
    if (Pass1.value != Pass2.value) {
        Pass1.setAttribute('class', 'invalid')
        Pass2.setAttribute('class', 'invalid')
        return false
    }
    Pass1.classList.remove('invalid')
    Pass2.classList.remove('invalid')
    return true
}

function fillup(Name, Email, VerifyCode, Pass, Passcomfrim) {
    Name.value == '' ? Name.setAttribute('class', 'invalid')
        : Name.classList.remove('invalid')
    Email.value == '' ? Email.setAttribute('class', 'invalid')
        : Email.classList.remove('invalid')
    VerifyCode.value == '' ? VerifyCode.setAttribute('class', 'invalid')
        : VerifyCode.classList.remove('invalid')
    Pass.value == '' ? Pass.setAttribute('class', 'invalid')
        : Pass.classList.remove('invalid')
    Passcomfrim.value == '' ? Passcomfrim.setAttribute('class', 'invalid')
        : Passcomfrim.classList.remove('invalid')
    if (Name.value != '' && Email.value != '' && VerifyCode.value != '' && Pass.value != '' && Passcomfrim.value != '') {
        return true
    }
    return false
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

function back() {
    location.href = '/login'
}

function errText(Text) {
    const form = document.getElementById('err')
    form.innerHTML = ''
    form.innerHTML += `<h7 style="color: red;" class="err-text">${Text}<h7>`
}