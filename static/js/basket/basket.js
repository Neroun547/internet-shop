const wrapperProductsItem = document.querySelectorAll(".wrapper__products-item");
const deleteFromBasketBtn = document.querySelectorAll(".wrapper__products-item-remove");
const sumProductsValue = document.querySelector(".sum-products-value");
const sumProducts = document.querySelector(".sum-products");
const basketLogo = document.querySelector(".basket-logo");
const wrapperProducts = document.querySelector(".wrapper__products");
const countProductInput = document.querySelectorAll(".count-product-input");

const buyFormDescription = document.querySelector(".buy-form-description");
const buyForm = document.getElementById("buy-form");

const allInBasketElements = {};

for(let i = 0; i < wrapperProductsItem.length; i++) {
    allInBasketElements[wrapperProductsItem[i].getAttribute("id")] = Number(wrapperProductsItem[i].getAttribute("data-price"))
}

for(let i = 0; i < countProductInput.length; i++) {
    countProductInput[i].addEventListener("input", function (e) {
        allInBasketElements[e.target.getAttribute("data-idProduct")] = Number((Number(e.target.value) * Number(e.target.getAttribute("data-price")).toFixed(2)))

        sumProductsValue.innerHTML = String(calculateSumInBasket(allInBasketElements).toFixed(2));
    });
}

for(let i = 0; i < deleteFromBasketBtn.length; i++) {
    deleteFromBasketBtn[i].addEventListener("click",  function () {
        const productId = deleteFromBasketBtn[i].getAttribute("data-product");
        const price = deleteFromBasketBtn[i].getAttribute("data-price");

        fetch("/basket/" + productId, {
            method: "DELETE"
        });
        delete allInBasketElements[deleteFromBasketBtn[i].parentElement.getAttribute("id")];

        sumProductsValue.innerHTML = calculateSumInBasket(allInBasketElements).toFixed(2)
        deleteFromBasketBtn[i].parentElement.remove();

        if(!document.querySelectorAll(".wrapper__products-item").length) {
            sumProducts.remove();
            basketLogo.remove();

            buyForm.remove();
            buyFormDescription.remove();

            const h2 = document.createElement("h2");
            h2.innerHTML = "Кошик пустий";

            wrapperProducts.appendChild(h2);
        }
    });
}

function calculateSumInBasket (obj) {
    let sum = 0;

    for(let key in obj) {
        sum += obj[key];
    }
    return sum;
}

