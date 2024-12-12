import { showModal } from "../../common/show-modal.js";

const authForm = document.querySelector(".auth__form");

authForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if(e.target[0].value.trim().length && e.target[0].value.trim().length) {
        const api = await fetch("/admin/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: e.target[0].value,
                password: e.target[1].value
            })
        });
        const response = await api.json();

        if(!api.ok) {
            showModal(response.message);
        } else {
            window.location.href = "/admin/orders";
        }
    }
});
