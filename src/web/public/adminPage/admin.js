let userList = []
window.onload = async function profileMain() {
    const allUserJson = await fetch("/admin/getalluser")
    const allUser = await allUserJson.json()
    userList = allUser
    fillUser(userList)
}
function fillUser(allUser) {
    document.querySelector("#user-list").innerHTML = ''
    allUser.forEach((element,index) => {
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
        button.addEventListener("click",(e)=>{
            const customValue = e.target.getAttribute("value"); 
            profileView(parseInt(customValue))
        })
    });
}

function profileView(index) {
    document.querySelector("#user-con").style.display = "flex"
    const user = userList[index]
    console.log(user);
    
    const profile = document.getElementById('profile-pic')
    profile.src = `/userimg/getimg?id=${user.Id}`
    
    const name = document.getElementById("name-main")
    const flname = document.getElementById("FLname")
    const email = document.getElementById("email")
    const score = document.getElementById("score")
    
    const h1_name = document.createElement("h1");
    const h1_flname = document.createElement("h1");
    const h1_email = document.createElement("h1");
    const h1_score = document.createElement("h1");
    if (user.Fname == null) { user.Fname = "" }
    if (user.Lname == null) { user.Lname = "" }
    h1_name.innerText = `User Name: ${user.Name}`
    h1_flname.innerText = `name: ${user.Fname}  ${user.Lname}`
    h1_email.innerText = `Email: ${user.Email}`
    h1_score.innerText = `Score: ${user.Score}`
    
    name.innerHTML = ""
    email.innerHTML = ""
    score.innerHTML = ""
    flname.innerHTML = ""
    name.appendChild(h1_name)
    email.appendChild(h1_email)
    score.appendChild(h1_score)
    flname.appendChild(h1_flname)
}