import { createProductCard } from "./functions/create-product-card.js";
import { removeAllProducts } from "./functions/remove-all-products.js";

const wrapperProducts = document.querySelector(".wrapper__products");
const filtersForm = document.getElementById("filters__form");
const deleteProductBtn = document.querySelectorAll(".wrapper__products-item-delete-btn");
const wrapperFiltersInputFrom = document.querySelector(".wrapper__filters-price-inputs-from");
const wrapperFiltersInputTo = document.querySelector(".wrapper__filters-price-inputs-to");
const wrapperFiltersInputFromRange = document.querySelector(".wrapper__filters-range-input-from")
const wrapperFiltersInputToRange = document.querySelector(".wrapper__filters-range-input-to");

let skip = 8;
let limitForScroll = 200;
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
    typeProductFilter = e.target[1].value;
    minPriceProductFilter = e.target[2].value;
    maxPriceProductFilter = e.target[4].value;

    const response = await fetch(`/products/by-filters?available=${availableProductFilter}&type=${typeProductFilter}&priceFrom=${minPriceProductFilter}&priceTo=${maxPriceProductFilter}`);
    const data = await response.json();

    skip = 8;
    limitForScroll = 200;

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
});

window.addEventListener("scroll", async function () {

    if(window.scrollY >= limitForScroll && wrapperProducts.children.length > 1 && skip > 0) {
        skip += 8;
        limitForScroll += 800;

        let products;

        if(availableProductFilter && minPriceProductFilter && maxPriceProductFilter && typeProductFilter) {
            products = await fetch(`/admin/products/load-more?take=8&skip=${skip - 8}&available=${availableProductFilter}&type=${typeProductFilter}&priceFrom=${minPriceProductFilter}&priceTo=${maxPriceProductFilter}`);
        } else {
            products = await fetch(`/admin/products/load-more?take=8&skip=${skip - 8}`);
        }
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
            if(response.length < 8) {
                skip = 0;
            }
        }
    }
});

wrapperFiltersInputFromRange.addEventListener("input", function (e) {
    wrapperFiltersInputFrom.value = e.target.value;
});

wrapperFiltersInputToRange.addEventListener("input", function (e) {
    wrapperFiltersInputTo.value = e.target.value;
});
