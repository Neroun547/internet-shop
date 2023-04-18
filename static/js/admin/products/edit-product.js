const uploadProductForm = document.querySelector(".upload__product-form");
const wrapperMessageForm = document.querySelector(".wrapper__message-form ");
const filesInput = document.getElementById("files__input");
const selectUploadProductForm = document.getElementById("select-upload-product-form");

for(let i = 0; i < selectUploadProductForm.children.length; i++) {
    if(selectUploadProductForm.children[i].value === selectUploadProductForm.getAttribute("data-type")) {
        selectUploadProductForm.children[i].setAttribute("selected", true);
    }
}

const productId = uploadProductForm.getAttribute("id");

uploadProductForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData();
    const files = filesInput.files;

    for(let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    formData.append("name", e.target[1].value);
    formData.append("description", e.target[2].value);
    formData.append("price", e.target[3].value);
    formData.append("type", e.target[4].value);
    formData.append("available", e.target[5].checked);

    const api = await fetch("/admin/products/" + productId, {
        method: "PATCH",
        body: formData
    });

    if(api.ok) {
        wrapperMessageForm.style.display = "block";
        wrapperMessageForm.style.border = "1px solid green";
        wrapperMessageForm.innerHTML = "Товар завантажено успішно";
    } else {
        wrapperMessageForm.style.display = "block";
        wrapperMessageForm.style.border = "1px solid red";
        wrapperMessageForm.innerHTML = "Помилка завантаження. Перевірте тип файлу";
    }

    const timeout = setTimeout(function () {
        wrapperMessageForm.style.display = "none";
        clearTimeout(timeout);
    }, 4000);
});
