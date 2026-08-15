import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://vjvrpabmbereiegvsmam.supabase.co';
const supabaseAnonKey = 'sb_publishable_L7q3xMc8uZfpDBDzz02iMg_TaZ3Ta9o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function loadAllProducts() {
    try {
        let allProducts = [];

        // 1. محاولة جلب المنتجات من Supabase أولاً
        const { data: supabaseProducts, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && supabaseProducts && supabaseProducts.length > 0) {
            // نجاح: تحويل الأسماء لتطابق كود العرض الخاص بك
            allProducts = supabaseProducts.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                old_price: p.old_price,
                Imgs: p.image_url,       // تحويل image_url إلى Imgs
                catetory: p.category     // تحويل category إلى catetory
            }));
        } else {
            // 2. إذا كانت Supabase فارغة أو بها خطأ، نقرأ من ملف JSON كملاذ أخير
            try {
                // في Vite، ملفات مجلد public تُخدم من الجذر مباشرة، لذا المسار هو /products.json
                const response = await fetch('products.json');
                
                // نتأكد أن الاستجابة ناجحة وأنها فعلاً JSON وليست صفحة HTML
                if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
                    const jsonProducts = await response.json();
                    allProducts = jsonProducts.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        old_price: p.old_price,
                        Imgs: p.Imgs,
                        catetory: p.catetory
                    }));
                }
            } catch (jsonError) {
                console.warn("لم يتم العثور على products.json أو حدث خطأ في قراءته (هذا طبيعي إذا كنت تعتمد على Supabase فقط)");
            }
        }

        // 3. كود العرض الأصلي الخاص بك (لم نغير فيه شيئاً)
        let cart = JSON.parse(localStorage.getItem("my_cart")) || [];

        // تفريغ المحتوى القديم لتجنب التكرار
        document.querySelectorAll('.products1, .products2, .products3, .products4').forEach(el => {
            if(el) el.innerHTML = '';
        });

        allProducts.forEach(element => {
            let isInCart = cart.some(item => item.id === element.id);

            let btnHTML = isInCart ? `
                <div class="div-btn-cart active mt-2 bg-main w-full font-bold text-center py-[10px] rounded-sm hover:scale-105 duration-300 cursor-pointer">
                    <button type="button" class="btn-cart text-black border-2 border-main shadow-xs text-[18px] py-[10px] w-full font-semibold cursor-pointer">
                        <i class="fa-solid fa-cart-shopping text-main text-[17px]"></i> Item In cart
                    </button>
                </div>
            ` : `
                <div class="div-btn-cart cursor-pointer mt-2 bg-main w-full font-bold text-center py-[10px] rounded-sm hover:scale-105 duration-300">
                    <button type="button" class="btn-cart text-white shadow-xs text-[14px] md:text-[17px] font-semibold cursor-pointer w-full h-full py-[3px] px-[3px]">
                        <i class="fa-solid fa-cart-shopping text-[14px] md:text-[16px]"></i> Add to cart
                    </button>
                </div>
            `;

            let over = element.old_price ? Math.round(((element.old_price - element.price) / element.old_price) * 100) : "";

            let productHTML = `
                <div data-id="${element.id}"
                    class="swiper-slide relative max-w-sm p-6 border-2 border-border rounded-base shadow-xl group flex flex-col justify-between h-[500px]">
                    <div>
                        ${element.old_price ? `
                        <span class="over absolute top-2 right-0 bg-red-500 text-white text-xs font-bold ps-7 px-4 py-1.5 shadow-md">
                            ${over}%
                        </span>` : ''}

                      <a href="HTML/product-details.html?id=${element.id}" class="h-48 flex items-center justify-center mb-6 overflow-hidden">
                            <img class="product-img max-h-full max-w-full object-contain group-hover:scale-110 duration-200"
                                src="${element.Imgs}" alt="product image" />
                        </a>

                        <div class="start flex items-center space-x-3 mb-4">
                            <div class="flex items-center space-x-1 rtl:space-x-reverse text-orange-400">
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                                <i class="fa-solid fa-star"></i>
                            </div>
                        </div>
                        <a href="HTML/product-details.html?id=${element.id}" class="hover:underline duration-200">
                            <h5 class="product-name text-sm md:text-xl text-heading font-semibold tracking-tight line-clamp-2">
                                ${element.name}
                            </h5>
                        </a>
                    </div>

                    <div>
                        <div class="py-3">
                            <p class="text-main text-[20px] md:text-2xl font-bold">
                                <span class="product-price">$${element.price}</span>
                                ${element.old_price ? `<span class="product-old-price text-sm text-p line-through">$${element.old_price}</span>` : ''}
                            </p>
                        </div>
                      ${btnHTML}
                    </div>
                </div>
            `;

            if (element.old_price) {
                let swiper_wrapper1 = document.querySelector(".products1");
                if (swiper_wrapper1) swiper_wrapper1.innerHTML += productHTML;
            }

            if (element.catetory === "electronics") {
                let swiper_wrapper2 = document.querySelector(".products2");
                if (swiper_wrapper2) swiper_wrapper2.innerHTML += productHTML;
            }
            else if (element.catetory === "appliances") {
                let swiper_wrapper3 = document.querySelector(".products3");
                if (swiper_wrapper3) swiper_wrapper3.innerHTML += productHTML;
            }
            else if (element.catetory === "mobiles") {
                let swiper_wrapper4 = document.querySelector(".products4");
                if (swiper_wrapper4) swiper_wrapper4.innerHTML += productHTML;
            }
        });

        if (window.renderCart) window.renderCart();

    } catch (error) {
        console.error("Error loading products:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadAllProducts);