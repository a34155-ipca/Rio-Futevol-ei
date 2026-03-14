// =============================================
// SCRIPT.JS — VERSÃO FINAL COMPLETA
// =============================================

AOS.init({ duration: 1000, once: true });

// =============================================
// NAVBAR scroll
// =============================================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('scrolled', window.scrollY > 50);
  parallaxHero();
  highlightNav();
});

// =============================================
// PARALLAX HERO — contido dentro da section
// =============================================
function parallaxHero() {
  const bg = document.querySelector('.parallax-bg');
  const hero = document.querySelector('.hero-section');
  if (!bg || !hero) return;

  // Para quando a hero sair do viewport
  if (hero.getBoundingClientRect().bottom < 0) return;

  bg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
}

// =============================================
// SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// =============================================
// FLIP CARDS (mobile: toque)
// =============================================
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    card.querySelector('.flip-card-inner').classList.toggle('flipped-active');
  });
});

// =============================================
// INTERSECTION OBSERVER — [data-scroll]
// =============================================
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-scroll]').forEach(el => scrollObserver.observe(el));

// =============================================
// PÓDIO — stagger de entrada (1º primeiro)
// =============================================
const podiumObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    const items = document.querySelectorAll('.podium-item');
    // ordem: 1º (centro), depois 2º e 3º
    [1, 0, 2].forEach((idx, i) => {
      if (items[idx]) {
        setTimeout(() => items[idx].classList.add('visible'), i * 180);
      }
    });
    podiumObserver.disconnect();
  }
}, { threshold: 0.2 });

const podium = document.querySelector('.podium');
if (podium) podiumObserver.observe(podium);

// =============================================
// NAV HIGHLIGHT — secção activa
// =============================================
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  let current = '';

  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top <= 120) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active-section', link.getAttribute('href') === `#${current}`);
  });
}
// =============================================
// ADICIONA ESTE BLOCO AO TEU script.js
// (cola no final do ficheiro)
// =============================================

// =============================================
// HERO SLIDER
// =============================================
(function () {
    const slides = document.querySelectorAll('.hero-slide');
    const dots   = document.querySelectorAll('.dot');

    if (!slides.length) return;

    let current = 0;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    // Dots continuam a funcionar
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index));
        });
    });

    // Swipe no mobile
    let touchStartX = 0;
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
        hero.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
        });
    }

    // Auto-play
    setInterval(() => goTo(current + 1), 3000);
})();
// =============================================
// SUBSTITUI o bloco do carrossel no script.js
// (o bloco que começa com "Carrossel de Patrocinadores")
// =============================================

(function () {
    const carousel = document.querySelector('.sponsors-carousel');
    const slides   = document.querySelectorAll('.sponsor-slide');
    const dots     = document.querySelectorAll('.carousel-dot');
    const btnPrev  = document.querySelector('.carousel-prev');
    const btnNext  = document.querySelector('.carousel-next');

    if (!carousel || !slides.length) return;

    let current = 0;
    let autoTimer;

    function getSlidesVisible() {
    return 1; // sempre 1, em qualquer ecrã
}

    function getSlideWidth() {
        // Calcula a largura real do slide + gap APÓS o layout estar pronto
        return slides[0].getBoundingClientRect().width + 24;
    }

    function getMaxIndex() {
        return Math.max(0, slides.length - getSlidesVisible());
    }

    function updateCarousel(animate = true) {
        if (!animate) carousel.style.transition = 'none';
        const index = Math.min(current, getMaxIndex());
        carousel.style.transform = `translateX(-${index * getSlideWidth()}px)`;
        if (!animate) requestAnimationFrame(() => carousel.style.transition = '');

        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function next() {
        current = current >= getMaxIndex() ? 0 : current + 1;
        updateCarousel();
    }

    function prev() {
        current = current <= 0 ? getMaxIndex() : current - 1;
        updateCarousel();
    }

    function startAuto() {
        clearInterval(autoTimer);
        // Só faz auto-play se houver slides para deslizar
        if (getMaxIndex() > 0) {
            autoTimer = setInterval(next, 3500);
        }
    }

    if (btnNext) btnNext.addEventListener('click', () => { next(); startAuto(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { prev(); startAuto(); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            current = parseInt(dot.dataset.index);
            updateCarousel();
            startAuto();
        });
    });

    // Swipe mobile
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
            startAuto();
        }
    });

    // Pausa no hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', startAuto);

    // Recalcula ao redimensionar
    window.addEventListener('resize', () => {
        current = 0;
        updateCarousel(false);
        startAuto();
    });

    // Aguarda imagens carregarem antes de iniciar
    window.addEventListener('load', () => {
        updateCarousel(false);
        startAuto();
    });

    // Fallback se load já passou
    if (document.readyState === 'complete') {
        updateCarousel(false);
        startAuto();
    }
})();
const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".sponsor-card");

let index = 0;

function moveCarousel(){

index++;

if(index >= slides.length){
index = 0;
}

track.style.transform = `translateX(-${index * 100}%)`;

}

setInterval(moveCarousel,3000);