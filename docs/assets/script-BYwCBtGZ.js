(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.getElementById(`btn`),t=document.querySelector(`.category-list`),n=document.querySelectorAll(`.category-list li a`);e.addEventListener(`click`,()=>{t.classList.toggle(`active`)}),n.forEach(e=>{e.addEventListener(`click`,()=>{t.classList.toggle(`active`)})});var r=document.querySelector(`.xmark`),i=document.querySelector(`.fa-bars`),a=document.querySelector(`.nav-links`),o=document.querySelectorAll(`.nav-links li a`);i.addEventListener(`click`,()=>{a.classList.toggle(`active`)}),r.addEventListener(`click`,()=>{a.classList.toggle(`active`)}),o.forEach(e=>{e.addEventListener(`click`,()=>{a.classList.toggle(`active`)})});var s=document.querySelectorAll(`.close-cart`),c=document.querySelector(`.cart`);s.forEach(e=>{e.addEventListener(`click`,()=>{c.classList.toggle(`active`)})});var l=document.querySelector(`.cart-items`);document.addEventListener(`click`,e=>{let t=e.target.closest(`.swiper-slide .div-btn-cart`);if(t){let e=t.closest(`.swiper-slide`);t.closest(`.div-btn-cart`).classList.add(`active`),t.innerHTML=`
                <button type="button"
                    class="btn-cart text-black border-2 border-main  shadow-xs text-[18px] py-[10px] w-full font-semibold cursor-pointer">
                    <i class="fa-solid fa-cart-shopping text-main text-[17px]"></i> Item In cart
                </button>
           `;let n=e.querySelector(`img`).src,r=e.querySelector(`.product-name`).innerText,i=e.querySelector(`.product-price`).innerText,a=Number(i.replace(`$`,``).trim()),o=document.querySelector(`.subtotal-cart`);o.innerText=`$`+a,l.innerHTML+=`
                <div class="cart-item flex items-center gap-3 py-3 border-b border-gray-100">
                    <img src="${n}" alt="product" class="w-18 h-18 object-cover rounded">
                    <div class="flex-1 ps-4">
                        <p class="text-xs font-semibold text-gray-800">${r}</p>
                        <span class="text-gray-500 text-sm font-medium">${i}</span>

                        <div class="flex items-center gap-4 mt-2">
                            <button class="qty-btn musnis"><i class="fa-solid fa-minus"></i></button>
                            <span class="span-bls text-orange-500 font-bold text-sm">1</span>
                            <button class="qty-btn colletion"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                    <button class="delete-btn text-2xl text-gray-400 hover:text-red-500 cursor-pointer"><i
                            class="fa-solid fa-trash"></i></button>
                </div>
        `}u()});function u(){let e=document.querySelector(`.cart-items`),t=document.querySelector(`.shoping-count`),n=document.querySelector(`.cart-count`);t.innerText=e.children.length,n.innerText=e.children.length}document.addEventListener(`click`,e=>{let t=e.target.closest(`.musnis`),n=e.target.closest(`.colletion`);if(t){let e=t.closest(`div`).querySelector(`.span-bls`),n=Number(e.innerText);n>1&&(n--,e.innerText=n)}if(n){let e=n.closest(`div`).querySelector(`.span-bls`),t=Number(e.innerText);t++,e.innerText=t}}),document.addEventListener(`click`,e=>{let t=e.target.closest(`.delete-btn`);t&&(t.closest(`.cart-item`).remove(),u())});