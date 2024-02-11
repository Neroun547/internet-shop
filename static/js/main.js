const wrapperMenuBtn = document.querySelector(".wrapper__logo-open-menu");
const wrapperContentLeftBarMenu = document.querySelector(".wrapper__content-left-bar-menu");
const languageSelect = document.getElementById("language-select");
const wrapperLogoMenuDecoration1 = wrapperMenuBtn.querySelector(".wrapper__logo-open-menu-decoration-1");
const wrapperLogoMenuDecoration2 = wrapperMenuBtn.querySelector(".wrapper__logo-open-menu-decoration-2");
const wrapperLogoMenuDecoration3 = wrapperMenuBtn.querySelector(".wrapper__logo-open-menu-decoration-3");

let showMenu = false;
let moveForMenu = wrapperContentLeftBarMenu.clientWidth / 8;

if(!window.matchMedia("(max-width: 1530px)").matches) {
    showCrossLeftBarMenuBtnDecoration();
}

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

        hideCrossLeftBarMenuBtnDecoration();

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


        showCrossLeftBarMenuBtnDecoration();

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

function showCrossLeftBarMenuBtnDecoration() {
    wrapperLogoMenuDecoration1.style.position = "absolute";
    wrapperLogoMenuDecoration1.style.top = "24px";

    wrapperLogoMenuDecoration1.style.rotate = "45deg";

    wrapperLogoMenuDecoration2.style.opacity = "0";

    wrapperLogoMenuDecoration3.style.position = "absolute";
    wrapperLogoMenuDecoration3.style.top = "15px";
    wrapperLogoMenuDecoration3.style.rotate = "-45deg";
}

function hideCrossLeftBarMenuBtnDecoration() {
    wrapperLogoMenuDecoration1.style.position = "static";
    wrapperLogoMenuDecoration1.style.top = "0";

    wrapperLogoMenuDecoration1.style.rotate = "0deg";

    wrapperLogoMenuDecoration2.style.opacity = "1";

    wrapperLogoMenuDecoration3.style.position = "static";
    wrapperLogoMenuDecoration3.style.top = "0";
    wrapperLogoMenuDecoration3.style.rotate = "0deg";
}



