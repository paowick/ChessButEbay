async function getVerifyCode() {
    const Email = document.getElementById("email")
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

function nextBtn() {


    //here 
    temp = true
    const email = document.getElementById('email')
    const verify = document.getElementById('verify')
    const send_btn = document.getElementById('send_btn')
    const pass = document.getElementById('password')
    const conPass = document.getElementById('password-confrim')
    const next_btn = document.getElementById('next')
    const submit_btn = document.getElementById('submit')

    if (temp) {
        email.style.display = "none"
        verify.style.display = "none"
        send_btn.style.display = "none"
        pass.style.display = "inline-block"
        conPass.style.display = "inline-block"
        next_btn.style.display = "none"
        submit_btn.style.display = "inline-block"
    }
}