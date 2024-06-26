const wrapperChat = document.querySelector(".wrapper__chat");
const wrapperChatMessages = document.querySelector(".wrapper__chat-messages");
const sendMessageForm = document.getElementById("send-message-form");
const loadMoreMessagesBtn = document.getElementById("load-more-messages");

let idLastMessage = Number(wrapperChat.getAttribute("data-idLastMessage"));
let skipLoadMore = 10;


sendMessageForm.addEventListener("submit", async function (e) {
   e.preventDefault();

   if(e.target[0].value.trim().length) {

      await fetch("/support/save-message", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            message: e.target[0].value
         })
      });
      wrapperChatMessages.appendChild(createMessage(e.target[0].value, true, new Date()));

      skipLoadMore += 1;

      e.target[0].value = "";
   }
});

if(loadMoreMessagesBtn) {
   loadMoreMessagesBtn.addEventListener("click", async function () {

      if (idLastMessage !== -1) {
         const api = await fetch(`/support/messages?take=10&skip=${skipLoadMore}`);
         const response = (await api.json()).sort((a, b) => b.id - a.id);

         skipLoadMore += response.length;

         for (let i = 0; i < response.length; i++) {
            wrapperChatMessages.insertBefore(createMessage(response[i].message, !response[i].admin, response[i].date), wrapperChatMessages.childNodes[0]);
         }
         wrapperChat.style.height = "auto";

         if(response.length < 10) {
            loadMoreMessagesBtn.remove();
         }
      }
   });
}

function createMessage(message, sender, date) {
   const wrapperMessage = document.createElement("div");

    if(sender) {
       wrapperMessage.classList.add("wrapper__chat-messages-message-sender");
    } else {
       wrapperMessage.classList.add("wrapper__chat-messages-message");
    }
    const wrapperMessageDate = document.createElement("span");
    wrapperMessageDate.classList.add("wrapper__chat-messages-message-date");

    if(date && typeof date !== "string") {
       wrapperMessageDate.innerText = parseDateForMessage(date);
    }
    if(date && typeof date === "string") {
       wrapperMessageDate.innerText = date;
    }
    const wrapperMessageText = document.createElement("span");
    wrapperMessageDate.classList.add("wrapper__chat-messages-message-text");
    wrapperMessageText.innerText = message;

    wrapperMessage.appendChild(wrapperMessageText);
    wrapperMessage.appendChild(wrapperMessageDate);

    return wrapperMessage;
}

// long polling
setInterval(async () => {
   const api = await fetch(`/support/polling?take=10&idLastMessage=${idLastMessage}`);
   const response = await api.json();

   if(response.length) {
      idLastMessage = response[response.length - 1].id;
   }
   skipLoadMore += response.length;

   for(let i = 0; i < response.length; i++) {
      wrapperChatMessages.appendChild(createMessage(response[i].message, false, response[i].date));
   }
}, 3000);

function parseDateForMessage(date) {
   return date.toISOString().replace("T", " ").substring(0, 19);
}
