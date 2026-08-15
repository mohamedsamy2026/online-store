// Categroy Start
let btnCategory = document.getElementById("btn");
let category_list = document.querySelector(".category-list");
let links = document.querySelectorAll(".category-list li a");

if (btnCategory) {
    btnCategory.addEventListener('click', () => {
        category_list.classList.toggle("active")
    });
}

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

if (bars) {
    bars.addEventListener('click', () => {
        nav_links.classList.toggle("active")
    });
}

if (xmark && nav_links) {
    xmark.addEventListener("click", () => {
        nav_links.classList.toggle("active");
    });
}

if (links_hum && links_hum.length > 0 && nav_links) {
    links_hum.forEach(link => {
        link.addEventListener("click", () => {
            nav_links.classList.toggle("active");
        });
    });
}
// Media Humborger End


//  Loading CSS Start
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.visibility = "hidden";
            loader.style.display = "none";
        }, 500);
    }
});
//  Loading CSS End


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
function showToast(text) {
    let toast = document.getElementById("toast-message");
    if (!toast) return;
    toast.classList.remove("translate-x-[130%]");

    let textSpan = document.querySelector(".text-span");
    if (textSpan) {
        textSpan.innerText = text
    }

    setTimeout(() => {
        toast.classList.add("translate-x-[130%]");
    }, 2500);
}
// Show Aleart End


// Add To Cart Start

const CART_KEY = "my_cart";
const SHIPPING_COST = 0;

// جيب السلة الحالية من التخزين
function getCart() {
    let savedData = localStorage.getItem(CART_KEY);
    return savedData ? JSON.parse(savedData) : [];
}

// احفظ السلة في التخزين، وبعدين حدّث الشاشة
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
}

// دور على منتج بالـ ID بتاعه جوه السلة (بدل الاسم، أدق وأضمن)
function findProductInCart(cart, productId) {
    return cart.find(item => item.id === productId);
}

// ضيف منتج جديد للسلة (أو تجاهله لو موجود بالفعل)
function addToCart(productData) {
    let cart = getCart();
    let alreadyInCart = findProductInCart(cart, productData.id);

    if (alreadyInCart) {
        showToast("هذا المنتج موجود بالفعل في السلة!");
        return;
    }

    let newProduct = {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        img: productData.img,
        qty: 1,
    };

    cart.push(newProduct);
    saveCart(cart);
}

// - OR + 
function changeQty(index, delta) {
    let cart = getCart();
    let product = cart[index];

    if (!product) return;

    product.qty += delta;
    if (product.qty <= 0) {
        product.qty = 1;
    }

    saveCart(cart);
}

// احذف منتج من السلة
function deleteItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);

    // التحقق لو إحنا في صفحة product-details
    const currentPage = window.location.href;
    
    if (currentPage.includes('product-details.html')) {
        setTimeout(() => {
            location.reload();
        }, 300);
    }
}

// احسب إجمالي عدد القطع في السلة
function calculateTotalItems(cart) {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

// احسب السعر الإجمالي (subtotal) للسلة
function calculateSubtotal(cart) {
    let subtotal = 0;
    cart.forEach(item => {
        let cleanPrice = Number(String(item.price).replace('$', '').trim());
        subtotal += cleanPrice * item.qty;
    });
    return subtotal;
}

// ابني كارت HTML لمنتج واحد
function buildProductCardHTML(item, index) {
    let cleanPrice = Number(String(item.price).replace('$', '').trim());

    return `
        <div class="cart-item flex items-center gap-3 py-4 px-5 border-b border-gray-300">
            <img src="${item.img}" alt="product" class="w-18 h-18 object-cover rounded">
            <div class="flex-1 ps-4">
                <p class="text-xs font-semibold text-gray-800">${item.name}</p>
                <span class="price-cart text-gray-500 text-sm font-medium">$${cleanPrice}</span>
                <div class="flex items-center gap-4 mt-2">
                    <button class="qty-btn musnis" data-index="${index}"><i class="fa-solid fa-minus"></i></button>
                    <span class="span-bls text-orange-500 font-bold text-sm">${item.qty}</span>
                    <button class="qty-btn colletion" data-index="${index}"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
            <button class="delete-btn text-2xl text-gray-400 hover:text-red-500 cursor-pointer" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
}

// ابني كل الـ HTML بتاع السلة (كل المنتجات مع بعض)
function buildCartHTML(cart) {
    if (cart.length === 0) {
        return `<p class="text-center py-6 text-gray-500 font-bold">Cart is empty</p>`;
    }
    return cart.map((item, index) => buildProductCardHTML(item, index)).join("");
}

// اطبع الـ HTML في أي مكان موجود في الصفحة الحالية (سلة جانبية أو checkout)
function displayCartHTML(html) {
    let cartDrawer = document.querySelector(".cart-items");
    if (cartDrawer) cartDrawer.innerHTML = html;

    let checkoutSummary = document.querySelector(".order-summary .cards");
    if (checkoutSummary) checkoutSummary.innerHTML = html;
}

// حدّث العدادات والأسعار (فوق الأيقونة، السلة الجانبية)
function updateCartCounters(cart, subtotal) {
    let totalItems = calculateTotalItems(cart);
    let distinctProducts = cart.length;

    let shopIcon = document.querySelector(".shoping-count");
    let totalCountEl = document.querySelector(".total-count");
    let totalPriceEl = document.querySelector(".total-price");

    if (shopIcon) shopIcon.innerText = distinctProducts;
    if (totalCountEl) totalCountEl.innerText = totalItems;
    if (totalPriceEl) totalPriceEl.innerText = "$" + subtotal;
}

// حدّث الأسعار في صفحة الـ Checkout بس (Subtotal / Total)
function updateCheckoutTotals(subtotal) {
    let checkoutSub = document.querySelector("#checkout .held .space-y-3 div:nth-child(1) small");
    let checkoutShipping = document.querySelector("#checkout .held .space-y-3 div:nth-child(2) small");
    let checkoutTotal = document.querySelector("#checkout .held .space-y-3 div:nth-child(3) small");

    if (!checkoutSub && !checkoutTotal) return;

    let shipping = subtotal > 0 ? SHIPPING_COST : 0;
    let totalBeforeDiscount = subtotal + shipping;
    let finalTotal = totalBeforeDiscount;

    let appliedCoupon = JSON.parse(localStorage.getItem("applied_coupon"));

    if (appliedCoupon && appliedCoupon.discountValue) {
        let discountAmount = 0;

        if (appliedCoupon.discountType === 'percent') {
            discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
        } else {
            discountAmount = appliedCoupon.discountValue;
        }

        finalTotal = totalBeforeDiscount - discountAmount;
        if (finalTotal < 0) finalTotal = 0;
    }

    if (checkoutSub) checkoutSub.innerText = "$" + subtotal;
    if (checkoutShipping) checkoutShipping.innerText = "$" + shipping;
    if (checkoutTotal) checkoutTotal.innerText = "$" + finalTotal;
}

// دلوقتي بتعتمد على data-id بدل الاسم، عشان تشتغل صح مع أي منتج حتى لو الأسماء متشابهة
function updateProductButtons(cart) {
    let productCards = document.querySelectorAll(".swiper-slide[data-id]");

    productCards.forEach(card => {
        let productId = card.dataset.id;
        let button = card.querySelector(".btn-cart");
        let divBtnCart = card.querySelector(".div-btn-cart");
        if (!button) return;

        let isInCart = cart.some(item => String(item.id) === String(productId));

        if (isInCart) {
            setButtonAsInCart(button, divBtnCart);
        } else {
            setButtonAsAddToCart(button, divBtnCart);
        }
    });
}

function setButtonAsInCart(button, divBtnCart) {
    if (divBtnCart) divBtnCart.classList.add("active");
    button.innerHTML = `<i class="fa-solid fa-cart-shopping text-main text-[17px]"></i> Item In cart`;
    button.className = "btn-cart text-black border-2 border-main shadow-xs text-[18px] py-[10px] w-full font-semibold cursor-pointer";
}

function setButtonAsAddToCart(button, divBtnCart) {
    if (divBtnCart) divBtnCart.classList.remove("active");
    button.innerHTML = `<i class="fa-solid fa-cart-shopping text-[16px]"></i> Add to cart`;
    button.className = "btn-cart text-white shadow-xs text-[17px] font-semibold cursor-pointer w-full h-full";
}

// الدالة الرئيسية اللي بتجمع كل حاجة وترسم الشاشة كاملة
function renderCart() {
    let cart = getCart();
    let subtotal = calculateSubtotal(cart);

    let html = buildCartHTML(cart);
    displayCartHTML(html);

    updateCartCounters(cart, subtotal);
    updateCheckoutTotals(subtotal);
    updateProductButtons(cart);
}
window.renderCart = renderCart;


// EVENTS

// لحظه المستخدم يدوس علي زرار اضافه منتج الي السله 
document.addEventListener("click", (event) => {
    let button = event.target.closest(".swiper-slide .div-btn-cart");
    if (!button) return;

    let productCard = button.closest(".swiper-slide");
    let productData = {
        id: productCard.dataset.id,
        name: productCard.querySelector(".product-name").innerText,
        price: productCard.querySelector(".product-price").innerText,
        img: productCard.querySelector("img").src
    };

    addToCart(productData);
});

// دوس على +  أو  -  أو حذف
document.addEventListener("click", (event) => {
    let minusBtn = event.target.closest(".musnis");
    let plusBtn = event.target.closest(".colletion");
    let deleteBtn = event.target.closest(".delete-btn");

    if (minusBtn) changeQty(Number(minusBtn.dataset.index), -1);
    if (plusBtn) changeQty(Number(plusBtn.dataset.index), 1);
    if (deleteBtn) deleteItem(Number(deleteBtn.dataset.index));
});

// لو تاب تاني (زي صفحة الـ checkout) اتغير فيه الـ localStorage، حدّث نفسك فوراً
window.addEventListener("storage", (event) => {
    if (event.key === CART_KEY) {
        renderCart();
    }
});

// أول ما الصفحة تحمل، ارسم السلة من البيانات المخزنة
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});

// Add To Cart End


// Search Start
let iconSearch = document.querySelector(".icon-search");
let inputSearch = document.querySelector(".inputSearch");

function search() {
    let cardsSearch = document.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)");
    let inputValue = inputSearch.value.trim().toLocaleLowerCase();

    if (inputValue !== "") {
        document.querySelectorAll('.products-swiper').forEach(swiperEl => {
            if (swiperEl.swiper && swiperEl.swiper.autoplay) {
                swiperEl.swiper.autoplay.stop();
            }
            let wrapper = swiperEl.querySelector('.swiper-wrapper');
            if (wrapper) {
                wrapper.style.display = "grid";
                wrapper.style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
                wrapper.style.gap = "20px 0";
                wrapper.style.transform = "none !important";
            }
        });
    }

    cardsSearch.forEach(card => {
        let productElement = card.querySelector(".product-name");
        if (productElement) {
            let productName = productElement.textContent.trim().toLocaleLowerCase();
            card.style.display = productName.includes(inputValue) ? "block" : "none";
        }
    });
}

function resetSearchAndSwiper() {
    let cardsSearch = document.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)");
    cardsSearch.forEach(card => { card.style.display = ""; });

    document.querySelectorAll('.products-swiper').forEach(swiperEl => {
        let wrapper = swiperEl.querySelector('.swiper-wrapper');
        if (wrapper) {
            wrapper.style.display = "";
            wrapper.style.flexWrap = "";
            wrapper.style.transform = "";
        }
        if (swiperEl.swiper) {
            swiperEl.swiper.update();
            if (swiperEl.swiper.autoplay) swiperEl.swiper.autoplay.start();
        }
    });
}

if (inputSearch) {
    inputSearch.addEventListener("input", search);
    inputSearch.addEventListener("blur", resetSearchAndSwiper);
    inputSearch.addEventListener("input", () => {
        if (inputSearch.value.trim() === "") resetSearchAndSwiper();
    });
}

if (iconSearch) {
    iconSearch.addEventListener("click", search);
}
// Search End