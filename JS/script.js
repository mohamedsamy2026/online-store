// Import Flowbite
import 'flowbite';
import { initFlowbite } from 'flowbite';
initFlowbite();



// Categroy Start
let btnCategory = document.getElementById("btn");
let category_list = document.querySelector(".category-list");

btnCategory.addEventListener("click", () => {
    category_list.classList.toggle("active")
})
// Categroy End



// Cart Start
let close = document.querySelectorAll(".close-cart");
let cart = document.querySelector(".cart");


close.forEach(element => {
    element.addEventListener("click", () => {
        cart.classList.toggle("active")
    })

})
// Cart End