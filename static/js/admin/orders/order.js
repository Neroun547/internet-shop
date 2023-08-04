import { questionModal } from "../../common/question-modal.js";

const doneBtn = document.querySelector(".wrapper__order-done-btn");
const deleteBtn = document.querySelector(".wrapper__order-delete-btn");
const returnedBtn = document.querySelector(".wrapper__order-return-btn");
const inProcessBtn = document.querySelector(".wrapper__order-in-process-btn");
const deleteStatusBtn = document.querySelector(".wrapper__order-item-delete-status-btn");
const showAdminNoteBtn = document.querySelector(".wrapper__order-admin-note-btn");
const adminNoteForm = document.querySelector(".wrapper__order-admin-note-form");

if(doneBtn) {
    doneBtn.addEventListener("click", async function () {
        const idOrderDone = doneBtn.getAttribute("data-idOrder");

        if (idOrderDone) {
            await fetch("/admin/orders/change-status/" + idOrderDone, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "completed"
                })
            });

            window.location.href = "/admin/orders";
        }
    });
}

if(deleteBtn) {
    deleteBtn.addEventListener("click", async function () {
        const idDeleteOrder = deleteBtn.getAttribute("data-idOrder");

        questionModal("Ви точно хочете видалити замовлення ?", action);

        async function action() {
            await fetch("/admin/orders/" + idDeleteOrder, {
                method: "DELETE"
            });

            window.location.href = "/admin/orders";
        }
    });
}

if(returnedBtn) {
    returnedBtn.addEventListener("click", async function () {
        const idReturnedOrder = returnedBtn.getAttribute("data-idOrder");

        if (idReturnedOrder) {
            await fetch("/admin/orders/change-status/" + idReturnedOrder, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "returned"
                })
            });

            window.location.href = "/admin/orders";
        }
    });
}

if(inProcessBtn) {
    inProcessBtn.addEventListener("click", async function () {
        const idProcessOrder = inProcessBtn.getAttribute("data-idOrder");

        if (idProcessOrder) {
            await fetch("/admin/orders/change-status/" + idProcessOrder, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "in_process"
                })
            });

            window.location.href = "/admin/orders";
        }
    });
}

if(deleteStatusBtn) {
    deleteStatusBtn.addEventListener("click", function () {
        const idDeleteStatusOrder = deleteStatusBtn.getAttribute("data-idOrder");

        questionModal("Ви точно хочете скинути статус замовлення ?", action);

        async function action() {
            await fetch("/admin/orders/status/" + idDeleteStatusOrder, {
                method: "DELETE"
            });

            window.location.href = "/admin/orders";
        }
    });
}

showAdminNoteBtn.addEventListener("click", function () {
    if(!adminNoteForm.style.display || adminNoteForm.style.display === "none") {
        adminNoteForm.style.display = "block";
    } else {
        adminNoteForm.style.display = "none";
    }
});
