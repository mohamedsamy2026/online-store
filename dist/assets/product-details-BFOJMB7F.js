import{t as e}from"./script-supabase-cbC8D82C.js";import"./swiper-Dv_Ousrl.js";/* empty css                */var t=[],n=document.getElementById(`product-content`),r=document.getElementById(`detail-img`),i=document.getElementById(`detail-name`),a=document.getElementById(`detail-category`),o=document.getElementById(`detail-price`),s=document.getElementById(`detail-old-price`),c=document.getElementById(`detail-desc`),l=document.querySelector(`.products1`),u=document.getElementById(`products1`);fetch(`../products.json`).then(e=>e.json()).then(l=>{t=l;let u=new URLSearchParams(window.location.search),f=parseInt(u.get(`id`)),p=l.find(e=>e.id===f);if(p){n.classList.remove(`hidden`),r.src=`../${p.Imgs}`,i.textContent=p.name,a.textContent=p.catetory.toUpperCase(),o.textContent=`$${p.price}`,p.old_price?(s.textContent=`$${p.old_price}`,s.classList.remove(`hidden`)):s.classList.add(`hidden`),c.textContent=p.description,d(p);let t=document.getElementById(`details-add-to-cart`);t&&((JSON.parse(localStorage.getItem(`my_cart`))||[]).some(e=>e.id===p.id)&&(t.innerHTML=`<i class="fa-solid fa-cart-shopping text-main text-[17px]"></i> Item In cart`,t.className=`w-full bg-white py-4 cursor-pointer px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-3 shadow-lg mt-6 border-2 border-main text-black`),t.addEventListener(`click`,()=>{let n={id:p.id,name:p.name,price:p.price,img:p.Imgs},r=JSON.parse(localStorage.getItem(`my_cart`))||[];if(r.find(e=>e.id===p.id)){e(`هذا المنتج موجود بالفعل في السلة!`,`error`);return}r.push({id:n.id,name:n.name,price:n.price,img:`../`+p.Imgs,qty:1}),localStorage.setItem(`my_cart`,JSON.stringify(r)),document.querySelectorAll(`.shoping-count, .total-count`).forEach(e=>{e.textContent=r.length}),t.innerHTML=`<i class="fa-solid fa-cart-shopping text-main text-[17px]"></i> Item In cart`,t.className=`w-full bg-white py-4 cursor-pointer px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-3 shadow-lg mt-6 border-2 border-main text-black`,setTimeout(()=>{location.reload()},300)}))}else n.innerHTML=`<p class="text-red-500 font-bold text-xl text-center py-20">عذراً، لم يتم العثور على هذا المنتج.</p>`}).catch(e=>console.error(`Error loading products:`,e));function d(e){let n=t.filter(t=>t.catetory===e.catetory&&t.id!==e.id).slice(0);if(n.length===0){u&&(u.style.display=`none`);return}u&&(u.style.display=`block`);let r=u.querySelector(`.title-h2`);r&&(r.innerHTML=`<i class="fa-solid fa-tags"></i> ${e.catetory.toUpperCase()}`),l.innerHTML=n.map(e=>{let t=e.old_price?Math.round((e.old_price-e.price)/e.old_price*100):``;return`
        <div data-id="${e.id}" class="swiper-slide relative max-w-sm p-6 border-2 border-border rounded-base shadow-xl group flex flex-col justify-between h-[500px]">
            <div>
                ${e.old_price?`
                <span class="over absolute top-2 right-0 bg-red-500 text-white text-xs font-bold ps-7 px-4 py-1.5 shadow-md">
                    ${t}%
                </span>`:``}

                <a href="product-details.html?id=${e.id}" class="h-48 flex items-center justify-center mb-6 overflow-hidden">
                    <img class="product-img max-h-full max-w-full object-contain group-hover:scale-110 duration-200"
                        src="${e.Imgs.startsWith(`http`)?e.Imgs:`../`+e.Imgs}" alt="${e.name}" />
                </a>

                <div class="start flex items-center space-x-3 mb-4">
                    <div class="flex items-center space-x-1 rtl:space-x-reverse text-orange-400">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                </div>

                <a href="product-details.html?id=${e.id}" class="hover:underline duration-200 block">
                    <h5 class="product-name text-sm md:text-xl text-heading font-semibold tracking-tight line-clamp-2">
                        ${e.name}
                    </h5>
                </a>
            </div>

            <div>
                <div class="py-3">
                    <p class="text-main text-[20px] md:text-2xl font-bold">
                        <span class="product-price">$${e.price}</span>
                        ${e.old_price?`<span class="product-old-price text-sm text-p line-through">$${e.old_price}</span>`:``}
                    </p>
                </div>
                
                <a href="product-details.html?id=${e.id}" class="block mt-2 bg-main w-full font-bold text-center py-[10px] rounded-sm hover:scale-105 duration-300 text-white">
                    View Details
                </a>
            </div>
        </div>
        `}).join(``)}