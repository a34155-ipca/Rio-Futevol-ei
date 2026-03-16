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
}, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });

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


(function () {
    const track  = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.sponsor-card');
    const dots   = document.querySelectorAll('.carousel-dot');
    const btnPrev = document.querySelector('.carousel-prev');
    const btnNext = document.querySelector('.carousel-next');

    if (!track || !slides.length) return;

    let current = 0;
    let autoTimer;

    function getSlideWidth() {
        return slides[0].getBoundingClientRect().width + 24;
    }

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * getSlideWidth()}px)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(next, 3500);
    }

    if (btnNext) btnNext.addEventListener('click', () => { next(); startAuto(); });
    if (btnPrev) btnPrev.addEventListener('click', () => { prev(); startAuto(); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index));
            startAuto();
        });
    });

    // Swipe mobile
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
    });

    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', startAuto);

    window.addEventListener('resize', () => { goTo(0); startAuto(); });

    window.addEventListener('load', () => { goTo(0); startAuto(); });
    if (document.readyState === 'complete') { goTo(0); startAuto(); }
})();
