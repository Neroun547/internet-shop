const wrapperOrders = document.querySelector(".wrapper__orders");
const loadMoreOrdersBtn = document.querySelector(".load-more-orders-btn");
const sortSelect = document.getElementById("sort-select");

let skip = 10;
let status = "";

loadMoreOrdersBtn.addEventListener("click", async function () {
    await loadMoreOrdersAction();
});

sortSelect.addEventListener("change", async function (e) {
    status = e.target.value;

    skip = 0;

    let products;

    if(status === "all") {
        products = await fetch("/admin/orders/load-more?take=10&skip=0");
    } else {
        products = await fetch("/admin/orders/load-more?take=10&skip=0&status=" + status);
    }
    const response = await products.json();

    if(response.length) {
        let notOrdersLogo = document.querySelector(".not-orders-logo");

        if(notOrdersLogo) {
            notOrdersLogo.remove();
        }
        deleteAllWrapperOrdersItems();

        const loadMoreOrdersBtn = document.querySelector(".load-more-orders-btn");

        for (let i = 0; i < response.length; i++) {
            if(loadMoreOrdersBtn) {
                wrapperOrders.insertBefore(
                    createOrderCard(
                        response[i].id_order,
                        response[i].status,
                        response[i].created_at
                    ),
                    loadMoreOrdersBtn
                )
            } else {
                wrapperOrders.appendChild(
                    createOrderCard(
                        response[i].id_order,
                        response[i].status,
                        response[i].created_at
                    )
                )
            }
        }
    }
    if(response.length === 10) {
        skip = 10;
    }
    if(response.length === 10 && !document.querySelector(".load-more-orders-btn")) {
        const loadMoreOrdersBtn = document.createElement("button");
        loadMoreOrdersBtn.classList.add("load-more-orders-btn");
        loadMoreOrdersBtn.innerText = "Завантажити ще замовленн";

        wrapperOrders.appendChild(loadMoreOrdersBtn);

        loadMoreOrdersBtn.addEventListener("click", async function () {
            await loadMoreOrdersAction();
        });
    }
    if(response.length < 10) {
        const loadMoreOrdersBtn = document.querySelector(".load-more-orders-btn");
        skip = 0;

        if(loadMoreOrdersBtn) {
            loadMoreOrdersBtn.remove();
        }
    }
    if(!response.length) {
        deleteAllWrapperOrdersItems();
        let notOrdersLogo = document.querySelector(".not-orders-logo");

        if(!notOrdersLogo) {
            const h2 = document.createElement("h2");
            h2.classList.add("not-orders-logo");
            h2.innerText = "Немає замовлень";

            wrapperOrders.appendChild(h2);
        }
    }
});

async function loadMoreOrdersAction() {

    if(skip) {
        skip += 10;
        let products;

        if(status && status !== "all") {
            products = await fetch("/admin/orders/load-more?take=10&skip=" + (skip - 10) + "&status=" + status);
        } else {
            products = await fetch("/admin/orders/load-more?take=10&skip=" + (skip - 10));
        }
        const response = await products.json();

        if (response.length) {
            const loadMoreOrdersBtn = document.querySelector(".load-more-orders-btn");

            for (let i = 0; i < response.length; i++) {
                if(loadMoreOrdersBtn) {
                    wrapperOrders.insertBefore(
                        createOrderCard(
                            response[i].id_order,
                            response[i].status,
                            response[i].created_at
                        ),
                        loadMoreOrdersBtn
                    );
                } else {
                    wrapperOrders.appendChild(createOrderCard(
                        response[i].id_order,
                        response[i].status,
                        response[i].created_at
                    ));
                }
            }
        }
        if (response.length < 10) {
            const loadMoreOrdersBtn = document.querySelector(".load-more-orders-btn");
            skip = 0;

            if(loadMoreOrdersBtn) {
                loadMoreOrdersBtn.remove();
            }
        }
    } else {
        const loadMoreOrdersBtn = document.querySelector(".load-more-orders-btn");

        if(loadMoreOrdersBtn) {
            loadMoreOrdersBtn.remove();
        }
    }
}

function deleteAllWrapperOrdersItems() {
    const wrapperOrdersItems = document.querySelectorAll(".wrapper__orders-item");

    for(let i = 0; i < wrapperOrdersItems.length; i++) {
        wrapperOrdersItems[i].remove();
    }
}

function createOrderCard(idOrder, status, date) {
    const wrapperOrdersItem = document.createElement("div");

    wrapperOrdersItem.classList.add("wrapper__orders-item");

    const wrapperOrdersItemComplete = document.createElement("wrapper__orders-item-complete");
    wrapperOrdersItemComplete.classList.add("wrapper__orders-item-complete");
    const span = document.createElement("span");

    if(!status) {
        span.innerText = "Не виконано";
        span.style.color = "#e54724";
    }
    if(status === "completed") {
        span.innerText = "Виконано";
        span.style.color = "#69B904FF";
    }
    if(status === "in_process") {
        span.innerText = "В процесі";
        span.style.color = "#000";
    }
    if(status === "returned") {
        span.innerText = "Повернено клієнтом";
        span.style.color = "#000";
    }
    wrapperOrdersItemComplete.appendChild(span);

    const wrapperOrdersItemDate = document.createElement("div");
    wrapperOrdersItemDate.classList.add("wrapper__orders-item-date");
    wrapperOrdersItemDate.innerText = date;

    const link = document.createElement("a");
    link.href = "/admin/orders/" + idOrder;

    const button = document.createElement("button");
    button.classList.add("wrapper__orders-item-more");
    button.innerText = "Детальніше";

    link.appendChild(button);

    wrapperOrdersItem.appendChild(wrapperOrdersItemComplete);
    wrapperOrdersItem.appendChild(wrapperOrdersItemDate);
    wrapperOrdersItem.appendChild(link);

    return wrapperOrdersItem;
}

