const path = ["/login","/signup","/forgotPassword"]

if(path.includes(window.location.pathname)){
    document.getElementById("home").style.display = "none"
    document.getElementById("user").style.display = "none"
    document.getElementById("setting").style.display = "none"
    document.getElementById("about").style.display = "none"
    document.getElementById("contact").style.display = "none"
    document.getElementById("logout").style.display = "none"
    document.getElementById("login").style.display = "list-item"
}else{
    
    document.getElementById("login").style.display = "none"
}