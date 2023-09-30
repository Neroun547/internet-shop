const showDescriptionBtn = document.getElementById("show-description-btn");
const itemDescription = document.getElementById("item-description");
const arrowRight = document.querySelector(".arrow-right");
const arrowLeft = document.querySelector(".arrow-left");
const sliderItems = document.querySelectorAll(".slider-item");

let sliderNumber = 0;

showDescriptionBtn.addEventListener("click", function () {

  if(!itemDescription.style || itemDescription.style.display === "none" || !itemDescription.style.display) {
    itemDescription.style.display = "block";
  } else {
    itemDescription.style.display = "none";
  }
});

if(arrowLeft) {

  arrowLeft.addEventListener("click", function() {

    if (!sliderNumber) {
      sliderItems[sliderNumber].style.display = "none";
      sliderNumber = sliderItems.length - 1;
      sliderItems[sliderNumber].style.display = "block";
    } else {
      sliderItems[sliderNumber].style.display = "none";
      sliderNumber -= 1;
      sliderItems[sliderNumber].style.display = "block";
    }
  });
}

if(arrowRight) {
  arrowRight.addEventListener("click", function() {

    if (sliderNumber === sliderItems.length - 1) {
      sliderItems[sliderNumber].style.display = "none";
      sliderNumber = 0;
      sliderItems[sliderNumber].style.display = "block";
    } else {
      sliderItems[sliderNumber].style.display = "none";
      sliderNumber += 1;
      sliderItems[sliderNumber].style.display = "block";
    }
  });
}
