import { questionModal } from "../../common/question-modal.js";

const doneBtn = document.querySelector(".wrapper__order-done-btn");
const deleteBtn = document.querySelector(".wrapper__order-delete-btn");

const idOrderDone = doneBtn.getAttribute("data-idOrder");
const idOrderDelete = deleteBtn.getAttribute("data-idOrder");

doneBtn.addEventListener("click", async function () {

    if(idOrderDone) {
        await fetch("/admin/orders/" + idOrderDone, {
            method: "PATCH"
        });

        window.location.reload();
    }
});

deleteBtn.addEventListener("click", async function () {

    questionModal("Ви точно хочете видалити замовлення ?", action);

    async function action() {
        await fetch("/admin/orders/" + idOrderDelete, {
            method: "DELETE"
        });

        window.location.href = "/admin/orders";
    }
});
