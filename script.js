'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initScrollReveal();
  initCounters();
  initFAQ();
  initTabs();
  initPortfolioFilter();
  initSmoothScroll();
  initActiveLinks();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => { navbar.classList.toggle('scrolled', window.scrollY > 30); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('mobile-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('mobile-open');
      document.body.style.overflow = '';
    });
  });
  navMenu.querySelectorAll('.has-dropdown').forEach(item => {
    item.addEventListener('click', (e) => {
      if (!navMenu.classList.contains('mobile-open')) return;
      if (e.target.closest('.dropdown')) return;
      item.classList.toggle('open');
    });
  });
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const startTime = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const update = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { animateCounter(entry.target); observer.unobserve(entry.target); } });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

function initTabs() {
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (!tabBtns.length) return;
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === `tab-${target}`));
      const panel = document.getElementById(`tab-${target}`);
      if (panel) panel.querySelectorAll('.reveal').forEach(el => { if (!el.classList.contains('visible')) setTimeout(() => el.classList.add('visible'), 50); });
    });
  });
}

function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.portfolio-card');
  if (!filterBtns.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        if (show) {
          card.style.opacity = '0'; card.style.transform = 'scale(0.95) translateY(20px)'; card.style.display = 'block';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1'; card.style.transform = 'scale(1) translateY(0)';
          }));
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0'; card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight - 20, behavior: 'smooth' });
    });
  });
}

function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' });
  sections.forEach(s => observer.observe(s));
}

// Parallax orbs
(function() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;
  let ticking = false;
  window.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      orbs[0]?.style.setProperty('transform', `translate(${x * 0.5}px, ${y * 0.5}px)`);
      orbs[1]?.style.setProperty('transform', `translate(${-x * 0.3}px, ${-y * 0.3}px)`);
      ticking = false;
    });
  });
})();

// Card tilt
(function() {
  document.querySelectorAll('.service-card, .solution-card, .temoignage-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; card.style.transition = 'transform 0.5s ease'; });
    card.addEventListener('mouseenter', () => { card.style.transition = 'transform 0.1s ease'; });
  });
})();

// Ripple effect
(function() {
  document.querySelectorAll('.btn-primary, .btn-submit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `position:absolute;left:${e.clientX-rect.left}px;top:${e.clientY-rect.top}px;width:0;height:0;background:rgba(255,255,255,0.25);border-radius:50%;transform:translate(-50%,-50%);animation:rippleAnim 0.6s ease-out forwards;pointer-events:none;`;
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
  const style = document.createElement('style');
  style.textContent = '@keyframes rippleAnim{to{width:300px;height:300px;opacity:0}}';
  document.head.appendChild(style);
})();

// Scroll progress bar
(function() {
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#3b82f6,#818cf8);z-index:2000;width:0%;transition:width 0.1s linear;box-shadow:0 0 12px rgba(59,130,246,0.6);';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = `${progress}%`;
  }, { passive: true });
})();

// Page fade-in
(function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  window.addEventListener('load', () => { document.body.style.opacity = '1'; });
  setTimeout(() => { document.body.style.opacity = '1'; }, 1000);
})();
