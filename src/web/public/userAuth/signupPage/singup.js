function signup() {
    const Name = document.getElementById("name")
    const Email = document.getElementById("email")
    const Pass = document.getElementById("password")
    const Passcomfrim = document.getElementById("password-confrim")
    !fillup(Name, Email, Pass, Passcomfrim) ? errText('Plase fill all of info')
        : !ValidateEmail(Email.value) ? errText('Email invalid')
            : !samePassword(Pass, Passcomfrim) ? errText('Password not corret')
                : signupFecth(Name.value, Email.value, Pass.value);
}

async function signupFecth(Name, Email, Pass) {
    errText('')
    console.log(`${Name}${Email}${Pass}`);
    const data = {
        Name: Name,
        Email: Email,
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

    console.log(datasignup);
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

function fillup(Name, Email, Pass, Passcomfrim) {
    Name.value == '' ? Name.setAttribute('class', 'invalid')
        : Name.classList.remove('invalid')
    Email.value == '' ?
        Email.setAttribute('class', 'invalid')
        : Email.classList.remove('invalid')
    Pass.value == '' ?
        Pass.setAttribute('class', 'invalid')
        : Pass.classList.remove('invalid')
    Passcomfrim.value == '' ?
        Passcomfrim.setAttribute('class', 'invalid')
        : Passcomfrim.classList.remove('invalid')
    if (Name.value != '' && Email.value != '' && Pass.value != '' && Passcomfrim.value != '') {
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