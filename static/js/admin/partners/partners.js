import { questionModal } from "../../common/question-modal.js";

const createPartnerBtn = document.getElementById("create-partner");
const body = document.getElementsByTagName("body")[0];
const wrapperFilter = document.querySelector(".wrapper__filter");
const deletePartnerBtn = document.querySelectorAll(".delete-partner-btn");

for(let i = 0; i < deletePartnerBtn.length; i++) {
  deletePartnerBtn[i].addEventListener("click", async function () {
    async function deletePartner() {
      await fetch("/admin/partners/" + deletePartnerBtn[i].getAttribute("id"), {
        method: "DELETE"
      });

      deletePartnerBtn[i].parentElement.remove();
    }
    questionModal(
      "Ви дійсно хочете видалити партнера ?",
      deletePartner,
      false
      );
  });
}
createPartnerBtn.addEventListener("click", function () {
  wrapperFilter.style.opacity = "0.4";
  wrapperFilter.style.backgroundColor = "#000";

  createCreatePartnerModal();
});


function createCreatePartnerModal() {
  const wrapperModal = document.createElement("div");

  wrapperModal.classList.add("add-partner-modal");

  const wrapperTopBar = document.createElement("div");

  wrapperTopBar.style.display = "flex";
  wrapperTopBar.style.justifyContent = "space-between";

  const wrapperModalLogo = document.createElement("h2");
  wrapperModalLogo.innerHTML = "Додати нового партнера";

  wrapperTopBar.appendChild(wrapperModalLogo);

  const closeModalBtn = document.createElement("button");
  closeModalBtn.innerHTML = "&times;";

  closeModalBtn.style.backgroundColor = "transparent";
  closeModalBtn.style.fontSize = "20px";
  closeModalBtn.style.cursor = "pointer";

  closeModalBtn.addEventListener("click", function () {
    wrapperFilter.style.opacity = "1";
    wrapperFilter.style.backgroundColor = "#fff";

    wrapperModal.remove();

    window.location.reload();
  });
  wrapperTopBar.appendChild(closeModalBtn);

  wrapperModal.appendChild(wrapperTopBar);

  const addPartnerForm = document.createElement("form");

  const addPartnerFormNameInput = document.createElement("input");
  const addPartnerFormButton = document.createElement("button");
  const label = document.createElement("label");

  addPartnerFormNameInput.setAttribute("id", "add-partner-form-name-input");
  addPartnerFormNameInput.setAttribute("placeholder", "Ім'я партнера:");

  addPartnerFormNameInput.style.marginTop = "10px";

  label.setAttribute("for", "add-partner-form-name-input");
  label.innerText = "Ім'я партнера:";

  addPartnerFormButton.setAttribute("type", "submit");
  addPartnerFormButton.innerText = "Додати партнера";

  addPartnerForm.appendChild(label);
  addPartnerForm.appendChild(addPartnerFormNameInput);
  addPartnerForm.appendChild(addPartnerFormButton);

  wrapperModal.appendChild(addPartnerForm);

  addPartnerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const response = await fetch("/admin/partners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: e.target[0].value
      })
    });
    const data = await response.json();
    const existWrapperPassword = document.querySelector(".add-partner-modal-password") || document.querySelector(".add-partner-modal-password-error");

    if(existWrapperPassword) {
      if(!response.ok) {
        existWrapperPassword.classList.remove("add-partner-modal-password");
        existWrapperPassword.classList.add("add-partner-modal-password-error");

        existWrapperPassword.innerText = "Помилка: " + data.message;
      } else {
        existWrapperPassword.classList.remove("add-partner-modal-password");
        existWrapperPassword.classList.add("add-partner-modal-password");

        existWrapperPassword.innerText = "Пароль користувача: " + data.password;
      }
    } else {
      if(!response.ok) {
        const wrapperPassword = document.createElement("div");

        wrapperPassword.classList.add("add-partner-modal-password-error");

        wrapperPassword.innerText = "Помилка: " + data.message;

        wrapperModal.appendChild(wrapperPassword);
      } else {
        const wrapperPassword = document.createElement("div");

        wrapperPassword.classList.add("add-partner-modal-password");

        wrapperPassword.innerText = "Пароль користувача: " + data.password;

        wrapperModal.appendChild(wrapperPassword);
      }
    }
  });

  body.appendChild(wrapperModal);
}
