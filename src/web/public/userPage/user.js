async function getSession() {
    const response = await fetch("/getsession");
    const user = await response.json();

    console.log(user.data);
}
getSession()

