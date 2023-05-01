const chatSignUpForm = document.getElementById("chat-signup-form");

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
       // TODO ...
   }
});
