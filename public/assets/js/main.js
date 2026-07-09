/**
 * Touchlabs — Main JS
 * Navbar, scroll reveal, mobile menu, micro-parallax
 */

(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const caseParallax = document.getElementById('case-parallax');

  /* --- Navbar scroll state --- */
  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* --- Mobile menu --- */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.navbar__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Apri menu');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Intersection Observer: scroll reveal --- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal, .animate-in').forEach(function (el) {
      revealObserver.observe(el);
    });

    document.querySelectorAll('.timeline').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal, .animate-in, .timeline').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --- Micro-parallax on Surgeree visual --- */
  if (caseParallax && !prefersReducedMotion) {
    let ticking = false;

    function updateParallax() {
      const rect = caseParallax.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const offset = (center - viewportHeight / 2) / viewportHeight;
      const translate = offset * 12;

      caseParallax.style.transform = 'translateY(' + translate + 'px)';
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* --- Contact form (static — integration point) --- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      /* Integrazione futura: Formspree, API custom, Netlify Forms, ecc.
         Esempio Formspree: contactForm.action = 'https://formspree.io/f/XXXX';
         contactForm.removeEventListener oppure rimuovere preventDefault dopo configurazione. */
    });
  }

  /* --- Showreel videos: reduced motion + lazy play --- */
  function initShowreelVideos() {
    const frames = document.querySelectorAll('[data-showreel]');
    if (!frames.length) return;

    frames.forEach(function (frame) {
      const video = frame.querySelector('video');
      if (!video) return;

      if (prefersReducedMotion) {
        video.removeAttribute('autoplay');
        video.pause();
        video.setAttribute('controls', '');
        return;
      }

      video.setAttribute('autoplay', '');

      if (frame.classList.contains('showreel-frame--hero')) {
        video.play().catch(function () {});
        return;
      }

      if ('IntersectionObserver' in window) {
        const playObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                video.play().catch(function () {});
              } else {
                video.pause();
              }
            });
          },
          { threshold: 0.3, rootMargin: '0px 0px -5% 0px' }
        );
        playObserver.observe(frame);
      } else {
        video.play().catch(function () {});
      }
    });
  }

  initShowreelVideos();

  /* --- Video breather: lazy autoplay + reduced motion --- */
  function initVideoBreathers() {
    const sections = document.querySelectorAll('[data-video-breather]');
    if (!sections.length) return;

    sections.forEach(function (section) {
      const video = section.querySelector('video');
      if (!video) return;

      if (prefersReducedMotion) {
        video.removeAttribute('autoplay');
        video.pause();
        return;
      }

      if ('IntersectionObserver' in window) {
        const playObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                video.play().catch(function () {});
              } else {
                video.pause();
              }
            });
          },
          { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
        );
        playObserver.observe(section);
      } else {
        video.setAttribute('autoplay', '');
        video.play().catch(function () {});
      }
    });
  }

  initVideoBreathers();
})();
