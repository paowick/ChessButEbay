getSession()
profileMain()
async function profileMain() {
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

    logsInit()

}
let logStage = null
async function logsInit() {

    const user = JSON.parse(localStorage.getItem('user'))
    const logsJson = await fetch('/getlogs')
    const logs = await logsJson.json()
    const logsCon = document.querySelector("#history-con")
    logs.forEach(element => {
        const box = document.createElement('div')
        const img = document.createElement('img')
        const h1 = document.createElement('h1')
        const h12 = document.createElement('h1')
        const button = document.createElement('button')

        if (user.id == element.WhiteID) {
            img.src = `../assets/component/svg/whiteIcon.svg`
        }
        if (user.id == element.BlackID) {
            img.src = `../assets/component/svg/blackIcon.svg`
        }


        button.innerHTML = "View"
        button.setAttribute('value', element.NotationID)
        button.setAttribute('id', 'logView')
        h1.innerHTML = `${result(element)}`
        h1.setAttribute('result', '')
        h12.innerHTML = `${secondsToMinutes(calculateTimeDifference(element.StartDate, element.EndDate))}`
        box.appendChild(img)
        box.appendChild(h1)
        box.appendChild(h12)
        box.appendChild(button)
        logsCon.appendChild(box)



    });
    document.querySelectorAll("#logView").forEach(button => {
        button.addEventListener("click", async (e) => {
            document.querySelector("#notation-pop").style.visibility = "visible"
            document.querySelector("#notation-pop").setAttribute("show", "")
            document.querySelector("#changePassword-pop").style.display = "none"
            document.querySelector("#edit-pop").style.display = "none"
            console.log(e.target.value);
            if(e.target.value == logStage){return}
            logStage = e.target.value
            const dataJson = await fetch(`/getnotation?id=${e.target.value}`)
            const data = await dataJson.json()
            logInit(data);
        })
    });
}

function logInit(log) {
    const logbox = document.querySelector("#notation-con")
    logbox.innerHTML = ''
    log.forEach((e, index) => {
        const logtext = document.createElement("div")
        const indexShow = document.createElement("div")
        const W = document.createElement("div")
        const B = document.createElement("div")
        indexShow.innerHTML = index + 1
        W.innerHTML = e.W
        B.innerHTML = e.B
        logtext.appendChild(indexShow)
        logtext.appendChild(W)
        logtext.appendChild(B)
        logbox.appendChild(logtext)
        if (index % 2 == 0) {
            logtext.setAttribute("highlight", "")
        }
    })
}


function result(data) {
    const user = JSON.parse(localStorage.getItem('user'))
    let result
    if (data.WinID == user.id) {
        result = 'Win'
    } else {
        result = "Lose"
    }
    return result
}
function calculateTimeDifference(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate) || isNaN(endDate)) {
        return "Invalid date format";
    }

    const timeDifference = endDate - startDate; // This will give the time difference in milliseconds

    // You can convert the time difference to seconds, minutes, or any other format you need.
    const secondsDifference = timeDifference / 1000;

    return secondsDifference;
}

function secondsToMinutes(seconds) {
    if (typeof seconds !== 'number' || seconds < 0) {
        return "Invalid input. Please provide a non-negative number of seconds.";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const minuteString = minutes === 1 ? "min" : "min";
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')} ${minuteString}`;

    return formattedTime;
}




document.querySelectorAll('#close').forEach(button => {
    button.addEventListener("click", e => {
        document.querySelector("#notation-pop").style.visibility = "hidden"
        document.querySelector("#notation-pop").removeAttribute("show")
        document.querySelector("#changePassword-pop").style.display = "none"
        document.querySelector("#edit-pop").style.display = "none"
    })
})


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

document.querySelector("#Edit").addEventListener("click", () => {
    const popup = document.querySelector(".edit-pop")
    const user = JSON.parse(localStorage.getItem('user'))
    const profile = document.getElementById('profile-pic-pop')
    const form = document.getElementById("edit-form")
    const popupPw = document.querySelector(".changePassword-pop")
    popup.style.display = 'flex'
    popupPw.style.display = 'none'
    
        document.querySelector("#notation-pop").style.visibility = "hidden"
        document.querySelector("#notation-pop").removeAttribute("show")
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
document.querySelector("#ChangePassword").addEventListener('click', () => {
    const popupPw = document.querySelector(".changePassword-pop")
    const popup = document.querySelector(".edit-pop")
    popup.style.display = 'none'
    popupPw.style.display = 'flex'

        document.querySelector("#notation-pop").style.visibility = "hidden"
        document.querySelector("#notation-pop").removeAttribute("show")

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
        id: user.id,
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