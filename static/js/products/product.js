const wrapperProductImagesImage = document.querySelectorAll(".wrapper__product-images-image");
const arrowRight = document.querySelector(".arrow-right");
const arrowLeft = document.querySelector(".arrow-left");
const addToBasketBtn = document.getElementById("add-to-basket-btn");
const wrapperSubImagesItems = document.querySelectorAll(".wrapper__sub-images-item");

let activeImage = wrapperProductImagesImage[0];
let currentIndexImage = 0;

activeImage.style.left = "50%";

wrapperSubImagesItems[currentIndexImage].style.backgroundColor = "#ccc";
wrapperSubImagesItems[currentIndexImage].style.border = "1px solid #f8b71d";

if(wrapperProductImagesImage.length === 1) {
    arrowRight.style.display = "none";
    arrowLeft.style.display = "none";
}

for(let i = 0; i < wrapperSubImagesItems.length; i++) {
    wrapperSubImagesItems[i].addEventListener("click", function () {
        if(i !== currentIndexImage) {
            wrapperSubImagesItems[currentIndexImage].style.backgroundColor = "#fff";
            wrapperSubImagesItems[currentIndexImage].style.border = "1px solid #000";
            if (i > currentIndexImage) {
                hideImage(currentIndexImage, true);
                displayImage(i, true);

                currentIndexImage = i;
            } else {
                hideImage(currentIndexImage, false);
                displayImage(i, false);

                currentIndexImage = i;
            }
            wrapperSubImagesItems[currentIndexImage].style.backgroundColor = "#ccc";
            wrapperSubImagesItems[currentIndexImage].style.border = "1px solid #f8b71d";
        }
    });
}

arrowLeft.addEventListener("click", function () {

    if(currentIndexImage === 0) {
        hideImage(currentIndexImage, false);

        wrapperSubImagesItems[currentIndexImage].style.backgroundColor = "#fff";
        wrapperSubImagesItems[currentIndexImage].style.border = "1px solid #000";

        currentIndexImage = wrapperProductImagesImage.length - 1;
    } else {
        hideImage(currentIndexImage, false);

        wrapperSubImagesItems[currentIndexImage].style.backgroundColor = "#fff";
        wrapperSubImagesItems[currentIndexImage].style.border = "1px solid #000";

        currentIndexImage -= 1;
    }
    wrapperSubImagesItems[currentIndexImage].style.backgroundColor = "#ccc";
    wrapperSubImagesItems[currentIndexImage].style.border = "1px solid #f8b71d";

    displayImage(currentIndexImage, false);
});

arrowRight.addEventListener("click", function () {

    if(currentIndexImage === wrapperProductImagesImage.length - 1) {
        hideImage(currentIndexImage, true);

        wrapperSubImagesItems[currentIndexImage].style.backgroundColor = "#fff";
        wrapperSubImagesItems[currentIndexImage].style.border = "1px solid #000";

        currentIndexImage = 0;
    } else {
        hideImage(currentIndexImage, true);

        wrapperSubImagesItems[currentIndexImage].style.backgroundColor = "#fff";
        wrapperSubImagesItems[currentIndexImage].style.border = "1px solid #000";

        currentIndexImage += 1;
    }
    wrapperSubImagesItems[currentIndexImage].style.backgroundColor = "#ccc";
    wrapperSubImagesItems[currentIndexImage].style.border = "1px solid #f8b71d";

    displayImage(currentIndexImage, true);
});

addToBasketBtn.addEventListener("click", async function () {
    const productId = addToBasketBtn.getAttribute("data-product");

    if(productId) {
        const api = await fetch("/basket/" + productId, {
            method: "POST"
        });

        if (api.ok) {
            addToBasketBtn.style.backgroundColor = "#fff";
            addToBasketBtn.style.color = "#000";
            addToBasketBtn.getElementsByTagName("strong")[0].innerHTML = "Вже в кошику";

            addToBasketBtn.setAttribute("data-product", "");
        }
    }
});

function displayImage (index, left) {
    wrapperProductImagesImage[index].style.transform = "translateX(-50%)";

    if(!left) {
        let left = -50;

        const interval = setInterval(() => {
            left += 3;
            wrapperProductImagesImage[index].style.left = left + "%";

            if(left >= 50) {
                wrapperProductImagesImage[index].style.left = 50 + "%";
                clearInterval(interval);
            }
        }, 10);
    } else {
        let left = 150;

        const interval = setInterval(() => {
            left -= 3;

            wrapperProductImagesImage[index].style.left = left + "%";

            if(left <= 50) {
                wrapperProductImagesImage[index].style.left = 50 + "%";
                clearInterval(interval);
            }
        }, 10);
    }
}

function hideImage (index, left) {

    if(left) {
        let left = 50;

        const interval = setInterval(() => {
            left -= 3;
            wrapperProductImagesImage[index].style.left = left + "%";

            if(left <= -50) {
                wrapperProductImagesImage[index].style.left = -50 + "%";

                clearInterval(interval);
            }
        }, 10);
    } else {
        let left = 50;

        const interval = setInterval(() => {
            left += 3;

            wrapperProductImagesImage[index].style.left = left + "%";

            if(left >= 150) {
                wrapperProductImagesImage[index].style.left = 150 + "%";

                clearInterval(interval);
            }
        }, 10);
    }
}
