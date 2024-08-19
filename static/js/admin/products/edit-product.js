import { showModal } from "../../common/show-modal.js";

const uploadProductForm = document.querySelector(".upload__product-form");
const wrapperMessageForm = document.querySelector(".wrapper__message-form ");
const filesInput = document.getElementById("files__input");
const productTypeSelect = document.getElementById("product-type");
const selectRubric = document.getElementById("rubrics-select");
const wrapperSelectedImages = document.querySelector(".wrapper__selected-images");
const wrapperSelectedLeft = document.querySelector(".wrapper__selected-left");
const wrapperSelectedRight = document.querySelector(".wrapper__selected-right");
const availableCheckBox = document.getElementById("available");

for(let i = 0; i < productTypeSelect.children.length; i++) {
    if(productTypeSelect.children[i].value === productTypeSelect.getAttribute("data-type")) {
        productTypeSelect.children[i].setAttribute("selected", "true");
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

    const num = e.target[1].value;
    const name = e.target[2].value;
    const description = e.target[3].value;
    const price = e.target[4].value;
    const translateLanguage = e.target[5].value;
    const translate = e.target[6].value;
    const translateLanguageDescription = e.target[7].value;
    const translateDescription = e.target[8].value;
    const rubric = e.target[9].value;
    const type = e.target[10].value;
    const available = e.target[11].checked;

    const formData = new FormData();
    const files = filesInput.files;

    for(let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }
    formData.append("num", num);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("translate_language", translateLanguage);
    formData.append("translate", translate);
    formData.append("translate_language_description", translateLanguageDescription);
    formData.append("translate_description", translateDescription);
    formData.append("type", type);
    formData.append("available", available);
    formData.append("rubric_id", rubric);

    const api = await fetch("/admin/products/" + productId, {
        method: "PATCH",
        body: formData
    });

    if(api.ok) {
        showModal("Товар оновлено", "/admin");
    } else {
        showModal("Помилка оновлення товару. Перевірте тип файлу та його розмір (розмір файлу повинен бути до 10 мегабайт)", "/admin");
    }

    const timeout = setTimeout(function () {
        wrapperMessageForm.style.display = "none";
        clearTimeout(timeout);
    }, 4000);
});

selectRubric.addEventListener("change", async function (e) {
    const response = await fetch("/admin/rubrics/" + e.target.value + "/rubric-types");
    const data = await response.json();

    productTypeSelect.innerHTML = "";

    for(let i = 0; i < data.length; i++) {
        const option = document.createElement("option");

        option.innerText = data[i].name;
        option.setAttribute("value", data[i].name);

        productTypeSelect.appendChild(option);
    }
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
