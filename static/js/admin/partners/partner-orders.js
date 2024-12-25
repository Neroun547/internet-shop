import { startLoadMoreBtnAnimation } from "../../common/start-load-more-btn-animation.js";

const loadMoreOrdersBtn = document.querySelector(".load-more-orders-btn");
const wrapperOrders = document.querySelector(".wrapper__orders");
const userId = wrapperOrders.getAttribute("id");

let skip = 10;

if(loadMoreOrdersBtn) {
  loadMoreOrdersBtn.addEventListener("click", async function () {
    const text = loadMoreOrdersBtn.innerText;

    startLoadMoreBtnAnimation();

    if(skip) {
      skip += 10;
      let response;

      if(status && status !== "all") {
        response = await fetch("/admin/partners/info-page/" + userId + "/orders" + "/load-more?take=10&skip=" + (skip - 10) + "&status=" + status);
      } else {
        response = await fetch("/admin/partners/info-page/" + userId + "/orders" + "/load-more?take=10&skip=" + (skip - 10));
      }
      const { orders } = await response.json();

      if (orders.length) {
        const loadMoreOrdersBtn = document.querySelector(".load-more-orders-btn");

        for (let i = 0; i < orders.length; i++) {
          if(loadMoreOrdersBtn) {
            wrapperOrders.insertBefore(
              createOrderCard(
                orders[i].id_order,
                orders[i].status,
                orders[i].created_at,
                orders[i].sum
              ),
              loadMoreOrdersBtn
            );
          } else {
            wrapperOrders.appendChild(createOrderCard(
              orders[i].id_order,
              orders[i].status,
              orders[i].created_at,
              orders[i].sum
            ));
          }
        }
      }
      if (orders.length < 10) {
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
    loadMoreOrdersBtn.innerText = text;
  });
}

function createOrderCard(idOrder, status, date, sum) {
  const wrapperOrdersItem = document.createElement("div");

  wrapperOrdersItem.classList.add("wrapper__orders-item");

  const subWrapperOrdersItem = document.createElement("div");

  subWrapperOrdersItem.classList.add("sub-wrapper__orders-item");

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

  const wrapperOrdersItemSum = document.createElement("div");
  wrapperOrdersItemSum.classList.add("wrapper__orders-item-sum");
  wrapperOrdersItemSum.innerText = sum;


  subWrapperOrdersItem.appendChild(wrapperOrdersItemComplete);
  subWrapperOrdersItem.appendChild(wrapperOrdersItemDate);
  subWrapperOrdersItem.appendChild(wrapperOrdersItemSum);

  wrapperOrdersItem.appendChild(subWrapperOrdersItem);

  return wrapperOrdersItem;
}
