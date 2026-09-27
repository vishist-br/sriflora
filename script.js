/* Sri Flora JavaScript */
'use strict';

// ── Light Mode Only ──
const html = document.documentElement;
html.setAttribute('data-theme', 'light');
localStorage.removeItem('sf-theme');

/* Lenis removed - falling back to native scrolling */

// ── Init Vanilla LazyLoad ──
var lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy",
  threshold: 500, // Load images when they are 500px away from viewport
  callback_loaded: function(el) {
    el.classList.add("loaded");
  }
});

// ── Technology Carousel (Vanilla JS) ──
const techCarousel = document.getElementById('tech-carousel-track');
const techPrev = document.querySelector('.tech-nav.prev');
const techNext = document.querySelector('.tech-nav.next');
const techWrapper = document.getElementById('tech-carousel');

if (techCarousel && techPrev && techNext && techWrapper) {
  const scrollAmount = 512; // Slide width (480) + gap (32)

  techNext.addEventListener('click', () => {
    techCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  techPrev.addEventListener('click', () => {
    techCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  let autoScrollInterval;
  
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      // Loop back if at the end
      if (techCarousel.scrollLeft + techCarousel.clientWidth >= techCarousel.scrollWidth - 10) {
        techCarousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        techCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 2000);
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  // Pause on hover
  techWrapper.addEventListener('mouseenter', stopAutoScroll);
  techWrapper.addEventListener('mouseleave', startAutoScroll);

  startAutoScroll();
}

// ── Scroll: Navbar shadow ──
const navbar = document.getElementById('navbar');
const backToTop = document.querySelector('.back-to-top');
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
      ticking = false;
    });
    ticking = true;
  }
});

// ── Mobile Nav ──
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
  });
  document.querySelectorAll('.mobile-nav > a, .mobile-nav-submenu > a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ── Mobile Products Sub-menu toggle ──
const mobileProductsToggle = document.getElementById('mobile-products-toggle');
const mobileProductsSubmenu = document.getElementById('mobile-products-submenu');
if (mobileProductsToggle && mobileProductsSubmenu) {
  mobileProductsToggle.addEventListener('click', () => {
    mobileProductsToggle.classList.toggle('open');
    mobileProductsSubmenu.classList.toggle('open');
  });
}

// ── Mobile About Sub-menu toggle ──
const mobileAboutToggle = document.getElementById('mobile-about-toggle');
const mobileAboutSubmenu = document.getElementById('mobile-about-submenu');
if (mobileAboutToggle && mobileAboutSubmenu) {
  mobileAboutToggle.addEventListener('click', () => {
    mobileAboutToggle.classList.toggle('open');
    mobileAboutSubmenu.classList.toggle('open');
  });
}

// ── Scroll Reveal ──
// Only hide .reveal elements once JS is confirmed running
document.documentElement.classList.add('js-reveal-ready');
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ── Staggered children animations ──
document.querySelectorAll('.stagger-children').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
});

// ── Animated Number Counters ──
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ── Gallery Lightbox ──
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item, .tech-slide').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const label = item.querySelector('.gallery-item-label, .tech-slide-label');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption) {
          lightboxCaption.textContent = label ? label.textContent : img.alt;
        }
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ── Drone Video Modal ──
const videoModal = document.getElementById('video-modal');
const btnDroneVideo = document.getElementById('btn-drone-video');
const videoContainer = document.getElementById('video-container');
const videoModalClose = document.querySelector('.video-modal-close');

if (videoModal && btnDroneVideo && videoContainer) {
  btnDroneVideo.addEventListener('click', () => {
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Inject video dynamically to prevent buffering on page load
    videoContainer.innerHTML = `
      <video id="drone-video" controls autoplay playsinline preload="auto">
        <source src="photos/Gallery/Drone Videos/DJI_20260910081433_0064_D.MP4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;

    const videoElement = document.getElementById('drone-video');
    const loader = document.getElementById('video-loader');
    
    // Hide loader when video can play
    videoElement.addEventListener('canplay', () => {
      if (loader) loader.style.display = 'none';
    });
  });

  const closeVideoModal = () => {
    videoModal.classList.remove('open');
    document.body.style.overflow = '';
    // Destroy video to stop playing and free memory
    setTimeout(() => {
      videoContainer.innerHTML = '';
      const loader = document.getElementById('video-loader');
      if (loader) loader.style.display = 'flex';
    }, 400);
  };

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  
  videoModal.addEventListener('click', e => {
    if (e.target === videoModal) closeVideoModal();
  });
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && videoModal.classList.contains('open')) closeVideoModal();
  });
}


