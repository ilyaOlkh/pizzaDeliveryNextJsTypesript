/*
Документація по роботі у шаблоні: 
Документація слайдера: https://swiperjs.com/
Сніппет(HTML): swiper
*/

// Підключаємо слайдер Swiper з node_modules
// При необхідності підключаємо додаткові модулі слайдера, вказуючи їх у {} через кому
// Приклад: { Navigation, Autoplay }
import Swiper from 'swiper';
import { Navigation, FreeMode } from 'swiper/modules';
/*
Основні модулі слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Детальніше дивись https://swiperjs.com/
*/

// Стилі Swiper
// Базові стилі
// import "../../scss/base/swiper.sass";
// Повний набір стилів з scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Повний набір стилів з node_modules
// import 'swiper/css';

// Ініціалізація слайдерів
export function initSliders() {

    // Список слайдерів
    // Перевіряємо, чи є слайдер на сторінці
    if (document.querySelector('.categories__container')) { // Вказуємо склас потрібного слайдера
        // Створюємо слайдер
        new Swiper('.categories__container', { // Вказуємо склас потрібного слайдера
            // Підключаємо модулі слайдера
            // для конкретного випадку
            modules: [Navigation, FreeMode],
            observer: true,
            observeParents: true,
            slidesPerView: 1.5,
            spaceBetween: 12,

            speed: 800,
            freeMode: {
                enabled: true,
                momentumRatio: 0.5
            },
            mousewheel: {
                sensitivity: 1,
            },
            breakpoints: {
                400: {
                    slidesPerView: 1.75,
                    spaceBetween: 12,
                },
                500: {
                    slidesPerView: 2.5,
                    spaceBetween: 12,
                },
                700: {
                    slidesPerView: 3.5,
                    spaceBetween: 12,
                },
                768: {
                    slidesPerView: 4.5,
                    spaceBetween: 30,
                },
                930: {
                    slidesPerView: 5.5,
                    spaceBetween: 30,
                },
                // 1050: {
                //     slidesPerView: 6.5,
                //     spaceBetween: 30,
                // },
                // 1150: {
                //     slidesPerView: 7.5,
                //     spaceBetween: 30,
                // },
                // 1320: {
                //     slidesPerView: 8,
                //     spaceBetween: 30,
                // },

                1050: {
                    slidesPerView: 6,
                    spaceBetween: 30,
                },
            },
        });
        new Swiper('.promotions__container', { // Вказуємо склас потрібного слайдера
            // Підключаємо модулі слайдера
            // для конкретного випадку
            modules: [Navigation, FreeMode],
            observer: true,
            observeParents: true,
            slidesPerView: 1.25,
            spaceBetween: 12,
            speed: 800,
            freeMode: {
                enabled: true,
                momentumRatio: 0.5
            },
            mousewheel: {
                sensitivity: 1,
            },
            breakpoints: {
                400: {
                    slidesPerView: 1.5,
                    spaceBetween: 12,
                },
                700: {
                    slidesPerView: 2.5,
                    spaceBetween: 12,
                },
                768: {
                    slidesPerView: 2.5,
                    spaceBetween: 30,
                },
                930: {
                    slidesPerView: 3.5,
                    spaceBetween: 30,
                },
                1150: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
            },
        });

    }
}
// Скролл на базі слайдера (за класом swiper scroll для оболонки слайдера)
// function initSlidersScroll() {
//     let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
//     if (sliderScrollItems.length > 0) {
//         for (let index = 0; index < sliderScrollItems.length; index++) {
//             const sliderScrollItem = sliderScrollItems[index];
//             const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
//             const sliderScroll = new Swiper(sliderScrollItem, {
//                 observer: true,
//                 observeParents: true,
//                 direction: 'vertical',
//                 slidesPerView: 'auto',
//                 freeMode: {
//                     enabled: true,
//                 },
//                 scrollbar: {
//                     el: sliderScrollBar,
//                     draggable: true,
//                     snapOnRelease: false
//                 },
//                 mousewheel: {
//                     releaseOnEdges: true,
//                 },
//             });
//             sliderScroll.scrollbar.updateSize();
//         }
//     }
// }
// initSliders();

// window.addEventListener("load", function (e) {
//     // Запуск ініціалізації слайдерів
//     // Запуск ініціалізації скролла на базі слайдера (за класом swiper_scroll)
//     //initSlidersScroll();
// });