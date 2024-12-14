import { createProductCard } from "./functions/create-product-card.js";
import { removeAllProducts } from "./functions/remove-all-products.js";
import { startLoadMoreBtnAnimation } from "../../common/start-load-more-btn-animation.js";

const wrapperProducts = document.querySelector(".wrapper__products");
const filtersForm = document.getElementById("filters__form");
const deleteProductBtn = document.querySelectorAll(".wrapper__products-item-delete-btn");
const wrapperFiltersInputFrom = document.querySelector(".wrapper__filters-price-inputs-from");
const wrapperFiltersInputTo = document.querySelector(".wrapper__filters-price-inputs-to");
const wrapperFiltersInputFromRange = document.querySelector(".wrapper__filters-range-input-from")
const wrapperFiltersInputToRange = document.querySelector(".wrapper__filters-range-input-to");
const loadMoreProductsBtn = document.getElementById("load-more-products-btn");
const wrapperContentContent = document.querySelector(".wrapper__content-content-admin")

let skip = 20;
let availableProductFilter;
let minPriceProductFilter;
let maxPriceProductFilter;
let typeProductFilter;

for(let i = 0; i < deleteProductBtn.length; i++) {
    deleteProductBtn[i].addEventListener("click", async function () {
        const id = deleteProductBtn[i].getAttribute("id");

        await fetch("/admin/products/"+id, {
            method: "DELETE"
        });

        window.location.reload();
    });
}

filtersForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    availableProductFilter = e.target[0].value;
    minPriceProductFilter = e.target[1].value;
    maxPriceProductFilter = e.target[3].value;

    const response = await fetch(`/admin/products/by-filters?available=${availableProductFilter}&priceFrom=${minPriceProductFilter}&priceTo=${maxPriceProductFilter}`);
    const data = await response.json();

    skip = 20;

    removeAllProducts();

    if(data.length) {
        for (let i = 0; i < data.length; i++) {
            wrapperProducts.appendChild(
              createProductCard(
                data[i].id,
                data[i].file_name,
                "Зображення",
                data[i].name,
                data[i].type,
                data[i].available,
                data[i].price,
                data[i].num
              )
            )
        }
    } else {
        const noProductsFoundLogo = document.createElement("h2");
        noProductsFoundLogo.classList.add("no_products-found-logo");
        noProductsFoundLogo.innerHTML = "Продуктів за цими фільтрами не знайдено";

        wrapperProducts.appendChild(noProductsFoundLogo);
    }

    if(data.length >= 20) {
        if(!document.getElementById("load-more-products-btn")) {
            const loadMoreProductsBtn = document.createElement("button");

            loadMoreProductsBtn.innerText = "Завантажити більше";

            loadMoreProductsBtn.classList.add("load-more-button");
            loadMoreProductsBtn.setAttribute("id", "load-more-products-btn");

            loadMoreProductsBtn.addEventListener("click", async function () {
                await loadMoreProducts();
            });

            wrapperContentContent.appendChild(loadMoreProductsBtn);
        }
    } else {
        if(loadMoreProductsBtn) {
            loadMoreProductsBtn.remove();
        }
    }
});

if(loadMoreProductsBtn) {
    loadMoreProductsBtn.addEventListener("click", async function () {
        await loadMoreProducts();
    });
}

wrapperFiltersInputFromRange.addEventListener("input", function (e) {
    wrapperFiltersInputFrom.value = e.target.value;
});

wrapperFiltersInputToRange.addEventListener("input", function (e) {
    wrapperFiltersInputTo.value = e.target.value;
});

async function loadMoreProducts() {
    const loadMoreBtn = document.getElementById("load-more-products-btn");
    const loadMoreBtnText = loadMoreBtn.innerText;

    startLoadMoreBtnAnimation();

    let products;

    if(availableProductFilter && minPriceProductFilter && maxPriceProductFilter) {
        products = await fetch(`/admin/products/load-more?take=20&skip=${skip}&available=${availableProductFilter}&priceFrom=${minPriceProductFilter}&priceTo=${maxPriceProductFilter}`);
    } else {
        products = await fetch(`/admin/products/load-more?take=20&skip=${skip}`);
    }
    skip += 20;
    const response = await products.json();

    if(response.length) {
        for(let i = 0; i < response.length; i++) {
            wrapperProducts.appendChild(
                createProductCard(
                    response[i].id,
                    response[i].productsImages && response[i].productsImages[0] ? response[i].productsImages[0].file_name : "",
                    "Зображення",
                    response[i].name,
                    response[i].type,
                    response[i].available,
                    response[i].price,
                    response[i].num
                )
            )
        }
    }
    if(response.length < 20) {
        document.getElementById("load-more-products-btn").remove();
    } else {
        loadMoreBtn.innerText = loadMoreBtnText;
    }
}
