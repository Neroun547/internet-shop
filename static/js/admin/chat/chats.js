import { questionModal } from "../../common/question-modal.js";

const delChatsBtn = document.querySelectorAll(".wrapper__support-chats-item-delete-button");

for(let i = 0; i < delChatsBtn.length; i++) {
    delChatsBtn[i].addEventListener("click", async function () {
        questionModal("Ви точно хочете видалити цей чат ?", action);

        async function action() {
            await fetch(`/admin/support/${delChatsBtn[i].getAttribute("id")}`, {
                method: "DELETE"
            });

            delChatsBtn[i].parentElement.remove();
        }
    });
}
