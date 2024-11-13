// Importar dependencias
import relax from './assets/libs/relax.min.js';
import Swiper from './assets/libs/swiper-bundle.min.js';

// Configuración de Swiper.js
const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
});

// Configuración de Relax.js para animaciones suaves
relax.init({
    threshold: 0.1,  // Controla el nivel de visibilidad para el efecto
    effects: {
        'fade-in': {
            opacity: [0, 1],
            translateY: [20, 0]
        },
        'slide-up': {
            translateY: [30, 0],
            opacity: [0, 1]
        }
    }
});
