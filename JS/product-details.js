let allProductsData = [];
import { showToast } from './script-supabase.js';

const content = document.getElementById('product-content');
const detailImg = document.getElementById('detail-img');
const detailName = document.getElementById('detail-name');
const detailCategory = document.getElementById('detail-category');
const detailPrice = document.getElementById('detail-price');
const detailOldPrice = document.getElementById('detail-old-price');
const detailDesc = document.getElementById('detail-desc');
const relatedContainer = document.querySelector('.products1');
const relatedSection = document.getElementById('products1');

// 1. جلب البيانات وعرضها
fetch('../products.json')
    .then(response => response.json())
    .then(data => {
        allProductsData = data;
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = data.find(p => p.id === productId);

        if (product) {
            content.classList.remove('hidden');

            // عرض تفاصيل المنتج الرئيسي
            detailImg.src = `../${product.Imgs}`;
            detailName.textContent = product.name;
            detailCategory.textContent = product.catetory.toUpperCase();
            detailPrice.textContent = `$${product.price}`;

            if (product.old_price) {
                detailOldPrice.textContent = `$${product.old_price}`;
                detailOldPrice.classList.remove('hidden');
            } else {
                detailOldPrice.classList.add('hidden');
            }

            detailDesc.textContent = product.description;

            // عرض المنتجات ذات الصلة
            renderRelatedProducts(product);




            // ==========================================
            // زرار إضافة للسلة مع Refresh
            // ==========================================
            const detailsAddBtn = document.getElementById('details-add-to-cart');

            if (detailsAddBtn && product) {
                // دالة مساعدة لتحديث شكل الزر (عشان نستخدمها في التحميل وعند الضغط)
                const updateButtonUI = (isInCart) => {
                    if (isInCart) {
                        detailsAddBtn.innerHTML = '<i class="fa-solid fa-cart-shopping text-main text-[17px]"></i> Item In cart';
                        detailsAddBtn.className = 'w-full bg-white py-4 cursor-default px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-3 shadow-lg mt-6 border-2 border-main text-black';
                        // ملاحظة: غيرت cursor-pointer إلى cursor-default عشان المستخدم يحس إنه مضاف فعلاً
                    } else {
                        detailsAddBtn.innerHTML = '<i class="fa-solid fa-cart-shopping text-[14px] md:text-[16px]"></i> Add to cart';
                        detailsAddBtn.className = 'w-full bg-main text-white py-4 cursor-pointer px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-3 shadow-lg mt-6 hover:bg-orange-500 duration-300';
                    }
                };

                // 1. التحقق فوراً عند تحميل الصفحة (هنا كان الخلل)
                const cart = JSON.parse(localStorage.getItem('my_cart')) || [];
                // الحل السحري: تحويل الاثنين لنصوص لضمان المقارنة الصحيحة حتى لو النوع مختلف
                const isInCart = cart.some(item => String(item.id) === String(product.id));

                // تطبيق الشكل الصحيح فوراً
                updateButtonUI(isInCart);

                // 2. حدث الضغط على الزر
                detailsAddBtn.addEventListener('click', (e) => {
                    // إعادة التحقق لحظياً قبل الإضافة
                    const currentCart = JSON.parse(localStorage.getItem('my_cart')) || [];
                    const alreadyExists = currentCart.some(item => String(item.id) === String(product.id));

                    if (alreadyExists) {
                        showToast("هذا المنتج موجود بالفعل في السلة!", "error");
                        return; // إيقاف التنفيذ فوراً لمنع الإضافة المكررة
                    }

                    // تجهيز البيانات وإضافتها
                    const productData = {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        img: product.Imgs.startsWith('http') ? product.Imgs : '../' + product.Imgs
                    };

                    currentCart.push({ ...productData, qty: 1 });
                    localStorage.setItem('my_cart', JSON.stringify(currentCart));

                    // تحديث شكل الزر فوراً بدون عمل Refresh (أفضل لتجربة المستخدم)
                    updateButtonUI(true);

                    // تحديث عداد السلة في الهيدر
                    document.querySelectorAll('.shoping-count, .total-count').forEach(el => {
                        el.textContent = currentCart.length;
                    });

                    setTimeout(() => {
                        location.reload()
                    }, 300)
                });
            }

        } else {
            content.innerHTML = '<p class="text-red-500 font-bold text-xl text-center py-20">عذراً، لم يتم العثور على هذا المنتج.</p>';
        }
    })
    .catch(error => console.error("Error loading products:", error));





// 2. دالة عرض المنتجات ذات الصلة
function renderRelatedProducts(currentProduct) {
    const relatedProducts = allProductsData.filter(p =>
        p.catetory === currentProduct.catetory && p.id !== currentProduct.id
    ).slice(0);

    if (relatedProducts.length === 0) {
        if (relatedSection) relatedSection.style.display = 'none';
        return;
    }

    if (relatedSection) relatedSection.style.display = 'block';

    const titleElement = relatedSection.querySelector('.title-h2');
    if (titleElement) {
        titleElement.innerHTML = `<i class="fa-solid fa-tags"></i> ${currentProduct.catetory.toUpperCase()}`;
    }

    relatedContainer.innerHTML = relatedProducts.map(p => {
        let over = p.old_price ? Math.round(((p.old_price - p.price) / p.old_price) * 100) : "";

        return `
        <div data-id="${p.id}" class="swiper-slide relative max-w-sm p-6 border-2 border-border rounded-base shadow-xl group flex flex-col justify-between h-[500px]">
            <div>
                ${p.old_price ? `
                <span class="over absolute top-2 right-0 bg-red-500 text-white text-xs font-bold ps-7 px-4 py-1.5 shadow-md">
                    ${over}%
                </span>` : ''}

                <a href="product-details.html?id=${p.id}" class="h-48 flex items-center justify-center mb-6 overflow-hidden">
                    <img class="product-img max-h-full max-w-full object-contain group-hover:scale-110 duration-200"
                        src="${p.Imgs.startsWith('http') ? p.Imgs : '../' + p.Imgs}" alt="${p.name}" />
                </a>

                <div class="start flex items-center space-x-3 mb-4">
                    <div class="flex items-center space-x-1 rtl:space-x-reverse text-orange-400">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                </div>

                <a href="product-details.html?id=${p.id}" class="hover:underline duration-200 block">
                    <h5 class="product-name text-sm md:text-xl text-heading font-semibold tracking-tight line-clamp-2">
                        ${p.name}
                    </h5>
                </a>
            </div>

            <div>
                <div class="py-3">
                    <p class="text-main text-[20px] md:text-2xl font-bold">
                        <span class="product-price">$${p.price}</span>
                        ${p.old_price ? `<span class="product-old-price text-sm text-p line-through">$${p.old_price}</span>` : ''}
                    </p>
                </div>
                
                <a href="product-details.html?id=${p.id}" class="block mt-2 bg-main w-full font-bold text-center py-[10px] rounded-sm hover:scale-105 duration-300 text-white">
                    View Details
                </a>
            </div>
        </div>
        `;
    }).join('');
}