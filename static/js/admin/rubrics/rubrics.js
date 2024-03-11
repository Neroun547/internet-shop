import { createRubricItem } from "./create-rubric-item.js";
import { questionModal } from "../../common/question-modal.js";
import { createEditRubricModal } from "./edit-rubric.modal.js";

const addRubricForm = document.getElementById("add-rubric-form");
const wrapperRubricsFormMessage = document.querySelector(".wrapper__add-rubrics-form-message");
const addTypeToRubricBtn = document.getElementById("add-type-to-rubric-btn");
const rubricTypeList = document.getElementById("rubric-types-list");
const rubricTypeInput = document.querySelector(".rubric-type-input");
const deleteRubricsButtons = document.querySelectorAll(".wrapper__rubrics-item-delete-btn");
const wrapperRubrics = document.querySelector(".wrapper__rubrics");
const editRubricsBtn = document.querySelectorAll(".wrapper__rubrics-item-edit-btn");

let newRubricTypes = [];

addRubricForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const response = await fetch("/admin/rubrics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: e.target[0].value,
      types: newRubricTypes
    })
  });
  const data = await response.json();

  wrapperRubricsFormMessage.style.display = "block";
  wrapperRubricsFormMessage.style.textAlign = "center";
  wrapperRubricsFormMessage.style.marginTop = "20px";

  if(response.ok) {
    wrapperRubricsFormMessage.style.border = "1px solid green";
    wrapperRubricsFormMessage.innerHTML = "Рубрику створено успішно";

    wrapperRubrics.appendChild(createRubricItem(e.target[0].value, newRubricTypes, data.id));
  } else {
    wrapperRubricsFormMessage.style.border = "1px solid red";
    wrapperRubricsFormMessage.innerHTML = "Помилка";
  }
});

addTypeToRubricBtn.addEventListener("click", function () {
  const rubricTypeInputValue = rubricTypeInput.value;
  newRubricTypes.push(rubricTypeInput.value);

  const listItem = document.createElement("li");
  listItem.innerHTML = rubricTypeInput.value;

  listItem.style.display = "flex";
  listItem.style.justifyContent = "space-between";
  listItem.style.alignItems = "center";

  const deleteItemFromListBtn = document.createElement("button");

  deleteItemFromListBtn.innerHTML = "&times;";
  deleteItemFromListBtn.style.backgroundColor = "transparent";
  deleteItemFromListBtn.style.border = "none";
  deleteItemFromListBtn.style.fontSize = "20px";

  deleteItemFromListBtn.addEventListener("click", function () {
    listItem.remove();

    newRubricTypes = newRubricTypes.filter(el => el !== rubricTypeInputValue);
  });
  listItem.appendChild(deleteItemFromListBtn);
  rubricTypeList.appendChild(listItem);

  rubricTypeInput.value = "";
});

for(let i = 0; i < deleteRubricsButtons.length; i++) {
  deleteRubricsButtons[i].addEventListener("click", async function () {
    async function removeRubric() {
      deleteRubricsButtons[i].parentElement.remove();

      await fetch("/admin/rubrics/" + deleteRubricsButtons[i].parentElement.getAttribute("id"), {
        method: "DELETE"
      });
    }
    questionModal("Ви дійсно хочете видалити цю рубрику ? Всі товари з цієї рубрики, замовлення буде видалено.", removeRubric, false);
  });
}

for(let i = 0; i < editRubricsBtn.length; i++) {
  editRubricsBtn[i].addEventListener("click", async function() {
    const id = editRubricsBtn[i].parentElement.parentElement.getAttribute("id");
    const rubricName = editRubricsBtn[i].parentElement.parentElement.querySelector(".wrapper__rubrics-item-name").innerHTML;

    const response = await fetch("/admin/rubrics/" + id + "/rubric-types");
    const rubricTypes = await response.json();

    createEditRubricModal(rubricTypes, rubricName, Number(id));
  });
}
