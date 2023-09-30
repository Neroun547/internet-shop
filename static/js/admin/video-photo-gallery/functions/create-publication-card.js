export function createPublicationCard(previewVideo, fileLink, name, theme, description, id) {
  const wrapperPublicationsItem = document.createElement("div");
  wrapperPublicationsItem.classList.add("wrapper__publications-item");

  const wrapperPublicationsSubItem = document.createElement("div");
  wrapperPublicationsSubItem.classList.add("wrapper__publications-sub-item");

  wrapperPublicationsItem.appendChild(wrapperPublicationsSubItem);

  if(previewVideo) {
    const video = document.createElement("video");
    video.setAttribute("controls", true);

    const source = document.createElement("source");
    source.src = "/gallery/" + fileLink;

    video.appendChild(source);

    wrapperPublicationsSubItem.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = "/gallery/" + fileLink;

    wrapperPublicationsSubItem.appendChild(img);
  }
  const nameH2 = document.createElement("h2");
  nameH2.innerHTML = name;

  wrapperPublicationsSubItem.appendChild(nameH2);

  const themeP = document.createElement("p");
  themeP.innerHTML = theme;

  wrapperPublicationsSubItem.appendChild(themeP);

  const showDescriptionBtn = document.createElement("button");
  showDescriptionBtn.classList.add("show-description-btn");
  showDescriptionBtn.innerHTML = "Показати опис";

  showDescriptionBtn.addEventListener("click", function () {
    if(!showDescriptionBtn.nextElementSibling.style.display || showDescriptionBtn.nextElementSibling.style.display === "none") {
      showDescriptionBtn.nextElementSibling.style.display = "block";
    } else {
      showDescriptionBtn.nextElementSibling.style.display = "none";
    }
  });

  wrapperPublicationsSubItem.appendChild(showDescriptionBtn);

  const descriptionBlock = document.createElement("div");
  descriptionBlock.classList.add("item-description");
  descriptionBlock.innerHTML = description;

  wrapperPublicationsSubItem.appendChild(descriptionBlock);

  const wrapperButtons = document.createElement("div");
  wrapperButtons.classList.add("wrapper__publications-item-buttons");

  wrapperPublicationsSubItem.appendChild(wrapperButtons);

  const linkEditBtn = document.createElement("a");
  linkEditBtn.href = "/admin/video-photo-gallery/edit-item/" + id;

  wrapperButtons.appendChild(linkEditBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("wrapper__publications-item-buttons-edit");
  editBtn.innerHTML = "Редагувати";

  linkEditBtn.appendChild(editBtn);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("wrapper__publications-item-buttons-delete");
  deleteButton.setAttribute("id", id);
  deleteButton.innerHTML = "Видалити";

  deleteButton.addEventListener("click", async function () {
    await fetch("/admin/video-photo-gallery/" + id, {
      method: "DELETE"
    });

    deleteButton.parentElement.parentElement.parentElement.remove();
  });

  wrapperButtons.appendChild(deleteButton);

  return wrapperPublicationsItem;
}
