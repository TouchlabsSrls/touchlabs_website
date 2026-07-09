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

  /* --- Contact form --- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('.contact-form__submit');
    const statusEl = document.getElementById('contact-form-status');

    function setFieldError(fieldName, message) {
      const field = contactForm.querySelector('[name="' + fieldName + '"]');
      const errorEl = contactForm.querySelector('[data-error-for="' + fieldName + '"]');
      if (field) {
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
      }
      if (errorEl) {
        errorEl.textContent = message || '';
      }
    }

    function clearErrors() {
      contactForm.querySelectorAll('[data-error-for]').forEach(function (el) {
        el.textContent = '';
      });
      contactForm.querySelectorAll('[aria-invalid]').forEach(function (el) {
        el.removeAttribute('aria-invalid');
      });
    }

    function showStatus(message, type) {
      if (!statusEl) return;
      statusEl.hidden = false;
      statusEl.textContent = message;
      statusEl.classList.remove('contact-form__status--success', 'contact-form__status--error');
      if (type) {
        statusEl.classList.add('contact-form__status--' + type);
      }
    }

    function validateClient() {
      clearErrors();
      let valid = true;
      const name = contactForm.elements.namedItem('name');
      const email = contactForm.elements.namedItem('email');
      const message = contactForm.elements.namedItem('message');
      const consent = contactForm.elements.namedItem('privacy_consent');

      if (!name || !String(name.value).trim()) {
        setFieldError('name', 'Inserisci il nome.');
        valid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email.value).trim())) {
        setFieldError('email', 'Inserisci un indirizzo email valido.');
        valid = false;
      }
      if (!message || !String(message.value).trim()) {
        setFieldError('message', 'Inserisci un messaggio.');
        valid = false;
      }
      if (!consent || !consent.checked) {
        setFieldError('privacy_consent', 'È necessario accettare l\'informativa privacy.');
        valid = false;
      }
      return valid;
    }

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (submitBtn && submitBtn.disabled) return;
      if (!validateClient()) {
        showStatus('Controlla i campi evidenziati.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalLabel = submitBtn.textContent;
        submitBtn.textContent = 'Invio in corso…';
      }
      showStatus('Invio in corso…', null);

      const formData = new FormData(contactForm);

      fetch('/api/contact.php', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, status: response.status, data: data };
          });
        })
        .then(function (result) {
          if (result.data && result.data.ok) {
            contactForm.reset();
            clearErrors();
            showStatus(result.data.message || 'Richiesta inviata.', 'success');
            return;
          }
          if (result.data && result.data.errors) {
            Object.keys(result.data.errors).forEach(function (key) {
              setFieldError(key, result.data.errors[key]);
            });
            showStatus('Controlla i campi evidenziati.', 'error');
            return;
          }
          showStatus((result.data && result.data.error) || 'Invio non riuscito. Riprova o scrivi a info@touchlabs.it.', 'error');
        })
        .catch(function () {
          showStatus('Errore di rete. Riprova o scrivi a info@touchlabs.it.', 'error');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalLabel || 'Invia la tua richiesta';
          }
        });
    });
  }

  /* --- Google Maps click-to-load --- */
  function initLazyMaps() {
    document.querySelectorAll('[data-map-lazy]').forEach(function (wrap) {
      const trigger = wrap.querySelector('[data-map-trigger]');
      const src = wrap.getAttribute('data-map-src');
      if (!trigger || !src) return;

      trigger.addEventListener('click', function () {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.title = wrap.getAttribute('data-map-title') || 'Mappa';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.setAttribute('allowfullscreen', '');
        wrap.innerHTML = '';
        wrap.appendChild(iframe);
      });
    });
  }

  initLazyMaps();

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
