import { showModal } from "../common/show-modal.js";

const radioInputPhone = document.getElementById("contact-phone");
const radioInputEmail = document.getElementById("contact-email");
const radioInputAnother = document.getElementById("contact-another");

const contactFirstNameInput = document.getElementById("first_name");
const contactLastNameInput = document.getElementById("last_name");
const contactPhoneInput = document.getElementById("contact-phone-input");
const contactEmailInput = document.getElementById("contact-email-input");
const contactAnotherInput = document.getElementById("contact-another-input");
const contactRemarkInput = document.getElementById("contact-remark");

const wrapperProductsItem = document.querySelectorAll(".wrapper__products-item");

const buyForm = document.getElementById("buy-form");

if(radioInputAnother.checked) {
    contactAnotherInput.style.display = "block";
}
if(radioInputEmail.checked) {
    contactEmailInput.style.display = "block";
}
if(radioInputPhone.checked) {
    contactPhoneInput.style.display = "block";
}


radioInputPhone.addEventListener("change", function (e) {
    contactEmailInput.style.display = "none";
    contactAnotherInput.style.display = "none";

    contactAnotherInput.value = "";
    contactEmailInput.value = "";

    contactPhoneInput.style.display = "block";
});

radioInputEmail.addEventListener("change", function () {
    contactPhoneInput.style.display = "none";
    contactAnotherInput.style.display = "none";

    contactPhoneInput.value = "";
    contactAnotherInput.value = "";

    contactEmailInput.style.display = "block";
});

radioInputAnother.addEventListener("change", function () {
    contactPhoneInput.style.display = "none";
    contactEmailInput.style.display = "none";

    contactPhoneInput.value = "";
    contactEmailInput.value = "";

    contactAnotherInput.style.display = "block";
});


buyForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    let wrapperProductsItem = document.querySelectorAll(".wrapper__products-item");

    const firstName = contactFirstNameInput.value;
    const lastName = contactLastNameInput.value;
    const phone = contactPhoneInput.value;
    const email = contactEmailInput.value;
    const another = contactAnotherInput.value;

    const products = [];

    for(let i = 0; i < wrapperProductsItem.length; i++) {
        const id = wrapperProductsItem[i].getAttribute("id");
        const countProduct = Number(wrapperProductsItem[i].querySelector(".wrapper__products-item-count").querySelector(".count-product-input").value);

       products.push({ id: id, count: countProduct });
    }

   if(phone.trim()) {
       if((/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im).test(phone)) {
           const api = await fetch("/buy", {
               method: "POST",
               headers: {
                   "Content-Type": "application/json"
               },
               body: JSON.stringify({
                   contact_info: phone,
                   products: products,
                   remark: contactRemarkInput.value,
                   first_name: firstName,
                   last_name: lastName
               })
           });

           if (api.ok) {
               const response = await api.json();
               showModal(response.buy_page_success, "/");
           } else {
               const response = await api.json();
               showModal(response.buy_page_error)
           }
       } else {
           const api = await fetch("/translate/active-language");
           const isoCode = (await api.json()).iso_code;

           if(!isoCode || isoCode === "uk") {
               showModal("Введіть коректний номер телефону");
           } else {
               showModal("Write correct phone number");
           }
       }
   } else if(email.trim()) {
       const api = await fetch("/buy", {
           method: "POST",
           headers: {
               "Content-Type": "application/json"
           },
           body: JSON.stringify({
               contact_info: email,
               products: products,
               remark: contactRemarkInput.value,
               first_name: firstName,
               last_name: lastName
           })
       });

       if (api.ok) {
           const response = await api.json();
           showModal(response.buy_page_success, "/");
       } else {
           const response = await api.json();
           showModal(response.buy_page_error)
       }
   } else if(another.trim()) {
       const api = await fetch("/buy", {
           method: "POST",
           headers: {
               "Content-Type": "application/json"
           },
           body: JSON.stringify({
               contact_info: another,
               products: products,
               remark: contactRemarkInput.value,
               first_name: firstName,
               last_name: lastName
           })
       });

       if (api.ok) {
           const response = await api.json();
           showModal(response.buy_page_success, "/");
       } else {
           const response = await api.json();
           showModal(response.buy_page_error)
       }
   }
});




