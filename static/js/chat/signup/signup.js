import { showModal } from "../../common/show-modal.js";

const chatSignUpForm = document.getElementById("chat-signup-form");
const chatSignupPassword = document.getElementById("chat-signup-password");
const chatSignupUsername = document.getElementById("chat-signup-username")

chatSignUpForm.addEventListener("submit", async function (e) {
   e.preventDefault();

   const api = await fetch("/chat/signup", {
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
       window.location.href = "/chat/auth";
   } else {
       showModal(response.message);

       chatSignupPassword.value = "";
       chatSignupUsername.value = "";
   }
});
