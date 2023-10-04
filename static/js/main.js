const wrapperMenuBtn = document.querySelector(".wrapper__logo-open-menu");
const wrapperContentLeftBarMenu = document.querySelector(".wrapper__content-left-bar-menu");
const languageSelect = document.getElementById("language-select");

let showMenu = false;
let moveForMenu = wrapperContentLeftBarMenu.clientWidth / 8;

wrapperMenuBtn.addEventListener("click",  () => {

    if(window.matchMedia("(max-width: 1530px)").matches) {
        if(!wrapperContentLeftBarMenu.style.visibility || wrapperContentLeftBarMenu.style.visibility === "hidden") {
            wrapperContentLeftBarMenu.style.left = -wrapperContentLeftBarMenu.clientWidth + "px";
            wrapperContentLeftBarMenu.style.visibility = "visible";

            showMenu = true;
        }
    }
    if(!showMenu) {
        let left = 0;

        const interval = setInterval(() => {
            if (left > (-wrapperContentLeftBarMenu.clientWidth)) {
                left -= moveForMenu;
                wrapperContentLeftBarMenu.style.left = left + "px";
            } else {
                showMenu = true;
                clearInterval(interval);
            }
        }, 10);
    } else {
        let left = (-wrapperContentLeftBarMenu.clientWidth);
        const interval = setInterval(() => {
            if (left < 0) {
                left += moveForMenu;
                wrapperContentLeftBarMenu.style.left = left + "px";
            } else {
                showMenu = false;
                wrapperContentLeftBarMenu.style.left = 0 + "px";
                clearInterval(interval);
            }
        }, 10);
    }
});

languageSelect.addEventListener("change", async function (e) {
    await fetch("/translate/" + e.target.value, {
        method: "PATCH"
    });

    window.location.reload();
});



