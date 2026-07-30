// Import Flowbite
import 'flowbite';
import { initFlowbite } from 'flowbite';
initFlowbite();



// Categroy Start
let btnCategory = document.getElementById("btn");
let category_list = document.querySelector(".category-list");
let links = document.querySelectorAll(".category-list li a");


btnCategory.addEventListener("click", () => {
    category_list.classList.toggle("active")
})

links.forEach(link => {
    link.addEventListener("click", () => {
        category_list.classList.toggle("active")
    })
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


// Media Humborger Start
let xmark = document.querySelector(".xmark");
let bars = document.querySelector(".fa-bars");
let nav_links = document.querySelector(".nav-links");
let links_hum = document.querySelectorAll(".nav-links li a");


bars.addEventListener("click", () => {
    nav_links.classList.toggle("active")
})

xmark.addEventListener("click", () => {
    nav_links.classList.toggle("active")
})

links_hum.forEach(link => {
    link.addEventListener("click", () => {
        nav_links.classList.toggle("active")
    })
})
// Media Humborger End




