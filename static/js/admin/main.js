const openOrCloseBurgerMenuBtn = document.querySelector(".open-close-burger-menu");
const wrapperNavBarLeftAdmin = document.querySelector(".wrapper__nav-bar-left-admin");
let leftBarClosed;

window.addEventListener("load", () => {
  leftBarClosed = window.matchMedia("(max-width: 1530px)").matches;

  if(leftBarClosed) {
    openOrCloseBurgerMenuBtn.innerText = "Усі розділи >";
  }
});

openOrCloseBurgerMenuBtn.addEventListener("click", () => {
  if(leftBarClosed) {
    let right = -250;
    openOrCloseBurgerMenuBtn.style.left = "130px";
    openOrCloseBurgerMenuBtn.innerText = "Усі розділи <";

    const interval = setInterval(() => {
      right += 25;
      wrapperNavBarLeftAdmin.style.left = right + "px";

      if(right === 0) {
        wrapperNavBarLeftAdmin.style.boxShadow = "3px 0px 15px";
        clearInterval(interval);
      }
    }, 10);
  } else {
    let left = 0;

    openOrCloseBurgerMenuBtn.style.left = "10px";
    openOrCloseBurgerMenuBtn.innerText = "Усі розділи >";

    const interval = setInterval(() => {
      left -= 25;
      wrapperNavBarLeftAdmin.style.left = left + "px";

      if(left <= -250) {
        wrapperNavBarLeftAdmin.style.boxShadow = "none";
        clearInterval(interval);
      }
    }, 10);
  }
  leftBarClosed = !leftBarClosed;
});
