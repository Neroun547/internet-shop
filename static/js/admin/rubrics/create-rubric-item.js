export function createRubricItem(name, types, id) {
  const wrapperRubricItem = document.createElement("div");

  wrapperRubricItem.classList.add("wrapper__rubrics-item");
  wrapperRubricItem.setAttribute("id", id);

  const rubricNameLogo = document.createElement("h2");

  rubricNameLogo.innerText = "Назва рубрики: " + name;

  wrapperRubricItem.appendChild(rubricNameLogo);

  const subWrapperRubricItem = document.createElement("div");

  subWrapperRubricItem.classList.add("mt-20");

  const subWrapperRubricItemSpan = document.createElement("span");

  let stringWithTypes = "";

  for(let i = 0; i < types.length; i++) {
    if(i < types.length - 1) {
      stringWithTypes += types[i] + ", ";
    } else {
      stringWithTypes += types[i] + ".";
    }
  }
  subWrapperRubricItemSpan.innerText = "Типи товарів в рубриці: " + stringWithTypes;
  subWrapperRubricItem.appendChild(subWrapperRubricItemSpan);
  wrapperRubricItem.appendChild(subWrapperRubricItem);

  const deleteRubricBtn = document.createElement("button");

  deleteRubricBtn.innerHTML = "Видалити рубрику";
  deleteRubricBtn.classList.add("mt-20");
  deleteRubricBtn.classList.add("wrapper__rubrics-item-delete-btn");

  deleteRubricBtn.addEventListener("click", async function () {
    deleteRubricBtn.parentElement.remove();

    await fetch("/admin/rubrics/" + deleteRubricBtn.parentElement.getAttribute("id"), {
      method: "DELETE"
    });
  });
  wrapperRubricItem.appendChild(deleteRubricBtn);

  return wrapperRubricItem;
}
