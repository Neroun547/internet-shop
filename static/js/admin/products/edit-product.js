import { showModal } from "../../common/show-modal.js";

const uploadProductForm = document.querySelector(".upload__product-form");
const wrapperMessageForm = document.querySelector(".wrapper__message-form ");
const filesInput = document.getElementById("files__input");
const selectUploadProductForm = document.getElementById("select-upload-product-form");
const wrapperSelectedImages = document.querySelector(".wrapper__selected-images");
const wrapperSelectedLeft = document.querySelector(".wrapper__selected-left");
const wrapperSelectedRight = document.querySelector(".wrapper__selected-right");

for(let i = 0; i < selectUploadProductForm.children.length; i++) {
    if(selectUploadProductForm.children[i].value === selectUploadProductForm.getAttribute("data-type")) {
        selectUploadProductForm.children[i].setAttribute("selected", true);
    }
}

const productId = uploadProductForm.getAttribute("id");

let indexDisplayImg = 0;

wrapperSelectedLeft.addEventListener("click", function () {
    wrapperSelectedImages.children[indexDisplayImg].style.display = "none";

    if(indexDisplayImg) {
        indexDisplayImg -= 1;
    } else {
        indexDisplayImg = wrapperSelectedImages.children.length - 1;
    }
    wrapperSelectedImages.children[indexDisplayImg].style.display = "block";
});

wrapperSelectedRight.addEventListener("click", function () {
    wrapperSelectedImages.children[indexDisplayImg].style.display = "none";

    if(indexDisplayImg < wrapperSelectedImages.children.length-1) {
        indexDisplayImg += 1;
    } else {
        indexDisplayImg = 0;
    }
    wrapperSelectedImages.children[indexDisplayImg].style.display = "block";
});

filesInput.addEventListener("change", function (e) {
    deleteImagesFromWrapperSelectedImages();

    for(let i = 0; i < filesInput.files.length; i++) {
        createImageInWrapperSelectedImages(filesInput.files[i]);
    }
    wrapperSelectedImages.children[0].style = "block";

    if(filesInput.files.length > 1) {
        wrapperSelectedRight.style.display = "block";
        wrapperSelectedLeft.style.display = "block";
    } else {
        wrapperSelectedRight.style.display = "none";
        wrapperSelectedLeft.style.display = "none";
    }
});


uploadProductForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData();
    const files = filesInput.files;

    for(let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }
    formData.append("num", e.target[1].value);
    formData.append("name", e.target[2].value);
    formData.append("description", e.target[3].value);
    formData.append("price", e.target[4].value);
    formData.append("translate_language", e.target[5].value);
    formData.append("translate", e.target[6].value);
    formData.append("translate_language_description", e.target[7].value);
    formData.append("translate_description", e.target[8].value);
    formData.append("type", e.target[9].value);
    formData.append("available", e.target[10].checked);

    const api = await fetch("/admin/products/" + productId, {
        method: "PATCH",
        body: formData
    });

    if(api.ok) {
        showModal("Товар оновлено", "/admin");
    } else {
        showModal("Помилка оновлення товару", "/admin");
    }

    const timeout = setTimeout(function () {
        wrapperMessageForm.style.display = "none";
        clearTimeout(timeout);
    }, 4000);
});

function createImageInWrapperSelectedImages(file) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        URL.revokeObjectURL(img.src);
    };
    img.style.display = "none";

    wrapperSelectedImages.appendChild(img);
}

function deleteImagesFromWrapperSelectedImages() {
    for(let i = 0; i < wrapperSelectedImages.children.length; i++) {
        wrapperSelectedImages.children[i].remove();
    }
}
