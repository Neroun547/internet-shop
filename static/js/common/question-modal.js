export function questionModal(content, action, scrollUp=true) {
    const body = document.getElementsByTagName("body")[0];
    const wrapperFilter = document.querySelector(".wrapper__filter");

    wrapperFilter.style.filter = "brightness(40%)";
    wrapperFilter.style.backgroundColor = "#555";


    const wrapperModal = document.createElement("div");

    wrapperModal.classList.add("wrapper__question-modal");
    wrapperModal.style.position = "absolute";

    if(scrollUp) {
        wrapperModal.style.top = "20vh";
    } else {
        wrapperModal.style.top = window.scrollY + 100 + "px";
    }
    wrapperModal.style.left = "50%";
    wrapperModal.style.backgroundColor = "#F5F5F5";
    wrapperModal.style.height = "auto";
    wrapperModal.style.width = "60%";
    wrapperModal.style.transform = "translate(-50%)";
    wrapperModal.style.margin = "10px";
    wrapperModal.style.borderRadius = "5px";

    const wrapperContent = document.createElement("div");

    wrapperContent.classList.add("wrapper__question-modal-content")
    wrapperContent.innerHTML = content;
    wrapperContent.style.maxWidth = "800px";
    wrapperContent.style.width = "100%";
    wrapperContent.style.margin = "0 auto";
    wrapperContent.style.marginTop = "150px";
    wrapperContent.style.padding = "20px";
    wrapperContent.style.textAlign = "center";
    wrapperContent.style.fontSize = "22px";

    const wrapperBtn = document.createElement("div");

    wrapperBtn.classList.add("wrapper__question-modal-btn");
    wrapperBtn.style.display = "flex";
    wrapperBtn.style.justifyContent = "space-between";
    wrapperBtn.style.width = "70%";
    wrapperBtn.style.margin = "0 auto";
    wrapperBtn.style.paddingBottom = "10px";

    const confirmButton = document.createElement("button");

    confirmButton.innerHTML = "Так";
    confirmButton.style.backgroundColor = "#f8b71d";
    confirmButton.style.paddingTop = "20px";
    confirmButton.style.paddingBottom = "20px";
    confirmButton.style.paddingLeft = "80px";
    confirmButton.style.paddingRight = "80px";
    confirmButton.style.border = "none";
    confirmButton.style.borderRadius = "5px";
    confirmButton.style.marginTop = "90px";
    confirmButton.style.display = "block";
    confirmButton.style.cursor = "pointer";
    confirmButton.style.marginRight = "10px";

    const exitButton = document.createElement("button");

    exitButton.innerHTML = "Ні";
    exitButton.style.backgroundColor = "#f8b71d";
    exitButton.style.paddingTop = "20px";
    exitButton.style.paddingBottom = "20px";
    exitButton.style.paddingLeft = "80px";
    exitButton.style.paddingRight = "80px";
    exitButton.style.border = "none";
    exitButton.style.borderRadius = "5px";
    exitButton.style.marginTop = "90px";
    exitButton.style.display = "block";
    exitButton.style.cursor = "pointer";
    exitButton.style.marginLeft = "10px";

    confirmButton.addEventListener("click", function () {
        wrapperFilter.style.filter = "none";
        wrapperFilter.style.backgroundColor = "";
        wrapperModal.remove();

        action();
    });

    exitButton.addEventListener("click", function () {
        wrapperFilter.style.filter = "none";
        wrapperFilter.style.backgroundColor = "";
        wrapperModal.remove();
    });

    wrapperModal.appendChild(wrapperContent);

    wrapperBtn.appendChild(exitButton);
    wrapperBtn.appendChild(confirmButton);

    wrapperModal.appendChild(wrapperBtn);

    body.appendChild(wrapperModal);

    if(scrollUp) {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}
