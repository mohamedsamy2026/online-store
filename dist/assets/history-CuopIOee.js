import{n as e}from"./script-supabase-mQZBxK4s.js";/* empty css                */var t=document.getElementById(`orders-container`),n=document.getElementById(`empty-state`),r=document.getElementById(`total-orders-count`),i=document.getElementById(`search-input`),a={pending:{bg:`bg-amber-50`,text:`text-amber-700`,border:`border-amber-200`,dot:`bg-amber-500`,icon:`fa-hourglass-half`,label1:`Pending`,label2:`Processing`},shipping:{bg:`bg-blue-50`,text:`text-blue-700`,border:`border-blue-200`,dot:`bg-blue-500`,icon:`fa-truck-fast`,label1:`Shipping`,label2:`In Transit`},delivered:{bg:`bg-emerald-50`,text:`text-emerald-700`,border:`border-emerald-200`,dot:`bg-emerald-500`,icon:`fa-circle-check`,label1:`Delivered`,label2:`Done`}};function o(e){return new Date(e).toLocaleDateString(`en-US`,{year:`numeric`,month:`short`,day:`numeric`,hour:`2-digit`,minute:`2-digit`})}function s(e){return Number(e).toLocaleString(`en-US`)}function c(e){let t=a[e.status]||a.pending,n=e.id.substring(0,8),r=o(e.created_at),i=e.status===`shipping`?`border-orange-200/60`:`border-gray-200`,c=e.order_items.map((e,t)=>`
          <div class="flex items-center md:flex-row flex-col md:justify-between gap-4 py-2 ${t>0?`border-t-2 border-gray-200 pt-4 mt-2`:``}">
            <div class="flex items-center flex-col md:flex-row gap-3 md:gap-4 flex-1">
              <div class="group cursor-pointer w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 shrink-0 shadow-inner overflow-hidden">
                <img src="${e.image&&e.image.trim()!==``?e.image:`../public/Imgs/product/0.png`}" class="group-hover:scale-110 transition-transform duration-300 w-full h-full object-contain" alt="${e.name}">
              </div>
              <div>
                <h4 class="font-bold text-black lg:text-lg hover:text-orange-600 transition-colors cursor-pointer">${e.name}</h4>
                <p class="text-heading text-[15px] md:text-sm mt-1 flex items-center gap-3">
                  <span><i class="fa-solid fa-layer-group text-heading"></i> Qty: <strong class="text-heading">${e.quantity}</strong></span>
                </p>
              </div>
            </div>
            <div class="text-center md:text-right">
              <span class="font-black text-main text-[20px] md:text-[23px] block">${e.price} $</span>
            </div>
          </div>
        `).join(``),l=e.coupon_code?`
        <div class="flex justify-between text-[15px]">
          <span class="ps-8">Coupon <strong class="text-main">(${e.coupon_code}):</strong></span>
          <span class="font-black text-blue-500 text-[16px]">${e.discount_amount} $</span>
        </div>
      `:``,u=e.governorate&&e.governorate!==`غير محدد`?`${e.governorate} - ${e.address}`:e.address||`N/A`;return`
        <div class="bg-white rounded-2xl shadow-sm border ${i} overflow-hidden hover:shadow-md transition-all duration-300 mb-16 mt-10">
          <div class="bg-gray-100 px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex flex-col md:flex-row space-y-3 md:justify-between items-center gap-3 md:gap-4">
            <div class="flex flex-wrap items-center gap-3 md:gap-6 space-x-6">
              <div>
                <span class="text-[14px] font-bold text-gray-600 mb-2 block">Order ID</span>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-[16px] font-black text-black">#${n}</span>
                </div>
              </div>
              <div class="h-14 w-[1.5px] bg-gray-400"></div>
              <div>
                <span class="text-[14px] font-bold text-gray-600 block">Order Date</span>
                <span class="text-[16px] font-bold text-black mt-0.5 block">${r}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="${t.bg} ${t.text} text-[14px] font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-xl border ${t.border} flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full ${t.dot} animate-pulse"></span>
                <i class="fa-solid ${t.icon}"></i>
                <span>${t.label1}</span>
                <span>${t.label2}</span>
              </span>
            </div>
          </div>

          <div class="p-4 md:p-6">
            ${c}
          </div>

          <div class="px-4 md:px-6 py-4 border-t-2 border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-100 p-3 rounded-xl border border-gray-200 space-y-4">
              <h5 class="text-[18px] font-bold text-heading uppercase mb-3 flex items-center gap-1 border-gray-300 border-b-2 pb-2">
                <i class="fa-solid fa-truck text-orange-500"></i> Shipping
              </h5>
              <div class="flex justify-between items-center">
                <p class="text-[16px] text-black font-bold ps-7">Name:</p>
                <span class="text-blue-500">${e.customer_name}</span>
              </div>
              <div class="flex justify-between items-center">
                <p class="text-[16px] text-black font-bold ps-7">Address:</p>
                <!-- ✅ السطر ده تم تصليحه ليكون كاملاً ويعرض العنوان بدون قص -->
                <span class="text-blue-500 text-right break-words" title="${u}">${u}</span>
              </div>
            </div>

            <div class="bg-gray-100 p-3 rounded-xl border border-gray-200">
              <h5 class="text-[18px] font-bold text-heading uppercase mb-2 flex items-center gap-1 border-gray-300 border-b-2 pb-2">
                <i class="fa-solid fa-receipt text-orange-500"></i> Summary
              </h5>
              <div class="space-y-4 mt-3">
                <div class="flex justify-between text-black text-[15px]">
                  <span class="ps-8">Subtotal:</span>
                  <span class="font-bold text-[16px] text-black text-blue-500">${s(e.subtotal)} $</span>
                </div>
                ${l}
                <div class="flex justify-between text-black text-[15px]">
                  <span class="ps-8">Shipping:</span>
                  <span class="font-bold text-[16px] text-black text-blue-500">${e.shipping} $</span>
                </div>
                <div class="flex justify-between text-blue-500 text-[18px]">
                  <span class="ps-8">Total:</span>
                  <span class="text-[18px] text-black text-blue-800">${s(e.total)} $</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `}async function l(){let{data:{user:i},error:a}=await e.auth.getUser();if(a||!i){t.innerHTML=`<p class="text-center text-red-500 py-10">Please log in to view your orders.</p>`,n.classList.add(`hidden`);return}try{let{data:a,error:o}=await e.from(`orders`).select(`*, order_items (*)`).eq(`user_id`,i.id).order(`created_at`,{ascending:!1});if(o)throw o;if(!a||a.length===0){t.innerHTML=``,n.classList.remove(`hidden`),r.textContent=`0`;return}n.classList.add(`hidden`),r.textContent=a.length,t.innerHTML=a.map(c).join(``)}catch(e){console.error(`Error fetching orders:`,e),t.innerHTML=`<p class="text-center text-red-500 py-10 text-2xl">Error loading orders.</p>`}}i&&i.addEventListener(`input`,e=>{let n=e.target.value.toLowerCase();t.querySelectorAll(`.bg-white.rounded-2xl`).forEach(e=>{e.style.display=e.textContent.toLowerCase().includes(n)?``:`none`})}),document.addEventListener(`DOMContentLoaded`,l);