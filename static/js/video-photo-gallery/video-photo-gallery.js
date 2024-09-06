import { createPublicationCard } from "./functions/create-publication-card.js";

const wrapperPublications = document.querySelector(".wrapper__publications");
const loadMorePublicationsBtn = document.getElementById("load-more-publications-btn")

let skip = 12;

loadMorePublicationsBtn.addEventListener("click", async function () {
    skip += 12;

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
        loadMorePublicationsBtn.remove();
      }
    }
});
