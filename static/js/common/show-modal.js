export function showModal(content, redirectLink) {
    const body = document.getElementsByTagName("body")[0];
    const wrapperFilter = document.querySelector(".wrapper__filter");

    wrapperFilter.style.filter = "brightness(40%)";
    wrapperFilter.style.backgroundColor = "#555";

    const wrapperModal = document.createElement("div");

    wrapperModal.style.position = "absolute";
    wrapperModal.style.top = "20vh";
    wrapperModal.style.left = "50%";
    wrapperModal.style.backgroundColor = "#F5F5F5";
    wrapperModal.style.height = "min-content";
    wrapperModal.style.width = "80%";
    wrapperModal.style.transform = "translate(-50%)";
    wrapperModal.style.borderRadius = "5px";

    const wrapperContent = document.createElement("div");

    wrapperContent.innerHTML = content;
    wrapperContent.style.maxWidth = "800px";
    wrapperContent.style.width = "90%";
    wrapperContent.style.margin = "0 auto";
    wrapperContent.style.marginTop = "150px";
    wrapperContent.style.textAlign = "center";
    wrapperContent.style.fontSize = "20px";
    wrapperContent.style.overflowWrap = "break-word";

    const confirmButton = document.createElement("button");

    confirmButton.innerHTML = "Зрозуміло";
    confirmButton.style.backgroundColor = "#f8b71d";
    confirmButton.style.paddingTop = "20px";
    confirmButton.style.paddingBottom = "20px";
    confirmButton.style.paddingLeft = "80px";
    confirmButton.style.paddingRight = "80px";
    confirmButton.style.border = "none";
    confirmButton.style.borderRadius = "5px";
    confirmButton.style.margin = "0 auto";
    confirmButton.style.marginTop = "130px";
    confirmButton.style.marginBottom = "20px";
    confirmButton.style.display = "block";
    confirmButton.style.cursor = "pointer";

    confirmButton.addEventListener("click", function () {
        wrapperFilter.style.filter = "none";
        wrapperFilter.style.backgroundColor = "";
        wrapperModal.remove();

        if(redirectLink) {
            window.location.href = redirectLink;
        }
    });

    wrapperModal.appendChild(wrapperContent);
    wrapperModal.appendChild(confirmButton);

    body.appendChild(wrapperModal);

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}
