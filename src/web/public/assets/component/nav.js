const path = ["/login", "/signup", "/forgotPassword"]

if (path.includes(window.location.pathname)) {

    document.getElementById("login-bar").style.display = "inline-block"
    document.getElementById("manu").style.display = "none"


} else {

    document.getElementById("login-bar").style.display = "none"
}

function logo() {

    window.location.href = "/"

}