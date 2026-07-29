fetch("products.json")

    .then(response => response.json())

    .then(data => {

        data.forEach(element => {
            // Old Price Start
            if (element.old_price) {
                let swiper_wrapper = document.querySelector(".products1");



                let over = Math.round(((element.old_price - element.price) / element.old_price) * 100);
                swiper_wrapper.innerHTML +=
                    `
                  <div
                        class="swiper-slide relative max-w-sm p-6 border-2 border-border rounded-base shadow-xl group flex flex-col justify-between h-[500px]">
                        <div>
                           ${element.old_price ? `
                                <span class="over absolute top-2 right-0 bg-red-500 text-white text-xs font-bold ps-7 px-4 py-1.5 shadow-md">
                                    ${over}%
                                </span>` : ''}
                             <a href="#" class="h-48 flex items-center justify-center mb-6 overflow-hidden">
                                <img class="max-h-full max-w-full object-contain group-hover:scale-110 duration-200"
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

                            <a href="#" class="hover:underline duration-200">
                                <h5 class="text-xl text-heading font-semibold tracking-tight line-clamp-2">
                                    ${element.name}</h5>
                            </a>
                        </div>

                        <div>
                            <div class="py-3">
                                <p class="text-main text-2xl font-bold">$${element.price}
                                    ${element.old_price ? `<span
                                        class="text-sm text-p line-through">$${element.old_price}</span>` : ''}
                                </p>
                            </div>
                            <div class="flex items-center mt-2">
                                <div class="bg-main w-fit py-2 px-3 rounded-sm hover:scale-105 duration-300">
                                    <button type="button"
                                        class="text-white shadow-xs text-[16px] font-semibold cursor-pointer">
                                        <i class="fa-solid fa-cart-shopping text-[15px]"></i> Add to cart
                                    </button>
                                </div>
                                <div
                                    class="w-11 h-11 ms-2 border border-border rounded-sm flex items-center justify-center cursor-pointer hover:bg-main hover:text-white duration-300">
                                    <i class="fa-regular fa-heart text-lg"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
            `
            }
            // Old Price End

            // Electronics Start
            if (element.catetory == "electronics") {
                let swiper_wrapper2 = document.querySelector(".products2");

                if (element.old_price) {
                    let over = Math.round(((element.old_price - element.price) / element.old_price) * 100);
                    swiper_wrapper2.innerHTML +=
                        `
                  <div
                        class="swiper-slide relative max-w-sm p-6 border-2 border-border rounded-base shadow-xl group flex flex-col justify-between h-[500px]">
                        <div>
                           ${element.old_price ? `
                                <span class="over absolute top-2 right-0 bg-red-500 text-white text-xs font-bold ps-7 px-4 py-1.5 shadow-md">
                                    ${over}%
                                </span>` : ''}
                             <a href="#" class="h-48 flex items-center justify-center mb-6 overflow-hidden">
                                <img class="max-h-full max-w-full object-contain group-hover:scale-110 duration-200"
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

                            <a href="#" class="hover:underline duration-200">
                                <h5 class="text-xl text-heading font-semibold tracking-tight line-clamp-2">
                                    ${element.name}</h5>
                            </a>
                        </div>

                        <div>
                            <div class="py-3">
                                <p class="text-main text-2xl font-bold">$${element.price}
                                    ${element.old_price ? `<span
                                        class="text-sm text-p line-through">$${element.old_price}</span>` : ''}
                                </p>
                            </div>
                            <div class="flex items-center mt-2">
                                <div class="bg-main w-fit py-2 px-3 rounded-sm hover:scale-105 duration-300">
                                    <button type="button"
                                        class="text-white shadow-xs text-[16px] font-semibold cursor-pointer">
                                        <i class="fa-solid fa-cart-shopping text-[15px]"></i> Add to cart
                                    </button>
                                </div>
                                <div
                                    class="w-11 h-11 ms-2 border border-border rounded-sm flex items-center justify-center cursor-pointer hover:bg-main hover:text-white duration-300">
                                    <i class="fa-regular fa-heart text-lg"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
            `
                }
                else {
                    swiper_wrapper2.innerHTML +=
                        `
                     <div
                        class="swiper-slide relative max-w-sm p-6 border-2 border-border rounded-base shadow-xl group flex flex-col justify-between h-[500px]">
                        <div>
      
                             <a href="#" class="h-48 flex items-center justify-center mb-6 overflow-hidden">
                                <img class="max-h-full max-w-full object-contain group-hover:scale-110 duration-200"
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

                            <a href="#" class="hover:underline duration-200">
                                <h5 class="text-xl text-heading font-semibold tracking-tight line-clamp-2">
                                    ${element.name}</h5>
                            </a>
                        </div>

                        <div>
                            <div class="py-3">
                                <p class="text-main text-2xl font-bold">$${element.price}
                                    
                                </p>
                            </div>
                            <div class="flex items-center mt-2">
                                <div class="bg-main w-fit py-2 px-3 rounded-sm hover:scale-105 duration-300">
                                    <button type="button"
                                        class="text-white shadow-xs text-[16px] font-semibold cursor-pointer">
                                        <i class="fa-solid fa-cart-shopping text-[15px]"></i> Add to cart
                                    </button>
                                </div>
                                <div
                                    class="w-11 h-11 ms-2 border border-border rounded-sm flex items-center justify-center cursor-pointer hover:bg-main hover:text-white duration-300">
                                    <i class="fa-regular fa-heart text-lg"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
            `
                }
            }
            // Electronics End


            // appliances Start
            if (element.catetory == "appliances") {
                let swiper_wrapper3 = document.querySelector(".products3");

                if (element.old_price) {
                    let over = Math.round(((element.old_price - element.price) / element.old_price) * 100);
                    swiper_wrapper3.innerHTML +=
                        `
                  <div
                        class="swiper-slide relative max-w-sm p-6 border-2 border-border rounded-base shadow-xl group flex flex-col justify-between h-[500px]">
                        <div>
                           ${element.old_price ? `
                                <span class="over absolute top-2 right-0 bg-red-500 text-white text-xs font-bold ps-7 px-4 py-1.5 shadow-md">
                                    ${over}%
                                </span>` : ''}
                             <a href="#" class="h-48 flex items-center justify-center mb-6 overflow-hidden">
                                <img class="max-h-full max-w-full object-contain group-hover:scale-110 duration-200"
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

                            <a href="#" class="hover:underline duration-200">
                                <h5 class="text-xl text-heading font-semibold tracking-tight line-clamp-2">
                                    ${element.name}</h5>
                            </a>
                        </div>

                        <div>
                            <div class="py-3">
                                <p class="text-main text-2xl font-bold">$${element.price}
                                    ${element.old_price ? `<span
                                        class="text-sm text-p line-through">$${element.old_price}</span>` : ''}
                                </p>
                            </div>
                            <div class="flex items-center mt-2">
                                <div class="bg-main w-fit py-2 px-3 rounded-sm hover:scale-105 duration-300">
                                    <button type="button"
                                        class="text-white shadow-xs text-[16px] font-semibold cursor-pointer">
                                        <i class="fa-solid fa-cart-shopping text-[15px]"></i> Add to cart
                                    </button>
                                </div>
                                <div
                                    class="w-11 h-11 ms-2 border border-border rounded-sm flex items-center justify-center cursor-pointer hover:bg-main hover:text-white duration-300">
                                    <i class="fa-regular fa-heart text-lg"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
            `
                }
                else {
                    swiper_wrapper3.innerHTML +=
                        `
                     <div
                        class="swiper-slide relative max-w-sm p-6 border-2 border-border rounded-base shadow-xl group flex flex-col justify-between h-[500px]">
                        <div>
      
                             <a href="#" class="h-48 flex items-center justify-center mb-6 overflow-hidden">
                                <img class="max-h-full max-w-full object-contain group-hover:scale-110 duration-200"
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

                            <a href="#" class="hover:underline duration-200">
                                <h5 class="text-xl text-heading font-semibold tracking-tight line-clamp-2">
                                    ${element.name}</h5>
                            </a>
                        </div>

                        <div>
                            <div class="py-3">
                                <p class="text-main text-2xl font-bold">$${element.price}
                                    
                                </p>
                            </div>
                            <div class="flex items-center mt-2">
                                <div class="bg-main w-fit py-2 px-3 rounded-sm hover:scale-105 duration-300">
                                    <button type="button"
                                        class="text-white shadow-xs text-[16px] font-semibold cursor-pointer">
                                        <i class="fa-solid fa-cart-shopping text-[15px]"></i> Add to cart
                                    </button>
                                </div>
                                <div
                                    class="w-11 h-11 ms-2 border border-border rounded-sm flex items-center justify-center cursor-pointer hover:bg-main hover:text-white duration-300">
                                    <i class="fa-regular fa-heart text-lg"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
            `
                }
            }
            // appliances End

            
            // mobiles Start
            if (element.catetory == "mobiles") {
                let swiper_wrapper4 = document.querySelector(".products4");

                if (element.old_price) {
                    let over = Math.round(((element.old_price - element.price) / element.old_price) * 100);
                    swiper_wrapper4.innerHTML +=
                        `
                  <div
                        class="swiper-slide relative max-w-sm p-6 border-2 border-border rounded-base shadow-xl group flex flex-col justify-between h-[500px]">
                        <div>
                           ${element.old_price ? `
                                <span class="over absolute top-2 right-0 bg-red-500 text-white text-xs font-bold ps-7 px-4 py-1.5 shadow-md">
                                    ${over}%
                                </span>` : ''}
                             <a href="#" class="h-48 flex items-center justify-center mb-6 overflow-hidden">
                                <img class="max-h-full max-w-full object-contain group-hover:scale-110 duration-200"
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

                            <a href="#" class="hover:underline duration-200">
                                <h5 class="text-xl text-heading font-semibold tracking-tight line-clamp-2">
                                    ${element.name}</h5>
                            </a>
                        </div>

                        <div>
                            <div class="py-3">
                                <p class="text-main text-2xl font-bold">$${element.price}
                                    ${element.old_price ? `<span
                                        class="text-sm text-p line-through">$${element.old_price}</span>` : ''}
                                </p>
                            </div>
                            <div class="flex items-center mt-2">
                                <div class="bg-main w-fit py-2 px-3 rounded-sm hover:scale-105 duration-300">
                                    <button type="button"
                                        class="text-white shadow-xs text-[16px] font-semibold cursor-pointer">
                                        <i class="fa-solid fa-cart-shopping text-[15px]"></i> Add to cart
                                    </button>
                                </div>
                                <div
                                    class="w-11 h-11 ms-2 border border-border rounded-sm flex items-center justify-center cursor-pointer hover:bg-main hover:text-white duration-300">
                                    <i class="fa-regular fa-heart text-lg"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
            `
                }
                else {
                    swiper_wrapper4.innerHTML +=
                        `
                     <div
                        class="swiper-slide relative max-w-sm p-6 border-2 border-border rounded-base shadow-xl group flex flex-col justify-between h-[500px]">
                        <div>
      
                             <a href="#" class="h-48 flex items-center justify-center mb-6 overflow-hidden">
                                <img class="max-h-full max-w-full object-contain group-hover:scale-110 duration-200"
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

                            <a href="#" class="hover:underline duration-200">
                                <h5 class="text-xl text-heading font-semibold tracking-tight line-clamp-2">
                                    ${element.name}</h5>
                            </a>
                        </div>

                        <div>
                            <div class="py-3">
                                <p class="text-main text-2xl font-bold">$${element.price}
                                    
                                </p>
                            </div>
                            <div class="flex items-center mt-2">
                                <div class="bg-main w-fit py-2 px-3 rounded-sm hover:scale-105 duration-300">
                                    <button type="button"
                                        class="text-white shadow-xs text-[16px] font-semibold cursor-pointer">
                                        <i class="fa-solid fa-cart-shopping text-[15px]"></i> Add to cart
                                    </button>
                                </div>
                                <div
                                    class="w-11 h-11 ms-2 border border-border rounded-sm flex items-center justify-center cursor-pointer hover:bg-main hover:text-white duration-300">
                                    <i class="fa-regular fa-heart text-lg"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    
            `
                }
            }
            // mobiles End




        });
    })