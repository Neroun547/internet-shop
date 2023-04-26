const countProducts = document.getElementById("count-products");
const countAvailableProducts = document.getElementById("count-available-products");
const deleteProductBtn = document.querySelectorAll(".wrapper__products-item-edit-btn");

for(let i = 0; i < deleteProductBtn.length; i++) {
    console.log(deleteProductBtn[i].getAttribute("data-available"))
    deleteProductBtn[i].addEventListener("click", async function () {
        const id = deleteProductBtn[i].getAttribute("id");
        const available = deleteProductBtn[i].getAttribute("data-available");

        await fetch("/admin/products/"+id, {
            method: "DELETE"
        });
        deleteProductBtn[i].parentElement.remove();

        if(available === "true") {
            countAvailableProducts.innerText = String(Number(countAvailableProducts.innerText) - 1);
            countProducts.innerText = String(Number(countProducts.innerText) - 1);
        } else {
            countProducts.innerText = String(Number(countProducts.innerText) - 1);
        }
    });
}
