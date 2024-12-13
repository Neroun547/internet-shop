import { startLoadMoreBtnAnimation } from "./common/start-load-more-btn-animation.js";

const showFiltersBtn = document.querySelector(".show-filters-btn");
const wrapperFilters = document.querySelector(".wrapper__filters");
const wrapperFiltersInputFrom = document.querySelector(".wrapper__filters-price-inputs-from");
const wrapperFiltersInputTo = document.querySelector(".wrapper__filters-price-inputs-to");
const wrapperFiltersInputFromRange = document.querySelector(".wrapper__filters-range-input-from")
const wrapperFiltersInputToRange = document.querySelector(".wrapper__filters-range-input-to");
const wrapperFiltersForm = document.querySelector(".wrapper__filters-form");
const selectLanguage = document.getElementById("language-select");
const moveUpButton = document.querySelector(".move-up-button");
const loadMoreProductsBtn = document.getElementById("load-more-products-btn");
const wrapperContentContent = document.querySelector(".wrapper__content-content");

const addToBasketBtn = document.querySelectorAll(".wrapper__product-add-to-basket-btn");

const wrapperProducts = document.querySelector(".wrapper__products");
const productsType = wrapperProducts.getAttribute("data-type");
const activeRubric = wrapperProducts.getAttribute("data-rubric");
const searchName = wrapperProducts.getAttribute("data-searchname");

let skip = 8;

let availableFilter;
let priceFromFilter;
let priceToFilter;

for(let i = 0; i < addToBasketBtn.length; i++) {
    addToBasketBtn[i].addEventListener("click", async function () {
        const productId = addToBasketBtn[i].getAttribute("data-product");

        if(productId) {
            const api = await fetch("/basket/" + productId, {
                method: "POST"
            });
            if (api.ok) {
                addToBasketBtn[i].style.backgroundColor = "#fff";
                addToBasketBtn[i].style.color = "#000";

                if(selectLanguage.value === "en") {
                    addToBasketBtn[i].getElementsByTagName("strong")[0].innerHTML = "Already in basket";
                } else {
                    addToBasketBtn[i].getElementsByTagName("strong")[0].innerHTML = "Вже в кошику";
                }
                addToBasketBtn[i].setAttribute("data-product", "");
            }
        }
    });
}

wrapperFiltersForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    availableFilter = document.getElementById("select__available").value;
    priceFromFilter = wrapperFiltersInputFrom.value;
    priceToFilter = wrapperFiltersInputTo.value;

    let url = "/products/by-filters?priceFrom=" + priceFromFilter + "&priceTo=" + priceToFilter + "&available=" + availableFilter + "&type=" + productsType + "&rubricId=" + activeRubric;

    if(searchName) {
        url += "&searchName=" + searchName;
    }
    const products = await fetch(url);
    const response = await products.json();

    skip = 8;

    if(response.length) {
        const noProductsFilters = document.querySelector(".no-products-filters");

        if(noProductsFilters) {
            noProductsFilters.remove();
        }
        deleteAllElementsFromHTML(document.querySelectorAll(".wrapper__products-item"));

        for(let i = 0; i < response.length; i++) {
            wrapperProducts.appendChild(
                createProductCard(
                    response[i].id,
                    response[i].file_name,
                    "Зображення",
                    response[i].name,
                    response[i].type,
                    response[i].available,
                    response[i].price,
                    response[i].inBasket,
                    response[i].translateTitle
                )
            )
        }
    } else {
        const noProductsFilters = document.querySelector(".no-products-filters");

        if(!noProductsFilters) {
            deleteAllElementsFromHTML(document.querySelectorAll(".wrapper__products-item"));
            document.querySelector(".wrapper__products").innerHTML = "<h3 class='no-products-filters'>За цими фільтрами товарів не знайдено</h3>";
        }
        if(document.getElementById("load-more-products-btn")) {
            document.getElementById("load-more-products-btn").remove();
        }
    }
    if(response.length < 8) {
        if(document.getElementById("load-more-products-btn")) {
            document.getElementById("load-more-products-btn").remove();
        }
    } else {
        if(!document.getElementById("load-more-products-btn")) {
            const loadMoreBtn = document.createElement("button");

            loadMoreBtn.setAttribute("id", "load-more-products-btn");

            loadMoreBtn.innerText = "Завантажити більше";

            loadMoreBtn.addEventListener("click", function () {
                callLoadMoreProductsEvent();
            });

            wrapperContentContent.appendChild(loadMoreBtn);
        }
    }
});

wrapperFiltersInputFromRange.addEventListener("input", function (e) {
    wrapperFiltersInputFrom.value = e.target.value;
});

wrapperFiltersInputToRange.addEventListener("input", function (e) {
    wrapperFiltersInputTo.value = e.target.value;
});

showFiltersBtn.addEventListener("click", function () {
    if(!wrapperFilters.style.display || wrapperFilters.style.display === "none") {
        wrapperFilters.style.display = "block";
    } else {
        wrapperFilters.style.display = "none";
    }
});

if(loadMoreProductsBtn) {
    loadMoreProductsBtn.addEventListener("click", function () {
        callLoadMoreProductsEvent();
    });
}

function createProductCard(id, filename, alt, name, type, available, price, inBasket, translateTitle, partner) {
    const wrapperProductItem = document.createElement("div");
    wrapperProductItem.classList.add("wrapper__products-item");

    const link = document.createElement("a");
    link.setAttribute("href", "/products/"+id);
    link.classList.add("wrapper__products-item-link");

    const wrapperProductsItemContent = document.createElement("div");
    wrapperProductsItemContent.classList.add("wrapper__products-item-content");

    const img = document.createElement("img");
    img.setAttribute("src", "/images/"+filename);
    img.setAttribute("alt", alt);

    wrapperProductsItemContent.appendChild(img);

    link.appendChild(wrapperProductsItemContent)

    wrapperProductItem.appendChild(link);

    const wrapperProductsItemContentName = document.createElement("h2");

    if(translateTitle) {
        wrapperProductsItemContentName.innerHTML = translateTitle;
    } else {
        wrapperProductsItemContentName.innerHTML = name;
    }
    wrapperProductsItemContentName.classList.add("wrapper__products-item-content-name");

    wrapperProductsItemContent.appendChild(wrapperProductsItemContentName);

    const wrapperProductsItemContentType = document.createElement("h4");
    wrapperProductsItemContentType.innerHTML = type;
    wrapperProductsItemContentType.classList.add("wrapper__products-item-content-name");

    wrapperProductsItemContent.appendChild(wrapperProductsItemContentType);

    if(available) {
        const wrapperProductsItemContentAvailable = document.createElement("h4");
        wrapperProductsItemContentAvailable.innerHTML = "Є в наявності";
        wrapperProductsItemContentAvailable.classList.add("wrapper__products-item-content-name");

        wrapperProductsItemContent.appendChild(wrapperProductsItemContentAvailable);
    } else {
        const wrapperProductsItemContentAvailable = document.createElement("h4");
        wrapperProductsItemContentAvailable.innerHTML = "Немає в наявності";
        wrapperProductsItemContentAvailable.classList.add("wrapper__products-item-content-name");

        wrapperProductsItemContent.appendChild(wrapperProductsItemContentAvailable);
    }
    const wrapperProductsItemContentPrice = document.createElement("p");
    wrapperProductsItemContentPrice.classList.add("wrapper__products-item-content-price");
    wrapperProductsItemContentPrice.innerHTML = "Ціна: " + "<strong>" + price + "грн" + "</strong>";

    wrapperProductsItemContent.appendChild(wrapperProductsItemContentPrice);

    const wrapperProductsItemContentPartner = document.createElement("strong");
    wrapperProductsItemContentPartner.classList.add("product-from-partner-or-admin");
    wrapperProductsItemContentPartner.classList.add("text-center");

    if(partner) {
        wrapperProductsItemContentPartner.innerText = "Товар від партнера Zolotar";
    } else {
        wrapperProductsItemContentPartner.innerText = "Товар від Zolotar";
    }
    wrapperProductsItemContent.appendChild(wrapperProductsItemContentPartner);

    if(inBasket) {
        const wrapperProductAddToBasketBtn = document.createElement("button");
        wrapperProductAddToBasketBtn.setAttribute("data-product", id);
        wrapperProductAddToBasketBtn.classList.add("wrapper__product-add-to-basket-btn");
        wrapperProductAddToBasketBtn.style.backgroundColor = "#fff";
        wrapperProductAddToBasketBtn.style.color = "#000";

        const strong = document.createElement("strong");
        strong.innerHTML = "Вже в кошику";

        wrapperProductAddToBasketBtn.appendChild(strong);

        wrapperProductItem.appendChild(wrapperProductAddToBasketBtn)
    } else {
        const wrapperProductAddToBasketBtn = document.createElement("button");
        wrapperProductAddToBasketBtn.setAttribute("data-product", id);
        wrapperProductAddToBasketBtn.classList.add("wrapper__product-add-to-basket-btn");

        const strong = document.createElement("strong");
        strong.innerHTML = "Додати до кошика";

        wrapperProductAddToBasketBtn.appendChild(strong);

        wrapperProductItem.appendChild(wrapperProductAddToBasketBtn)

        wrapperProductAddToBasketBtn.addEventListener("click", async function () {
            const productId = wrapperProductAddToBasketBtn.getAttribute("data-product");

            if(productId) {
                const api = await fetch("/basket/" + productId, {
                    method: "POST"
                });
                if (api.ok) {
                    wrapperProductAddToBasketBtn.style.backgroundColor = "#fff";
                    wrapperProductAddToBasketBtn.style.color = "#000";
                    wrapperProductAddToBasketBtn.getElementsByTagName("strong")[0].innerHTML = "Вже в кошику";

                    wrapperProductAddToBasketBtn.setAttribute("data-product", "");
                }
            }
        });
    }

    return wrapperProductItem;
}

function deleteAllElementsFromHTML(elements) {
    for(let i = 0; i < elements.length; i++) {
        elements[i].remove();
    }
}

function callLoadMoreProductsEvent() {
    startLoadMoreBtnAnimation();

    const loadMoreBtn = document.getElementById("load-more-products-btn");
    const text = loadMoreBtn.innerText ? loadMoreBtn.innerText : "Завантажити більше";

    loadMoreProducts()
        .then(() => {
            loadMoreBtn.innerHTML = text;
        });
}

async function loadMoreProducts() {
    let products;

    skip += 8;

    let loadMoreUrl = "/products/load-more?take=8&skip=" + (skip-8);

    if(productsType) {
        loadMoreUrl += "&type=" + productsType;
    }
    if(availableFilter && priceFromFilter && priceToFilter) {
        loadMoreUrl += "&priceFrom=" + priceFromFilter + "&priceTo=" + priceToFilter + "&available=" + availableFilter;
    }
    if(activeRubric) {
        loadMoreUrl += "&rubricId=" + activeRubric;
    }
    if(searchName) {
        loadMoreUrl += "&searchName=" + searchName;
    }
    products = await fetch(loadMoreUrl);
    const response = await products.json();

    if(response.length) {
        for(let i = 0; i < response.length; i++) {
            wrapperProducts.appendChild(
                createProductCard(
                    response[i].id,
                    response[i].file_name,
                    "Зображення",
                    response[i].name,
                    response[i].type,
                    response[i].available,
                    response[i].price,
                    response[i].inBasket,
                    response[i].translateTitle,
                    response[i].partner
                )
            )
        }
    }
    if(response.length < 8) {
        document.getElementById("load-more-products-btn").remove();
    }
}

window.addEventListener("scroll", function (e) {
    if(window.scrollY > 1000) {
        moveUpButton.style.opacity = "1";
    } else {
        moveUpButton.style.opacity = "0";
    }
});

moveUpButton.addEventListener("click", function () {
    let scrollTop = window.scrollY;
    let intervalForScroll = window.scrollY / 30;

    const interval = setInterval(function () {
        scrollTop -= intervalForScroll;

        document.body.scrollTop = scrollTop; // For Safari
        document.documentElement.scrollTop = scrollTop; // For Chrome, Firefox, IE and Opera

        if(scrollTop <= 0) {
            clearInterval(interval);
        }
    }, 10);
});


