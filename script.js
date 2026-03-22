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


// =============================================
// SUBSTITUI o bloco do carrossel no script.js
// =============================================

(function () {
    const thumbs   = document.querySelectorAll('.sponsor-thumb');
    const spotImg  = document.querySelector('.spotlight-img');
    const spotName = document.querySelector('.spotlight-name');
    const spotRole = document.querySelector('.spotlight-role');
    const progFill = document.querySelector('.sponsors-progress-fill');

    if (!thumbs.length || !spotImg) return;

    // Dados dos patrocinadores — muda os nomes conforme os teus
    const sponsors = [
        { src: 'images/patrocinador1.png', name: 'Home Blick',   role: 'Parceiro Oficial' },
        { src: 'images/patrocinador2.png', name: 'AutocarroBar', role: 'Parceiro Oficial' },
        { src: 'images/patrocinador3.png', name: 'Maria Pitanga', role: 'Parceiro Oficial' },
        { src: 'images/patrocinador4.png', name: 'Sandy Cup',     role: 'Parceiro Oficial' },
    ];

    const DURATION = 4000;
    let current = 0;
    let autoTimer;
    let progressTimer;
    let progressValue = 0;

    function goTo(index) {
        // Remove active
        thumbs[current].classList.remove('active');
        current = (index + sponsors.length) % sponsors.length;

        const s = sponsors[current];

        // Fade out
        spotImg.style.opacity = '0';
        spotImg.style.transform = 'scale(0.92)';

        setTimeout(() => {
            spotImg.src = s.src;
            spotName.textContent = s.name;
            spotRole.textContent = s.role;

            // Fade in
            spotImg.style.opacity = '1';
            spotImg.style.transform = 'scale(1)';
        }, 300);

        thumbs[current].classList.add('active');
        resetProgress();
    }

    // Transição suave na imagem principal
    spotImg.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    // Clique nas thumbnails
    thumbs.forEach((thumb, i) => {
        thumb.addEventListener('click', () => {
            goTo(i);
            startAuto();
        });
    });

    // Progresso
    function resetProgress() {
        progressValue = 0;
        if (progFill) progFill.style.width = '0%';
        clearInterval(progressTimer);
        const step = 100 / (DURATION / 50);
        progressTimer = setInterval(() => {
            progressValue += step;
            if (progFill) progFill.style.width = Math.min(progressValue, 100) + '%';
            if (progressValue >= 100) clearInterval(progressTimer);
        }, 50);
    }

    function startAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), DURATION);
        resetProgress();
    }

    // Pausa no hover do spotlight
    const stage = document.querySelector('.sponsors-stage');
    if (stage) {
        stage.addEventListener('mouseenter', () => {
            clearInterval(autoTimer);
            clearInterval(progressTimer);
        });
        stage.addEventListener('mouseleave', startAuto);
    }

    startAuto();
})();
const galleries = {
    jogo: {
        title: 'O Jogo em Ação',
        photos: [
            './images/shark_emerson.jpeg',
            './images/emerson_saque.jpeg',
            './images/campeonato duplas.jpeg',
            './images/emerson peitada.jpeg',
            './images/campeonato.jpeg'
            
        ]
    },
    treino: {
        title: 'Treino Individual',
        photos: [
            './images/emerson_aluna.jpeg',
            './images/emerson duo namoirada.PNG',
            './images/amizade emerson.jpeg',
            './images/emerson correndo.jpeg',
            './images/emerson costas.jpeg'
        ]
    }
};

let activeGallery = null;

function toggleExpand(type) {
    const expand = document.getElementById('gal-expand');
    const grid = document.getElementById('gal-expand-grid');
    const title = document.getElementById('gal-expand-title');

    // Se clicar na mesma galeria fecha
    if (activeGallery === type && expand.classList.contains('open')) {
        closeExpand();
        return;
    }

    activeGallery = type;
    const gallery = galleries[type];
    title.textContent = gallery.title;
    grid.innerHTML = '';

    gallery.photos.forEach(src => {
        if (src === 'placeholder') {
            const div = document.createElement('div');
            div.className = 'gal-placeholder';
            div.textContent = 'Em breve';
            grid.appendChild(div);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = gallery.title;
            grid.appendChild(img);
        }
    });

    expand.classList.add('open');

    // Scroll suave até à galeria expandida
    setTimeout(() => {
        expand.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function closeExpand() {
    document.getElementById('gal-expand').classList.remove('open');
    activeGallery = null;
}
