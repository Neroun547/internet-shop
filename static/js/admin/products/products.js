const deleteProductBtn = document.querySelectorAll(".wrapper__products-item-edit-btn");

for(let i = 0; i < deleteProductBtn.length; i++) {
    deleteProductBtn[i].addEventListener("click", async function () {
        const id = deleteProductBtn[i].getAttribute("id");

        await fetch("/admin/products/"+id, {
            method: "DELETE"
        });

        deleteProductBtn[i].parentElement.remove();
    });
}
