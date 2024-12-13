export function startLoadMoreBtnAnimation() {
  const loadMoreBtn = document.querySelector(".load-more-button");

  loadMoreBtn.innerText = "";
  loadMoreBtn.innerHTML = "<div class=\"lds-ring\"><div></div><div></div><div></div><div></div></div>";
}
