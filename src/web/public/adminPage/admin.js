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