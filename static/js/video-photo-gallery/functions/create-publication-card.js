export function createPublicationCard(previewVideo, fileLink, name, theme, description, id) {
  const publicationLink = document.createElement("a");
  publicationLink.href = "/video-photo-gallery/" + id;

  const wrapperPublicationsItem = document.createElement("div");
  wrapperPublicationsItem.classList.add("wrapper__publications-item");

  publicationLink.appendChild(wrapperPublicationsItem);

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

  return publicationLink;
}
