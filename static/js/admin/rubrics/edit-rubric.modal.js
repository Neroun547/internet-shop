function createEditRubricModal(rubricTypes, rubricName, rubricId) {
  let rubricTypesList = [...rubricTypes.map(el => ({ ...el, idItem: Math.floor(Math.random() * 100000) }))];

  const wrapperRubricTypes = document.createElement("div");
  wrapperRubricTypes.style.display = "flex";
  wrapperRubricTypes.style.flexDirection = "column";

  function createRubricTypeInput(value, id, idItem) {
    const wrapperRubricItem = document.createElement("div");
    wrapperRubricItem.style.display = "flex";
    wrapperRubricItem.style.justifyContent = "space-between";

    if(id) {
      wrapperRubricItem.setAttribute("id", id);
    }
    wrapperRubricItem.setAttribute("data-id-item", idItem);

    const input = document.createElement("input");

    input.value = value;
    input.style.marginTop = "10px";
    input.style.marginBottom = "10px";

    const deleteRubricTypeBtn = document.createElement("button");
    deleteRubricTypeBtn.innerText = "Видалити";
    deleteRubricTypeBtn.style.height = "30px";
    deleteRubricTypeBtn.style.width = "100px";
    deleteRubricTypeBtn.style.backgroundColor = "#e54724";
    deleteRubricTypeBtn.style.color = "#fff";
    deleteRubricTypeBtn.style.border = "none";
    deleteRubricTypeBtn.style.borderRadius = "5px";
    deleteRubricTypeBtn.style.fontSize = "14px";
    deleteRubricTypeBtn.style.cursor = "pointer";

    deleteRubricTypeBtn.addEventListener("click", function () {
      for(let i = 0; i < wrapperRubricTypes.children.length; i++) {
        if(Number(wrapperRubricTypes.children[i].getAttribute("data-id-item")) === idItem) {
          wrapperRubricTypes.children[i].remove();
          rubricTypesList = rubricTypesList.filter(el => el.idItem !== idItem);
        }
      }
    });
    wrapperRubricItem.appendChild(input);
    wrapperRubricItem.appendChild(deleteRubricTypeBtn);
    wrapperRubricTypes.appendChild(wrapperRubricItem);
  }

  const body = document.getElementsByTagName("body")[0];
  const wrapperFilter = document.querySelector(".wrapper__filter");

  wrapperFilter.style.filter = "brightness(40%)";
  wrapperFilter.style.backgroundColor = "#555";
  const wrapperModal = document.createElement("div");

  wrapperModal.style.position = "absolute";
  wrapperModal.style.top = "20vh";
  wrapperModal.style.left = "50%";
  wrapperModal.style.backgroundColor = "#F5F5F5";
  wrapperModal.style.height = "min-content";
  wrapperModal.style.maxWidth = "800px";
  wrapperModal.style.width = "100%";
  wrapperModal.style.transform = "translate(-50%)";
  wrapperModal.style.borderRadius = "5px";

  const wrapperContent = document.createElement("div");
  wrapperContent.classList.add("wrapper__content-modal-edit-rubric");

  const editRubricNameInput = document.createElement("input");
  editRubricNameInput.value = rubricName;
  editRubricNameInput.setAttribute("id", "wrapper__content-modal-edit-rubric-name-input");
  editRubricNameInput.setAttribute("placeholder", "Назва рубрики:");
  editRubricNameInput.style.marginTop = "10px";

  const labelForEditRubricNameInput = document.createElement("label");
  labelForEditRubricNameInput.setAttribute("for", "wrapper__content-modal-edit-rubric-name-input");
  labelForEditRubricNameInput.innerHTML = "Назва рубрики:";

  const wrapperButtons = document.createElement("div");
  wrapperButtons.classList.add("wrapper__content-modal-buttons");

  const saveChangesBtn = document.createElement("button");
  saveChangesBtn.innerText = "Зберегти зміни";
  saveChangesBtn.classList.add("wrapper__content-modal-save-changes-btn");

  saveChangesBtn.addEventListener("click", async function () {
    const api = await fetch("/admin/rubrics/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: rubricId,
        name: editRubricNameInput.value,
        rubricTypes: rubricTypesList.map(el => el.name)
      })
    });

    if(api.ok) {
      const wrapperModalMessage = document.querySelector(".wrapper__modal-message");

      wrapperModalMessage.style.display = "block";
      wrapperModalMessage.style.border = "1px solid green";

      wrapperModalMessage.innerHTML = "Збережено успішно";
    } else {
      const wrapperModalMessage = document.querySelector(".wrapper__modal-message");

      wrapperModalMessage.style.display = "block";
      wrapperModalMessage.style.border = "1px solid #e54724";

      wrapperModalMessage.innerHTML = "Помилка";
    }
  });
  const closeModalBtn = document.createElement("button");
  closeModalBtn.innerText = "Закрити";
  closeModalBtn.classList.add("wrapper__content-modal-close-btn");

  closeModalBtn.addEventListener("click", function () {
    wrapperFilter.style.filter = "none";
    wrapperFilter.style.backgroundColor = "";

    wrapperModal.remove();

    window.location.reload();
  });
  wrapperButtons.appendChild(closeModalBtn);
  wrapperButtons.appendChild(saveChangesBtn);

  const labelForRubricTypeNameInput = document.createElement("label");
  labelForRubricTypeNameInput.setAttribute("for", "wrapper__content-modal-rubric-type-name-input");
  labelForRubricTypeNameInput.innerHTML = "Назва типу рубрики:";
  labelForRubricTypeNameInput.style.marginTop = "10px";

  const addRubricTypeInput = document.createElement("input");
  addRubricTypeInput.style.marginTop = "10px";
  addRubricTypeInput.setAttribute("placeholder", "Назва типу:");
  addRubricTypeInput.setAttribute("id", "wrapper__content-modal-rubric-type-name-input");

  const addRubricTypeBtn = document.createElement("button");
  addRubricTypeBtn.innerText = "Додати тип товару";
  addRubricTypeBtn.classList.add("wrapper__content-modal-add-rubric-type-btn");

  addRubricTypeBtn.addEventListener("click", function () {

    if(addRubricTypeInput.value) {
      const idItem = Math.floor(Math.random() * 100000);
      rubricTypesList.push({ name: addRubricTypeInput.value, idItem: idItem });

      createRubricTypeInput(addRubricTypeInput.value, null, idItem);

      addRubricTypeInput.value = "";
    }
  });
  const allRubricTypesLogo = document.createElement("h2");
  allRubricTypesLogo.innerText = "Типи товарів:";
  allRubricTypesLogo.style.marginTop = "10px";

  wrapperContent.appendChild(labelForEditRubricNameInput);
  wrapperContent.appendChild(editRubricNameInput);

  wrapperContent.appendChild(labelForRubricTypeNameInput);
  wrapperContent.appendChild(addRubricTypeInput);
  wrapperContent.appendChild(addRubricTypeBtn);
  wrapperContent.appendChild(allRubricTypesLogo);
  wrapperContent.appendChild(wrapperRubricTypes);

  for(let i = 0; i < rubricTypesList.length; i++) {
    createRubricTypeInput(rubricTypesList[i].name, rubricTypesList[i].id, rubricTypesList[i].idItem);
  }
  const wrapperModalMessage = document.createElement("div");
  wrapperModalMessage.classList.add("wrapper__modal-message");

  wrapperContent.appendChild(wrapperModalMessage);
  wrapperContent.appendChild(wrapperButtons);

  wrapperModal.appendChild(wrapperContent);

  body.appendChild(wrapperModal);
}

export { createEditRubricModal };
