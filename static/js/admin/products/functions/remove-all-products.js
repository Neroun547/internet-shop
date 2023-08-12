export function removeAllProducts() {
  const noProductsFoundLogo = document.querySelector(".no_products-found-logo");
  const wrapperProductsItem = document.querySelectorAll(".wrapper__products-item");

  if(noProductsFoundLogo) {
    noProductsFoundLogo.remove();
  }
  for(let i = 0; i < wrapperProductsItem.length; i++) {
    wrapperProductsItem[i].remove();
  }
}
