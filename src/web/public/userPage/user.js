window.onload = async function profileMain() {
    const profile = document.getElementById('profile-main')
    const img = document.createElement("img");
    const user = JSON.parse(localStorage.getItem('user'))
    img.src = `/userimg/getimg?id=${user.id}`
    profile.appendChild(img)
    
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const score = document.getElementById("score")
    
    const h1_name = document.createElement("h1");
    const h1_email = document.createElement("h1");
    const h1_score = document.createElement("h1");

    h1_name.innerText = `User Name: ${user.name}` 
    h1_email.innerText = `Email: ${user.email}`
    h1_score.innerText = `Score: ${user.score}`

    name.appendChild(h1_name)
    email.appendChild(h1_email)
    score.appendChild(h1_score)

}

