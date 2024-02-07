import { showModal } from "../../common/show-modal.js";

const generateNewPasswordBtn = document.getElementById("generate-new-password-btn");
const newNameInput = document.getElementById("partner-name-input");
const saveNewPartnerName = document.getElementById("save-new-partner-name");
const partnerSettingsLogo = document.querySelector(".partner-settings-logo");
const userId = partnerSettingsLogo.getAttribute("id");

saveNewPartnerName.addEventListener("click", async function () {
  await fetch("/admin/partners/new-name/" + userId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: newNameInput.value
    })
  });
  partnerSettingsLogo.getElementsByTagName("span")[0].innerText = newNameInput.value;
});

generateNewPasswordBtn.addEventListener("click", async function () {
  const response = await fetch("/admin/partners/generate-new-password/" + userId, {
    method: "PATCH"
  });
  const data = await response.json();

  showModal("Новий пароль: " + data.password);
});



