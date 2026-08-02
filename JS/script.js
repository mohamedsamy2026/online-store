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




// Carts Start


// Close Cart Start
let close = document.querySelectorAll(".close-cart");
let cart = document.querySelector(".cart");


close.forEach(element => {
    element.addEventListener("click", () => {
        cart.classList.toggle("active")
    })

})
// Close Cart End


// Add To Cart Start
let items = [];
let cards = document.querySelector(".cart-items");

document.addEventListener("click", (event) => {
    let button = event.target.closest(".swiper-slide .div-btn-cart");


    if (button) {

        let productCard = button.closest(".swiper-slide");


        let div = button.closest(".div-btn-cart");
        div.classList.add("active")

        button.innerHTML = `
                <button type="button"
                    class="btn-cart text-black border-2 border-main  shadow-xs text-[18px] py-[10px] w-full font-semibold cursor-pointer">
                    <i class="fa-solid fa-cart-shopping text-main text-[17px]"></i> Item In cart
                </button>
           `;

        // تعريفات 
        let productImg = productCard.querySelector("img").src;
        let productName = productCard.querySelector(".product-name").innerText;
        let productPrice = productCard.querySelector(".product-price").innerText;

        let productPrice_number = Number(productPrice.replace('$', '').trim());
        
        let subtotal_cart = document.querySelector(".subtotal-cart");
        subtotal_cart.innerText =  "$"+ productPrice_number;


        cards.innerHTML +=
            `
                <div class="cart-item flex items-center gap-3 py-3 border-b border-gray-100">
                    <img src="${productImg}" alt="product" class="w-18 h-18 object-cover rounded">
                    <div class="flex-1 ps-4">
                        <p class="text-xs font-semibold text-gray-800">${productName}</p>
                        <span class="text-gray-500 text-sm font-medium">${productPrice}</span>

                        <div class="flex items-center gap-4 mt-2">
                            <button class="qty-btn musnis"><i class="fa-solid fa-minus"></i></button>
                            <span class="span-bls text-orange-500 font-bold text-sm">1</span>
                            <button class="qty-btn colletion"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <button class="delete-btn text-2xl text-gray-400 hover:text-red-500 cursor-pointer"><i
                            class="fa-solid fa-trash"></i></button>
                </div>
        `
    }



    updateCount()

});


// Count
function updateCount() {
    let cards = document.querySelector(".cart-items");
    let shop = document.querySelector(".shoping-count");
    let cart_count = document.querySelector(".cart-count");

    shop.innerText = cards.children.length;
    cart_count.innerText = cards.children.length;
}


// - or +

document.addEventListener("click", (event) => {

    let munis = event.target.closest(".musnis");
    let colletion = event.target.closest(".colletion");

    if (munis) {
        let container = munis.closest("div");
        let span = container.querySelector(".span-bls");
        let spanNumber = Number(span.innerText)


        if (spanNumber > 1) {
            spanNumber--;
            span.innerText = spanNumber

        }

    }
    if (colletion) {
        let container = colletion.closest("div");
        let span = container.querySelector(".span-bls");
        let spanNumber = Number(span.innerText)

        spanNumber++;
        span.innerText = spanNumber

    }

})

document.addEventListener("click", (event) => {
    let Delete = event.target.closest(".delete-btn");

    if (Delete) {
        let father = Delete.closest(".cart-item");
        father.remove()
        updateCount()

    }
})





// Add To Cart End


// Carts End
