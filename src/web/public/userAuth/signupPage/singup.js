async function testredis() {
    const data = {
    }
    const test = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    console.log(test);
}

function signup() {
    const Name = document.getElementById("name")
    const Email = document.getElementById("email")
    const Pass = document.getElementById("password")
    const Passcomfrim = document.getElementById("password-confrim")
    !fillup(Name, Email, Pass, Passcomfrim) ? errText('Plase fill all of info')
        : !ValidateEmail(Email.value) ? errText('Email invalid')
            : signupFecth(Name.value, Email.value, Pass.value, Passcomfrim.value);
}

function signupFecth(Name, Email, Pass, Passcomfrim) {
    errText('')
    console.log(`${Name}${Email}${Pass}${Passcomfrim}`);//do it tomorow
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