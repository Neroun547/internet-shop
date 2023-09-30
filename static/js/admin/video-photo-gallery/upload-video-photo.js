import { showModal } from "../../common/show-modal.js";

const wrapperSelectedImages = document.querySelector(".wrapper__selected-images");
const uploadProductForm = document.querySelector(".upload__product-form");
const wrapperMessageForm = document.querySelector(".wrapper__message-form ");
const filesInput = document.getElementById("files__input");
const wrapperSelectedLeft = document.querySelector(".wrapper__selected-left");
const wrapperSelectedRight = document.querySelector(".wrapper__selected-right");

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
  deleteImagesFromWrapperSelectedFiles();

  for(let i = 0; i < filesInput.files.length; i++) {
    if(filesInput.files[i].type.includes("video")) {
      createVideoInWrapperSelectedFiles(filesInput.files[i]);
    } else {
      createImageInWrapperSelectedFiles(filesInput.files[i]);
    }
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

  formData.append("name", e.target[1].value);
  formData.append("theme", e.target[2].value);
  formData.append("description", e.target[3].value);

  const api = await fetch("/admin/video-photo-gallery/", {
    method: "POST",
    body: formData
  });

  if(api.ok) {
    showModal("Публікацію завантажено успішно", "/admin");
  } else {
    showModal("Помилка завантаження. Перевірте тип файлу", "/admin");
  }

  const timeout = setTimeout(function () {
    wrapperMessageForm.style.display = "none";
    clearTimeout(timeout);
  }, 4000);
});

function createImageInWrapperSelectedFiles(file) {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    URL.revokeObjectURL(img.src);
  };
  img.style.display = "none";

  wrapperSelectedImages.appendChild(img);
}

function createVideoInWrapperSelectedFiles(file) {
  const video = document.createElement("video");

  video.setAttribute("controls", true);

  const source = document.createElement("source");

  source.src = URL.createObjectURL(file);

  source.onload = () => {
    URL.revokeObjectURL(source.src);
  };

  video.appendChild(source);

  wrapperSelectedImages.appendChild(video);
}

function deleteImagesFromWrapperSelectedFiles() {
  for(let i = 0; i < wrapperSelectedImages.children.length; i++) {
    wrapperSelectedImages.children[i].remove();
  }
}
