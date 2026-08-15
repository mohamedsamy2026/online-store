// Import Swiper and modules 
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles Start
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
// Import Swiper styles End

document.addEventListener("DOMContentLoaded", () => {

    // 1. Hero Section Swiper Start
    const swiperEl = document.querySelector('.slide-swp');
    if (swiperEl) {
        const swiper = new Swiper(swiperEl, {
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
    }
    // Hero Section End


    // 2. Products Sections Swiper Start
    document.querySelectorAll('.products-swiper').forEach(swiperEl => {
        let parentSection = swiperEl.closest('section');
        let nextBtn = parentSection ? parentSection.querySelector('.next-btn') : null;
        let prevBtn = parentSection ? parentSection.querySelector('.prev-btn') : null;

        new Swiper(swiperEl, {
            modules: [Autoplay, Navigation],
            slidesPerView: 5,
            spaceBetween: 20,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: nextBtn,
                prevEl: prevBtn,
            },
            loop: true,
            breakpoints: {
                1200: {
                    slidesPerView: 5,
                    spaceBetween: 20
                },
                1000: {
                    slidesPerView: 4,
                    spaceBetween: 20
                },
                700: {
                    slidesPerView: 3,
                    spaceBetween: 15,

                },
                0: {
                    slidesPerView: 2,
                    spaceBetween: 10
                }
            }
        });
    });
    // Products End

});



