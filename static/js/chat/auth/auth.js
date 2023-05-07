import { showModal } from "../../common/show-modal.js";

const chatAuthForm = document.getElementById("chat-auth-form");
const chatAuthPassword = document.getElementById("chat-auth-password");
const chatAuthUsername = document.getElementById("chat-auth-username");

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
        window.location.href = "/chat";
    } else {
        showModal(response.message);

        chatAuthUsername.value = "";
        chatAuthPassword.value = "";
    }
});
