let currenView = null
let userList = []
window.onload = async function profileMain() {
    const allUserJson = await fetch("/admin/getalluser")
    const allUser = await allUserJson.json()
    userList = allUser
    fillUser(userList)
}

document.querySelector('#del-butt').addEventListener('click', () => {
    document.querySelector("#del-butt-conf").disabled = true;
    const del = document.querySelector("#del-pop")
    const title = document.querySelector("#del-ti")
    const text = document.querySelector("#del-te")
    del.style.display = 'flex'
    title.innerHTML = `Delete ${currenView.Name}`
    text.innerHTML = `To confirm, type "${currenView.Email}" in the box below`
})

document.querySelector("#del-in").addEventListener("input", (e) => {
    console.log("a;ksdm");
    if (e.target.value == currenView.Email) {
        document.querySelector("#del-butt-conf").disabled = false;
    } else {
        document.querySelector("#del-butt-conf").disabled = true;
    }
})

document.querySelectorAll("#close").forEach(close => {
    close.addEventListener("click", () => {
        document.querySelector("#del-pop").style.display = 'none'
        document.querySelector("#edit-pop").style.display = 'none'
    })
})

document.querySelector("#del-butt-conf").addEventListener('click',async () => {
    // INSERT INTO `User` (`Id`, `Email`, `Password`, `Name`, `Fname`, `Lname`, `Score`, `Admin`) VALUES (NULL, 'uti1@mail.com', 'qwe123', 'uti', NULL, NULL, '1000', 0x00);
    const res = await fetch('/deleteuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currenView)
    })
    if (res.status == 200) {
        window.location.reload()
    }
    if (res.status == 500) {
        errText(`Server error please try again later`)
    }
})

document.querySelector("#save").addEventListener("click", () => {
    upload()
    const form = document.getElementById("edit-form")
    const popup = document.querySelector("#edit-pop")
    popup.style.display = 'none'
    form.reset()
})

async function upload() {
    const fileInput = document.querySelector('#up-but');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    const options = {
        method: 'POST',
        body: formData,
    };
    const img = await fetch(`/userimg/chageimg?id=${currenView.Id}`, options);

    const data = {
        id: currenView.Id,
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
document.querySelector('#edit-butt').addEventListener('click', () => {
    const popup = document.querySelector("#edit-pop")
    const profile = document.getElementById('profile-pic-pop')
    const form = document.getElementById("edit-form")
    popup.style.display = 'flex'
    profile.src = `/userimg/getimg?id=${currenView.Id}`
    form.reset()
    const name = document.getElementById("name-pop")
    const Fname = document.getElementById("Fname-pop")
    const Lname = document.getElementById("Lname-pop")
    if (currenView.Fname == null) { currenView.Fname = "" }
    if (currenView.Lname == null) { currenView.Lname = "" }
    name.value = `${currenView.Name}`
    Fname.value = `${currenView.Fname}`
    Lname.value = `${currenView.Lname}`
})

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
function fillUser(allUser) {
    document.querySelector("#user-list").innerHTML = ''
    allUser.forEach((element, index) => {
        const html = `
        <div>
        <div>USERNAME : ${element.Name}</div>
        <button id="view" value="${index}">View</button>
        </div>
        `
        const doc = new DOMParser().parseFromString(html, "text/xml").documentElement
        document.querySelector("#user-list").appendChild(doc)
    });
    document.querySelectorAll("#view").forEach(button => {
        button.addEventListener("click", (e) => {
            const customValue = e.target.getAttribute("value");
            profileView(parseInt(customValue))
        })
    });
}


function profileView(index) {
    document.querySelector("#user-con").style.display = "flex"
    currenView = userList[index]
    const user = userList[index]

    const profile = document.getElementById('profile-pic')
    profile.src = `/userimg/getimg?id=${user.Id}`

    const name = document.getElementById("name-main")
    const flname = document.getElementById("FLname")
    const email = document.getElementById("email")
    const score = document.getElementById("score")
    const status = document.getElementById('status')

    const h1_name = document.createElement("h1");
    const h1_flname = document.createElement("h1");
    const h1_email = document.createElement("h1");
    const h1_score = document.createElement("h1");
    const h1_status = document.createElement('h1')
    if (user.Fname == null) { user.Fname = "" }
    if (user.Lname == null) { user.Lname = "" }
    if (user.Ban_Status == 1) { 
        h1_status.innerHTML = `Status : Ban`
        h1_status.style.color = "red"
    }else{
        h1_status.innerHTML = `Status : Normal`
        h1_status.style.color = "white"
    }
    h1_name.innerText = `User Name: ${user.Name}`
    h1_flname.innerText = `name: ${user.Fname}  ${user.Lname}`
    h1_email.innerText = `Email: ${user.Email}`
    h1_score.innerText = `Score: ${user.Score}`

    name.innerHTML = ""
    email.innerHTML = ""
    score.innerHTML = ""
    flname.innerHTML = ""
    status.innerHTML = ""
    name.appendChild(h1_name)
    email.appendChild(h1_email)
    score.appendChild(h1_score)
    flname.appendChild(h1_flname)
    status.appendChild(h1_status)
}
