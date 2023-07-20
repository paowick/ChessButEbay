const path = ["/login", "/signup", "/forgotPassword"]
if (path.includes(window.location.pathname)) {
    document.getElementById("login-bar").style.display = "inline-block"
    document.getElementById("pro-con").style.display = "none"
    document.getElementById("manu").style.display = "none"
} else {
    profile()
    document.getElementById("login-bar").style.display = "none"
}
function logo() {
    window.location.href = "/"
}
async function profile() {
    const profile = document.getElementById('profile')
    const img = document.createElement("img");
    const user = JSON.parse(localStorage.getItem('user'))
    img.src = `/userimg/getimg?id=${user.id}`
    profile.appendChild(img)
    const name = document.getElementById("name")
    const h1_name = document.createElement("h1");
    h1_name.innerText = user.name
    name.appendChild(h1_name)
}