const wrapperProductImagesImage = document.querySelectorAll(".wrapper__product-images-image");
const arrowRight = document.querySelector(".arrow-right");
const arrowLeft = document.querySelector(".arrow-left");
const wrapperProductDescription = document.querySelector(".wrapper__product-description");
const showDescriptionBtn = document.querySelector(".wrapper__product-description-btn");
const addToBasketBtn = document.getElementById("add-to-basket-btn");

let activeImage = wrapperProductImagesImage[0];
let currentIndexImage = 0;

activeImage.style.display = "block";

if(wrapperProductImagesImage.length === 1) {
    arrowRight.style.display = "none";
    arrowLeft.style.display = "none";
}

showDescriptionBtn.addEventListener("click", function () {
    console.log(wrapperProductDescription.style.display)
    if(wrapperProductDescription.style.display === "none" || !wrapperProductDescription.style.display) {
        wrapperProductDescription.style.display = "block";
    } else {
        wrapperProductDescription.style.display = "none";
    }
});

arrowLeft.addEventListener("click", function () {
    hideImage(currentIndexImage);

    if(currentIndexImage === 0) {
       currentIndexImage = wrapperProductImagesImage.length - 1;
    } else {
        currentIndexImage -= 1;
    }
    displayImage(currentIndexImage);
});

arrowRight.addEventListener("click", function () {
    hideImage(currentIndexImage);

    if(currentIndexImage === wrapperProductImagesImage.length - 1) {
        currentIndexImage = 0;
    } else {
        currentIndexImage += 1;
    }
    displayImage(currentIndexImage);
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

function displayImage (index) {
    wrapperProductImagesImage[index].style.display = "block";
}

function hideImage (index) {
    wrapperProductImagesImage[index].style.display = "none";
}
