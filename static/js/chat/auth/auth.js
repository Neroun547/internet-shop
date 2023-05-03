const chatAuthForm = document.getElementById("chat-auth-form");

chatAuthForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const api = await fetch("/chat/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: e.target[0].value,
            password: e.target[1].value
        })
    });
    const response = await api.json();

    if(api.ok) {

    } else {

    }
});
