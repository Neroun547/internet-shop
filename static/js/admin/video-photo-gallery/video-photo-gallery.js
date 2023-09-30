import { createPublicationCard } from "./functions/create-publication-card.js";

const deleteButtons = document.querySelectorAll(".wrapper__publications-item-buttons-delete");
const showDescriptionBtn = document.querySelectorAll(".show-description-btn");
const wrapperPublications = document.querySelector(".wrapper__publications");

let skip = 12;
let limitForScroll = 200;


for(let i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener("click", async function () {
    const id = deleteButtons[i].getAttribute("id");

    await fetch("/admin/video-photo-gallery/" + id, {
      method: "DELETE"
    });

    deleteButtons[i].parentElement.parentElement.parentElement.remove();
  });
}

for(let i = 0; i < showDescriptionBtn.length; i++) {
  showDescriptionBtn[i].addEventListener("click", function () {
    if(!showDescriptionBtn[i].nextElementSibling.style.display || showDescriptionBtn[i].nextElementSibling.style.display === "none") {
      showDescriptionBtn[i].nextElementSibling.style.display = "block";
    } else {
      showDescriptionBtn[i].nextElementSibling.style.display = "none";
    }
  });
}

window.addEventListener("scroll", async function () {

  if(window.scrollY >= limitForScroll && wrapperPublications.children.length > 1 && skip > 0) {
    skip += 12;
    limitForScroll += 800;

    const api = await fetch(`/video-photo-gallery/load-more?take=8&skip=${skip - 12}`);
    const response = await api.json();

    if(response.length) {
      for(let i = 0; i < response.length; i++) {

        if(response[i].previewFileVideo) {
          wrapperPublications.appendChild(
            createPublicationCard(
              true,
              response[i].previewFile,
              response[i].name,
              response[i].theme,
              response[i].description,
              response[i].id
            )
          )
        } else {
          wrapperPublications.appendChild(
            createPublicationCard(
              false,
              response[i].previewFile,
              response[i].name,
              response[i].theme,
              response[i].description,
              response[i].id
            )
          )
        }
      }
      if(response.length < 12) {
        skip = 0;
      }
    }
  }
});
