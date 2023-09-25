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
    console.log(window.location.pathname);
    if (window.location.pathname == "/Game/") {
        return
    }
    if (window.location.pathname == "/admin") {
        return
    }
    navigator()
}

function navigator() {
    $("main").load("../../../lobby/lobby.html")
        navlight("home")
}
document.querySelector('#user').addEventListener('click', () => {
    if (window.location.pathname == "/Game/" ||
        window.location.pathname == "/admin") {
        window.location = "/"
    }
    $(function () {
        $("main").load("../../../userPage/user.html")
        navlight("user")
    })
})
document.querySelector('#about').addEventListener('click', () => {
    if (window.location.pathname == "/Game/" ||
        window.location.pathname == "/admin") {
        window.location = "/"
    }
    $(function () {
        $("main").load("../../../about/about.html")
        navlight("about")
    })
})
document.querySelector('#home').addEventListener('click', () => {
    if (window.location.pathname == "/Game/" ||
        window.location.pathname == "/admin") {
        window.location = "/"
    }
    $(function () {
        $("main").load("../../../lobby/lobby.html")
        navlight("home")
    })
    console.log(performance.getEntries() .filter(e => e.entryType === 'resource').map(e => e.name));
    // try this
})
document.querySelector('#logout').addEventListener('click', () => {
    window.location = "/clear"
})

function navlight(id) {

    document.querySelectorAll(".nav-manu").forEach(element => {
        if (element.id == id) {
            element.style.color = "yellow"
        } else {
            element.style.color = "white"
        }
    });
}