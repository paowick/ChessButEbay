profileMain()
function profileMain() {
    const profile = document.getElementById('profile-pic')
    const user = JSON.parse(localStorage.getItem('user'))
    profile.src = `/userimg/getimg?id=${user.id}`

    const name = document.getElementById("name-main")
    const flname = document.getElementById("FLname")
    const email = document.getElementById("email")
    const score = document.getElementById("score")

    const h1_name = document.createElement("h1");
    const h1_flname = document.createElement("h1");
    const h1_email = document.createElement("h1");
    const h1_score = document.createElement("h1");
    if (user.fname == null) { user.fname = "" }
    if (user.lname == null) { user.lname = "" }
    h1_name.innerText = `User Name: ${user.name}`
    h1_flname.innerText = `name: ${user.fname}  ${user.lname}`
    h1_email.innerText = `Email: ${user.email}`
    h1_score.innerText = `Score: ${user.score}`

    name.appendChild(h1_name)
    email.appendChild(h1_email)
    score.appendChild(h1_score)
    flname.appendChild(h1_flname)
}

document.querySelector("#changePw").addEventListener("click", () => {
    const oldPw = document.getElementById("oldPw-pop")
    const newPw = document.getElementById("newPw-pop")
    const conPw = document.getElementById("conPw-pop")
    if (!fillup(oldPw, newPw, conPw)) return errText('Plase fill all of info')
    if (!ValidatePassword(newPw.value)) return errText('Password must containat least one letter and must be at least 8 characters')
    if (!checkPassword(oldPw, newPw, conPw)) return 0
    changePasswordFetch(newPw.value)
})
async function changePasswordFetch(password) {
    const data = {
        password: password
    }
    const raw = await fetch(`/editpassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    if (raw.status == 200) {
        getSession()
        window.location.reload()
    }
    if (raw.status == 500) {
        errText(`Server error please try again later`)
    }
}

// Listen for changes to the input element
document.getElementById('up-but').addEventListener('change', function () {
    Array.from(this.files).splice(1, 1)
    // If a file is selected
    if (this.files && this.files[0]) {
        // Create a FileReader object
        const reader = new FileReader();

        // When the file is loaded
        reader.addEventListener('load', function () {
            // Set the preview image source to the loaded data URL
            document.getElementById('profile-pic-pop').src = reader.result;
        });
        // Read the file as a data URL
        reader.readAsDataURL(this.files[0]);
    }
});
document.querySelector('#editclose').addEventListener('click', () => {
    const popup = document.querySelector(".edit-pop")
    popup.style.display = 'none'
})
document.querySelector("#Edit").addEventListener("click", () => {
    const popup = document.querySelector(".edit-pop")
    const user = JSON.parse(localStorage.getItem('user'))
    const profile = document.getElementById('profile-pic-pop')
    const form = document.getElementById("edit-form")
    const popupPw = document.querySelector(".changePassword-pop")
    popup.style.display = 'flex'
    popupPw.style.display = 'none'
    profile.src = `/userimg/getimg?id=${user.id}`
    form.reset()
    const name = document.getElementById("name-pop")
    const Fname = document.getElementById("Fname-pop")
    const Lname = document.getElementById("Lname-pop")
    if (user.fname == null) { user.fname = "" }
    if (user.lname == null) { user.lname = "" }
    name.value = `${user.name}`
    Fname.value = `${user.fname}`
    Lname.value = `${user.lname}`
})
document.querySelector("#changepassclose").addEventListener('click', () => {
    const popupPw = document.querySelector(".changePassword-pop")
    popupPw.style.display = 'none'
})
document.querySelector("#ChangePassword").addEventListener('click', () => {
    const popupPw = document.querySelector(".changePassword-pop")
    const popup = document.querySelector(".edit-pop")
    popup.style.display = 'none'
    popupPw.style.display = 'flex'

})
document.querySelector("#save").addEventListener("click", () => {
    upload()
    const form = document.getElementById("edit-form")
    const popup = document.querySelector(".edit-pop")
    const popupPw = document.querySelector(".changePassword-pop")
    popup.style.display = 'none'
    popupPw.style.display = 'none'
    form.reset()
})



async function upload() {
    const user = JSON.parse(localStorage.getItem('user'))
    const fileInput = document.querySelector('#up-but');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    const options = {
        method: 'POST',
        body: formData,
    };
    const img = await fetch(`/userimg/chageimg?id=${user.id}`, options);

    const data = {
        id:user.id,
        Username: document.getElementById('name-pop').value,
        Fname: document.getElementById('Fname-pop').value,
        Lname: document.getElementById('Lname-pop').value
    }
    const editinfo = await fetch(`/editinfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    if (img.status == 200 && editinfo.status == 200) {
        getSession()
        window.location.reload()
    }
    if (img.status == 500 || editinfo.status == 500) {
        alert(`Server error please try again later`)
    }
}

async function getSession() {
    const response = await fetch("/getsession");
    const user = await response.json();

    localStorage.removeItem("user")
    localStorage.setItem("user", JSON.stringify(user.data))
    console.log(localStorage.getItem('user'));
}


function ValidatePassword(input) {
    var validRegex = /[a-z]/i;
    const password = document.getElementById('newPw-pop')
    if (input.match(validRegex) && input.length >= 6) {
        password.classList.remove('invalid')
        return true;
    } else {
        password.setAttribute('class', 'invalid')
        return false
    }

}

function fillup(oldPw, newPw, conPw) {
    oldPw.value == '' ? oldPw.setAttribute('class', 'invalid')
        : oldPw.classList.remove('invalid')
    newPw.value == '' ? newPw.setAttribute('class', 'invalid')
        : newPw.classList.remove('invalid')
    conPw.value == '' ? conPw.setAttribute('class', 'invalid')
        : conPw.classList.remove('invalid')
    if (oldPw.value != '' && newPw.value != '' && conPw.value != '') {
        return true
    }
    return false
}

function checkPassword(oldPw, newPw, conPw) {
    const user = JSON.parse(localStorage.getItem('user'))
    if (oldPw.value != user.password) {
        oldPw.setAttribute('class', 'invalid')
        errText('Old Password invalid')
        return false
    }
    else if (newPw.value != conPw.value) {
        newPw.setAttribute('class', 'invalid')
        conPw.setAttribute('class', 'invalid')
        errText('Password do not match')
        return false
    }
    newPw.classList.remove('invalid')
    conPw.classList.remove('invalid')
    errText('')
    return true

}



function errText(Text) {
    const form = document.getElementById('err')
    form.innerHTML = ''
    form.innerHTML += `<h7 style="color: red;" class="err-text">${Text}<h7>`
}