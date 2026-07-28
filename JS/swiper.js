// Import Swiper and modules 
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';



// 1. Hero Section Start
const swiper = new Swiper('.swiper-home', {
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

// 1. Hero Section End

// 2. Products 1 Start
const productsSwiper = new Swiper('.products-swiper', {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 5,
    slidesPerGroup: 1,
    spaceBetween: 20,
    loop: true,
    navigation: {
        nextEl: '.next-btn',
        prevEl: '.prev-btn',
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    breakpoints: {
        320: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
    }
});
// 2. Products 1 End
