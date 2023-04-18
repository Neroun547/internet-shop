const addToBasketBtn = document.querySelectorAll(".wrapper__product-add-to-basket-btn");

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
