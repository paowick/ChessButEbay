window.onload = async function profileMain() {
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

    h1_name.innerText = `User Name: ${user.name}`
    h1_flname.innerText = `name: ${user.fname}  ${user.lname}`
    h1_email.innerText = `Email: ${user.email}`
    h1_score.innerText = `Score: ${user.score}`

    name.appendChild(h1_name)
    email.appendChild(h1_email)
    score.appendChild(h1_score)
    flname.appendChild(h1_flname)

}


function Edit() {
    const popup = document.querySelector(".edit-pop")
    const user = JSON.parse(localStorage.getItem('user'))
    const profile = document.getElementById('profile-pic-pop')
    const form = document.getElementById("edit-form")
    if (popup.style.visibility == 'visible') {
        popup.style.visibility = 'hidden'
        form.reset()
    } else {
        popup.style.visibility = 'visible'


        profile.src = `/userimg/getimg?id=${user.id}`

        const name = document.getElementById("name-pop")
        const Fname = document.getElementById("Fname-pop")
        const Lname = document.getElementById("Lname-pop")
        name.value = `${user.name}`
        Fname.value = `${user.fname}`
        Lname.value = `${user.lname}`
    }
}

function save() {
    upload()
    const form = document.getElementById("edit-form")
    const popup = document.querySelector(".edit-pop")
    popup.style.visibility = 'hidden'
    form.reset()
}

async function upload() {
    const user = JSON.parse(localStorage.getItem('user'))
    const fileInput = document.querySelector('#up-but');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    const options = {
        method: 'POST',
        body: formData,
    };
    const img  = await fetch(`/userimg/chageimg?id=${user.id}`, options);

    const data = {
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
    if(img.status == 200 && editinfo.status == 200){
        getSession()
        window.location.reload()
    }
    if(img.status == 500 || editinfo.status ==500){
        alert(`Server error please try again later`)
    }
}

async function getSession() {
    const response = await fetch("/getsession");
    const user = await response.json();

    localStorage.removeItem("user")
    localStorage.setItem("user",JSON.stringify(user.data))
    console.log(localStorage.getItem('user'));
}


