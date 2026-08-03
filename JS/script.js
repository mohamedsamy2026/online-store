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


window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    if (loader) {
        loader.style.opacity = "0";
        loader.style.visblity = "hidden";
        loader.style.transition = "opacity 0.5s ease";
        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }
});


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




// Show Aleart Start
function showToast() {
    let toast = document.getElementById("toast-message");

    toast.classList.toggle("translate-x-[120%]");

    setTimeout(() => {
        toast.classList.toggle("translate-x-[120%]");
    }, 2500);
}
// Show Aleart End


let cards = document.querySelector(".cart-items");

// Add To Cart Start
document.addEventListener("click", (event) => {
    let button = event.target.closest(".swiper-slide .div-btn-cart");


    if (button) {

        let productCard = button.closest(".swiper-slide");

        let productname = productCard.querySelector(".product-name").innerText;
        let cardsitems = document.querySelectorAll(".cart-item");
        let isAlreadyInCart = false;

        cardsitems.forEach(card => {
            let itemTitle = card.querySelector("p").innerText;
            if (itemTitle == productname) {
                isAlreadyInCart = true;
            }

        });
        if (isAlreadyInCart) {
            showToast()
            return;
        }




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


        cards.innerHTML +=
            `
                <div class="cart-item flex items-center gap-3 py-3 border-b border-gray-100">
                    <img src="${productImg}" alt="product" class="w-18 h-18 object-cover rounded">
                    <div class="flex-1 ps-4">
                        <p class="text-xs font-semibold text-gray-800">${productName}</p>
                        <span class="price-cart text-gray-500 text-sm font-medium">${productPrice}</span>

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



    updateCount();
    setitem();

});
// Add To Cart End


// Count And price Start
function updateCount() {

    let cards2 = document.querySelector(".cart-items");
    let cards = document.querySelectorAll(".cart-item");
    let shop = document.querySelector(".shoping-count")
    let totalCountEl = document.querySelector(".total-count");
    let totalPriceEl = document.querySelector(".total-price");

    if (!cards) return;




    let totalItemsCount = 0;
    let totalMoney = 0;

    cards.forEach(item => {

        let quantity = Number(item.querySelector(".span-bls").innerText);
        let priceText = item.querySelector(".price-cart").innerText;
        let price = Number(priceText.replace('$', '').trim());

        totalItemsCount += quantity;
        totalMoney += price * quantity;
    });

    if (totalCountEl) {
        totalCountEl.innerText = totalItemsCount;
        shop.innerText = cards2.children.length;
    }

    if (totalPriceEl) {
        totalPriceEl.innerText = "$" + totalMoney;
    }
    setitem()
}
// Count And price End


// - or + Start
document.addEventListener("click", (event) => {

    let munis = event.target.closest(".musnis");
    let colletion = event.target.closest(".colletion");

    if (munis) {
        let container = munis.closest("div");
        let span = container.querySelector(".span-bls");
        let spanNumber = Number(span.innerText);

        if (spanNumber > 1) {
            spanNumber--;
            span.innerText = spanNumber;

            updateCount();
        }
    }

    if (colletion) {
        let container = colletion.closest("div");
        let span = container.querySelector(".span-bls");
        let spanNumber = Number(span.innerText);

        spanNumber++;
        span.innerText = spanNumber;

        updateCount();
    }
    setitem()

});
// - or + End


// Delete Start
document.addEventListener("click", (event) => {
    let Delete = event.target.closest(".delete-btn");

    if (Delete) {
        let father = Delete.closest(".cart-item");
        father.remove()
        updateCount()

    }

    let cartItemsText = localStorage.getItem("cards") || "";
    let productButtons = document.querySelectorAll(".btn-cart");

    productButtons.forEach(button => {
        let productCard = button.closest(".swiper-slide");
        let productName = productCard ? productCard.querySelector(".product-name").textContent.trim() : "";

        let divBtnCart = button.closest(".div-btn-cart");

        if (cartItemsText.includes(productName)) {
            if (divBtnCart) divBtnCart.classList.add("active");

            button.innerHTML = `
            <i class="fa-solid fa-cart-shopping text-main text-[17px]"></i> Item In cart
        `;
            button.className = "btn-cart text-black border-2 border-main shadow-xs text-[18px] py-[10px] w-full font-semibold cursor-pointer";
        }
        else {
            if (divBtnCart) divBtnCart.classList.remove("active");

            button.innerHTML = `
            <i class="fa-solid fa-cart-shopping text-[16px]"></i> Add to cart
        `;
            button.className = "btn-cart text-white shadow-xs text-[17px] font-semibold cursor-pointer w-full h-full";
        }
    });
    setitem()
})
// Delete End



// Carts End


// LocalStorge Start
function setitem() {
    let cardsContainer = document.querySelector(".cart-items");
    localStorage.setItem("cards", cardsContainer.innerHTML);
}


function getitem() {
    let cardsContainer = document.querySelector(".cart-items");
    let getcard = localStorage.getItem("cards");

    if (getcard) {
        cardsContainer.innerHTML = getcard;
        updateCount();
    }
}


// LocalStorge End
// Search Start

// Search Start

let iconSearch = document.querySelector(".icon-search");
let inputSearch = document.querySelector(".inputSearch");

// Search Start
function search() {
    let cardsSearch = document.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)");
    let inputValue = inputSearch.value.trim().toLocaleLowerCase();

    if (inputValue !== "") {
        document.querySelectorAll('.products-swiper').forEach(swiperEl => {
            if (swiperEl.swiper && swiperEl.swiper.autoplay) {
                swiperEl.swiper.autoplay.stop();
            }
            // بنجبر الـ swiper إنه يبطل يحرك الكروت ويسمح بظهورها كلها
            let wrapper = swiperEl.querySelector('.swiper-wrapper');
            if (wrapper) {
                wrapper.style.display = "flex";
                wrapper.style.justifyContent = "center";
                wrapper.style.flexWrap = "wrap";
                wrapper.style.gap = "20px";
                wrapper.style.transform = "none !important";
            }
        });
    }

    // 2. البحث في كل الكروت (الظاهرة والمخفية)
    cardsSearch.forEach(card => {
        let productElement = card.querySelector(".product-name");
        if (productElement) {
            let productName = productElement.textContent.trim().toLocaleLowerCase();
            if (productName.includes(inputValue)) {
                card.style.display = "block"; // بنجبر الكارت المطابق إنه يظهر حتى لو كان مخفي جوه السايبر
            } else {
                card.style.display = "none";
            }
        }
    });
}
// Search End


// Restart Start
function resetSearchAndSwiper() {
    let cardsSearch = document.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)");
    cardsSearch.forEach(card => {
        card.style.display = "";
    });

    // إعادة السايبر لطبيعته وتشغيله تاني
    document.querySelectorAll('.products-swiper').forEach(swiperEl => {
        let wrapper = swiperEl.querySelector('.swiper-wrapper');
        if (wrapper) {
            wrapper.style.display = "";
            wrapper.style.flexWrap = "";
            wrapper.style.transform = "";
        }

        if (swiperEl.swiper) {
            swiperEl.swiper.update();
            if (swiperEl.swiper.autoplay) {
                swiperEl.swiper.autoplay.start();
            }
        }
    });
}
// Restart End


if (inputSearch) {
    inputSearch.addEventListener("input", search);

    inputSearch.addEventListener("blur", resetSearchAndSwiper);
    inputSearch.addEventListener("input", () => {
        if (inputSearch.value.trim() === "") {
            resetSearchAndSwiper();
        }
    });
}


if (iconSearch) {
    iconSearch.addEventListener("click", search);
}

// Search End
// Search End


getitem();