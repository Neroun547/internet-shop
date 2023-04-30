const showFiltersBtn = document.querySelector(".show-filters-btn");
const wrapperFilters = document.querySelector(".wrapper__filters");
const wrapperFiltersInputFrom = document.querySelector(".wrapper__filters-price-inputs-from");
const wrapperFiltersInputTo = document.querySelector(".wrapper__filters-price-inputs-to");
const wrapperFiltersInputFromRange = document.querySelector(".wrapper__filters-range-input-from")
const wrapperFiltersInputToRange = document.querySelector(".wrapper__filters-range-input-to");
const wrapperFiltersForm = document.querySelector(".wrapper__filters-form");

const addToBasketBtn = document.querySelectorAll(".wrapper__product-add-to-basket-btn");

const wrapperProducts = document.querySelector(".wrapper__products");
const productsType = wrapperProducts.getAttribute("data-type");

let skip = 8;
let limitForScroll = 150;

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
                addToBasketBtn[i].getElementsByTagName("strong")[0].innerHTML = "Вже в кошику";

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

    const products = await fetch("/products/by-filters?priceFrom=" + priceFromFilter + "&priceTo=" + priceToFilter + "&available=" + availableFilter + "&type=" + productsType);
    const response = await products.json();

    skip = 8;
    limitForScroll = 150;

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
                    response[i].inBasket
                )
            )
        }
    } else {
        const noProductsFilters = document.querySelector(".no-products-filters");

        if(!noProductsFilters) {
            deleteAllElementsFromHTML(document.querySelectorAll(".wrapper__products-item"));
            document.querySelector(".wrapper__products").innerHTML = "<h3 class='no-products-filters'>За цими фільтрами товарів не знайдено</h3>";
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

if(window.matchMedia("(max-width: 1150px)").matches) {
    limitForScroll = 500;
}

if(window.matchMedia("(max-width: 755px").matches) {
    limitForScroll = 1000;
}

window.addEventListener("scroll", async function () {

    if(window.scrollY >= limitForScroll && wrapperProducts.children.length > 1 && skip > 0) {
        let products;

        skip += 8;

        let loadMoreUrl = "/products/load-more?take=8&skip=" + (skip-8);

        if(window.matchMedia("(max-width: 1150px)").matches) {
            limitForScroll += 2000;
        } else if(window.matchMedia("(max-width: 755px)").matches) {
            limitForScroll += 3000;
        } else {
            limitForScroll += 1000;
        }


        if(productsType) {
            loadMoreUrl += "&type=" + productsType;
        }
        if(availableFilter && priceFromFilter && priceToFilter) {
            loadMoreUrl += "&priceFrom=" + priceFromFilter + "&priceTo=" + priceToFilter + "&available=" + availableFilter;
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
                        response[i].inBasket
                    )
                )
            }
            if(response.length < 8) {
                skip = 0;
            }
        }
    }
});

function createProductCard(id, filename, alt, name, type, available, price, inBasket) {
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
    wrapperProductsItemContentName.innerHTML = name;
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
