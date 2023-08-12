export function createProductCard(id, filename, alt, name, type, available, price, num) {
  const wrapperProductsItem = document.createElement("div");
  wrapperProductsItem.classList.add("wrapper__products-item");

  const img = document.createElement("img");
  img.setAttribute("src", "/images/" + filename);
  img.setAttribute("alt", alt);
  img.classList.add("wrapper__products-item-image");

  wrapperProductsItem.appendChild(img);

  const wrapperProductsNum = document.createElement("div");
  wrapperProductsNum.classList.add("wrapper__products-item-num");

  wrapperProductsNum.innerText = "Порядковий номер: " + num;

  wrapperProductsItem.appendChild(wrapperProductsNum);

  const wrapperProductsItemName = document.createElement("div");
  wrapperProductsItemName.classList.add("wrapper__products-item-name");
  wrapperProductsItemName.innerText = "Назва: " + name;

  wrapperProductsItem.appendChild(wrapperProductsItemName);

  const wrapperProductsItemType = document.createElement("div");
  wrapperProductsItemType.classList.add("wrapper__products-item-type");

  wrapperProductsItemType.innerText = "Тип: " + type;

  wrapperProductsItem.appendChild(wrapperProductsItemType);

  const wrapperProductsItemPrice = document.createElement("div");
  wrapperProductsItemPrice.classList.add("wrapper__products-item-price");

  wrapperProductsItemPrice.innerText = "Ціна: " + price + " грн";

  wrapperProductsItem.appendChild(wrapperProductsItemPrice);

  const wrapperProductsItemDeleteBtn = document.createElement("button");
  wrapperProductsItemDeleteBtn.classList.add("wrapper__products-item-edit-btn");

  wrapperProductsItemDeleteBtn.style.backgroundColor = "#e54724";
  wrapperProductsItemDeleteBtn.style.color = "white";
  wrapperProductsItemDeleteBtn.setAttribute("id", id);

  wrapperProductsItemDeleteBtn.innerText = "Видалити";

  wrapperProductsItemDeleteBtn.addEventListener("click", async function () {
    const id = wrapperProductsItemDeleteBtn.getAttribute("id");

    await fetch("/admin/products/"+id, {
      method: "DELETE"
    });

    wrapperProductsItemDeleteBtn.parentElement.remove();
  });

  wrapperProductsItem.appendChild(wrapperProductsItemDeleteBtn);

  const link = document.createElement("a");

  link.href = "/admin/products/edit/" + id;

  const wrapperProductsItemEditBtn = document.createElement("button");

  wrapperProductsItemEditBtn.classList.add("wrapper__products-item-edit-btn");
  wrapperProductsItemEditBtn.innerHTML = "Редагувати";

  link.appendChild(wrapperProductsItemEditBtn);

  wrapperProductsItem.appendChild(link);

  return wrapperProductsItem;
}
