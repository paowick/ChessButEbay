const path = ["/login", "/signup", "/forgotPassword"]

if (path.includes(window.location.pathname)) {

    document.getElementById("login-bar").style.display = "inline-block"
    document.getElementById("profile").style.display = "none"
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
    img.src = `/userimg/getimg?id=${await getSession()}`
    profile.appendChild(img)
}
async function getSession() {
    const response = await fetch("/getsession");
    const user = await response.json();

    console.log(user.data);
    return user.data.id
}