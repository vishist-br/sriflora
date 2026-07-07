/* Sri Flora JavaScript */
'use strict';

// ── Dark / Light Mode Toggle ──
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Apply saved preference immediately (no flash)
const savedTheme = localStorage.getItem('sf-theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sf-theme', next);
  themeToggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
});

// ── Scroll: Navbar shadow ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.querySelector('.back-to-top').classList.toggle('visible', window.scrollY > 400);
});

// ── Mobile Nav ──
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  });
});

// ── Scroll Reveal ──
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
