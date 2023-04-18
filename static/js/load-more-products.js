const wrapperProducts = document.querySelector(".wrapper__products");
const productsType = wrapperProducts.getAttribute("data-type");

let skip = 8;
let limitForScroll = 150;

if(window.matchMedia("(max-width: 1150px)").matches) {
    limitForScroll = 500;
}

if(window.matchMedia("(max-width: 755px").matches) {
    limitForScroll = 1000;
}

window.addEventListener("scroll", async function () {
    console.log(window.scrollY)
    if(window.scrollY >= limitForScroll && wrapperProducts.children.length > 1 && skip > 0) {
        let products;

        skip += 8;

        if(window.matchMedia("(max-width: 1150px)").matches) {
            limitForScroll += 2000;
        } else if(window.matchMedia("(max-width: 755px)").matches) {
            limitForScroll += 3000;
        } else {
            limitForScroll += 1000;
        }


        if(productsType) {
            products = await fetch("/products/load-more?take=8&skip=" + (skip-8) + "&type=" + productsType);
        } else {
            products = await fetch("/products/load-more?take=8&skip=" + (skip-8));
        }
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
