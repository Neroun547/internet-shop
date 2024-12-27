import { createProductCard } from "./functions/create-product-card.js";
import { removeAllProducts } from "./functions/remove-all-products.js";
import { startLoadMoreBtnAnimation } from "../../common/start-load-more-btn-animation.js";

const wrapperProducts = document.querySelector(".wrapper__products");
const filtersForm = document.getElementById("filters__form");
const deleteProductBtn = document.querySelectorAll(".wrapper__products-item-delete-btn");
const wrapperFiltersInputFrom = document.querySelector(".wrapper__filters-price-inputs-from");
const wrapperFiltersInputTo = document.querySelector(".wrapper__filters-price-inputs-to");
const wrapperFiltersInputFromRange = document.querySelector(".wrapper__filters-range-input-from");
const wrapperFiltersInputToRange = document.querySelector(".wrapper__filters-range-input-to");
const loadMoreProductsBtn = document.getElementById("load-more-products-btn");
const wrapperContentContent = document.querySelector(".wrapper__content-content-admin");
const filtersFormRubricSelect = document.getElementById("filters__form-rubric-select");
const searchProductForm = document.querySelector(".wrapper__filters-form-search");

filtersFormRubricSelect.value = "0";

let skip = 20;
let availableProductFilter;
let minPriceProductFilter;
let maxPriceProductFilter;
let rubricTypeProductFilter;
let rubricProductFilter;

let productName = "";

for(let i = 0; i < deleteProductBtn.length; i++) {
    deleteProductBtn[i].addEventListener("click", async function () {
        const id = deleteProductBtn[i].getAttribute("id");

        await fetch("/admin/products/"+id, {
            method: "DELETE"
        });

        window.location.reload();
    });
}

searchProductForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if(document.getElementById("load-more-products-btn")) {
        document.getElementById("load-more-products-btn").remove();
    }
    if(document.querySelector(".no_products-found-logo")) {
        document.querySelector(".no_products-found-logo").remove();
    }
    productName = e.target[0].value;

    const response = await fetch(`/admin/products/search-by-name?name=${productName}&take=20&skip=0`);
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
        noProductsFoundLogo.innerHTML = "Продуктів з такою назвою не знайдено";

        wrapperProducts.appendChild(noProductsFoundLogo);
    }
    if(data.length >= 20) {
        const loadMoreProductsBtn = document.createElement("button");

        loadMoreProductsBtn.innerText = "Завантажити більше";

        loadMoreProductsBtn.classList.add("load-more-button");
        loadMoreProductsBtn.setAttribute("id", "load-more-products-btn");

        loadMoreProductsBtn.addEventListener("click", async function () {
            await loadMoreProductsByName();
        });

        wrapperContentContent.appendChild(loadMoreProductsBtn);
    }
});

filtersFormRubricSelect.addEventListener("change", async function (e) {

    if(e.target.value !== "0") {
        rubricProductFilter = e.target.value;

        let filtersFormRubricTypesSelect = document.getElementById("filters__form-rubric-types-select");
        let filtersFormRubricTypesSelectLabel = document.getElementById("filters__form-rubric-types-select-label");

        if(!filtersFormRubricTypesSelectLabel) {
            filtersFormRubricTypesSelectLabel = document.createElement("label");

            filtersFormRubricTypesSelectLabel.setAttribute("id", "filters__form-rubric-types-select-label");
            filtersFormRubricTypesSelectLabel.setAttribute("for", "filters__form-rubric-types-select");
            filtersFormRubricTypesSelectLabel.innerText = "Тип товарів:";
            filtersFormRubricSelect.after(filtersFormRubricTypesSelectLabel);
        }
        if(!filtersFormRubricTypesSelect) {
            filtersFormRubricTypesSelect = document.createElement("select");

            filtersFormRubricTypesSelect.setAttribute("id", "filters__form-rubric-types-select");
            filtersFormRubricTypesSelectLabel.after(filtersFormRubricTypesSelect);

            filtersFormRubricTypesSelect.addEventListener("change", async function (e) {
                rubricTypeProductFilter = e.target.value;
            });
        }
        const api = await fetch("/admin/rubrics/" + e.target.value + "/rubric-types");
        const rubricTypes = await api.json();

        filtersFormRubricTypesSelect.innerHTML = "";

        const option = document.createElement("option");

        option.innerText = "Всі";
        option.setAttribute("value", "0");

        filtersFormRubricTypesSelect.appendChild(option);

        for(let i = 0; i < rubricTypes.length; i++) {
            const option = document.createElement("option");

            option.innerText = rubricTypes[i].name;
            option.setAttribute("value", rubricTypes[i].id);

            filtersFormRubricTypesSelect.appendChild(option);
        }
    } else {
        rubricProductFilter = null;
        rubricTypeProductFilter = null;

        const filtersFormRubricTypesSelect = document.getElementById("filters__form-rubric-types-select");
        const filtersFormRubricTypesSelectLabel = document.getElementById("filters__form-rubric-types-select-label");

        if(filtersFormRubricTypesSelect) {
            filtersFormRubricTypesSelect.remove();
        }
        if(filtersFormRubricTypesSelectLabel) {
            filtersFormRubricTypesSelectLabel.remove();
        }
    }
    rubricTypeProductFilter = "0";
});

filtersForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    availableProductFilter = document.getElementById("filters__form-available-select").value;
    minPriceProductFilter = document.getElementById("filters__form-price-from-input").value;
    maxPriceProductFilter = document.getElementById("filters__form-price-to-input").value;

    const response = await fetch(`/admin/products/by-filters?available=${availableProductFilter}&priceFrom=${minPriceProductFilter}&priceTo=${maxPriceProductFilter}&rubricTypeNameId=${rubricTypeProductFilter && rubricTypeProductFilter !== '0' ? rubricTypeProductFilter : ""}&rubricId=${rubricProductFilter && rubricProductFilter !== '0' ? rubricProductFilter : ''}`);
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
        if(document.getElementById("load-more-products-btn")) {
            document.getElementById("load-more-products-btn").remove();
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

    let products = await fetch(`/admin/products/load-more?take=20&skip=${skip}&available=${availableProductFilter ? availableProductFilter : 'all'}&priceFrom=${minPriceProductFilter}&priceTo=${maxPriceProductFilter}&rubricTypeNameId=${rubricTypeProductFilter && rubricTypeProductFilter !== '0' ? rubricTypeProductFilter : ""}&rubricId=${rubricProductFilter && rubricProductFilter !== '0' ? rubricProductFilter : ''}`);

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

async function loadMoreProductsByName() {
    const loadMoreBtn = document.getElementById("load-more-products-btn");
    const loadMoreBtnText = loadMoreBtn.innerText;

    startLoadMoreBtnAnimation();

    const products = await fetch(`/admin/products/search-by-name?name=${productName}&take=20&skip=${skip}`);

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
