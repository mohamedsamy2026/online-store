import 'flowbite';
import { initFlowbite } from 'flowbite';
initFlowbite();

import Swiper from 'swiper';
import 'swiper/css';


// استدعاء موديولات التنقل والترقيم لـ Swiper
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// 2. تفعيل وتشغيل Swiper
const swiper = new Swiper('.mySwiper', {
  modules: [Navigation, Pagination],
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});