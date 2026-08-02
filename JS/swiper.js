// Import Swiper and modules 
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles Start
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
// Import Swiper styles End



// Hero Section Start
const swiper = new Swiper('.slide-swp', {
    modules: [Autoplay, Pagination],
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

// Hero Section End


// Products Start
document.querySelectorAll('.products-swiper').forEach(swiperEl => {
    
    let parentSection = swiperEl.closest('section');
    let nextBtn = parentSection ? parentSection.querySelector('.next-btn') : null;
    let prevBtn = parentSection ? parentSection.querySelector('.prev-btn') : null;

    new Swiper(swiperEl, {
        modules: [Autoplay, Navigation],
        slidesPerView: 4,
        spaceBetween: 15,
        autoplay: {
            delay: 2500,
        },
        navigation: {
            nextEl: nextBtn,
            prevEl: prevBtn,
        },
        loop: true,
        breakpoints: {
            1200: { slidesPerView: 4, spaceBetween: 15 },
            1000: { slidesPerView: 3, spaceBetween: 15 },
            500: { slidesPerView: 2, spaceBetween: 10 },
            0: { slidesPerView: 1, spaceBetween: 7 }
        }
    });
});
// Products End