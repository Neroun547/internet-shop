const wrapperOrders = document.querySelector(".wrapper__orders");
const loadMoreOrdersBtn = document.querySelector(".load-more-orders-btn")

let skip = 8;

loadMoreOrdersBtn.addEventListener("click", async function () {

    if(skip) {
        skip += 10;

        let products = await fetch("/admin/orders/load-more?take=8&skip=" + (skip - 10));
        const response = await products.json();

        if (response.length) {
            for (let i = 0; i < response.length; i++) {
                wrapperOrders.insertBefore(
                    createOrderCard(
                        response[i].id,
                        response[i].complete,
                        response[i].created_at
                    ),
                    loadMoreOrdersBtn
                )
            }
        }
        if (response.length < 10) {
            skip = 0;
            loadMoreOrdersBtn.remove();
        }
    }
});

function createOrderCard(id, complete, date) {
    const wrapperOrdersItem = document.createElement("div");

    wrapperOrdersItem.classList.add("wrapper__orders-item");

    const wrapperOrdersItemComplete = document.createElement("wrapper__orders-item-complete");
    wrapperOrdersItemComplete.classList.add("wrapper__orders-item-complete");
    const span = document.createElement("span");

    if(complete) {
        span.innerText = "Виконано";
        span.style.color = "#69B904FF";
    } else {
        span.innerText = "Не виконано";
    }
    wrapperOrdersItemComplete.appendChild(span);

    const wrapperOrdersItemDate = document.createElement("div");
    wrapperOrdersItemDate.classList.add("wrapper__orders-item-date");
    wrapperOrdersItemDate.innerText = date;

    const link = document.createElement("a");
    link.href = "/admin/orders/" + id;

    const button = document.createElement("button");
    button.classList.add("wrapper__orders-item-more");
    button.innerText = "Детальніше";

    link.appendChild(button);

    wrapperOrdersItem.appendChild(wrapperOrdersItemComplete);
    wrapperOrdersItem.appendChild(wrapperOrdersItemDate);
    wrapperOrdersItem.appendChild(link);

    return wrapperOrdersItem;
}

