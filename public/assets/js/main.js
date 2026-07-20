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
      if (el.closest('.portfolio-reveal')) return;
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

  /* --- Portfolio project scroll reveal --- */
  function initPortfolioReveal() {
    const blocks = document.querySelectorAll('.portfolio-reveal');
    if (!blocks.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      blocks.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const portfolioObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            portfolioObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    );

    blocks.forEach(function (el) {
      portfolioObserver.observe(el);
    });
  }

  initPortfolioReveal();

  /* --- Portfolio showcase videos: viewport autoplay, mobile tap, save-data --- */
  function setupPortfolioVideoLayer(wrapper, video) {
    const posterSrc = video.getAttribute('poster');
    if (posterSrc && !wrapper.querySelector('.spatial-case-video__poster')) {
      const posterImg = document.createElement('img');
      posterImg.className = 'spatial-case-video__poster';
      posterImg.src = posterSrc;
      posterImg.alt = '';
      posterImg.setAttribute('aria-hidden', 'true');
      posterImg.decoding = 'async';
      wrapper.insertBefore(posterImg, video);
    }

    function markReady() {
      video.classList.add('is-ready');
    }

    if (video.readyState >= 2) {
      markReady();
    } else {
      video.addEventListener('loadeddata', markReady, { once: true });
      video.addEventListener('canplay', markReady, { once: true });
    }

    video.addEventListener('error', function () {
      video.classList.remove('is-ready');
    });
  }

  function initPortfolioVideos() {
    const wrappers = document.querySelectorAll('[data-portfolio-video]');
    if (!wrappers.length) return;

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = conn && conn.saveData;
    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    const allowAutoplay = !prefersReducedMotion && !saveData && !isMobile;
    let activeVideo = null;

    function pauseOthers(except) {
      wrappers.forEach(function (w) {
        const v = w.querySelector('video');
        if (v && v !== except && !v.paused) {
          v.pause();
        }
      });
      activeVideo = except && !except.paused ? except : null;
    }

    function createPlayButton(wrapper, video) {
      const rawLabel = video.getAttribute('aria-label') || '';
      const playLabel = rawLabel
        ? rawLabel.replace(/^Anteprima video\s*[—-]\s*/i, 'Riproduci video — ')
        : 'Riproduci video del progetto';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'portfolio-video-play';
      btn.setAttribute('aria-label', playLabel);

      const icon = document.createElement('span');
      icon.className = 'portfolio-video-play__icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML =
        '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z"/></svg>';
      btn.appendChild(icon);
      wrapper.appendChild(btn);

      function syncPlayButton() {
        btn.hidden = !video.paused && !video.ended;
      }

      video.addEventListener('play', syncPlayButton);
      video.addEventListener('pause', syncPlayButton);
      video.addEventListener('ended', syncPlayButton);
      syncPlayButton();

      return btn;
    }

    wrappers.forEach(function (wrapper) {
      const video = wrapper.querySelector('video');
      if (!video) return;

      setupPortfolioVideoLayer(wrapper, video);
      video.removeAttribute('autoplay');

      if (!allowAutoplay) {
        video.pause();
        if (prefersReducedMotion || saveData) {
          video.setAttribute('controls', '');
        }
        if (isMobile && !prefersReducedMotion && !saveData) {
          const playBtn = createPlayButton(wrapper, video);

          playBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            pauseOthers(video);
            video.play().catch(function () {});
            activeVideo = video;
          });

          wrapper.addEventListener('click', function () {
            if (!video.paused) {
              video.pause();
              if (activeVideo === video) {
                activeVideo = null;
              }
            }
          });

          playBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              pauseOthers(video);
              video.play().catch(function () {});
              activeVideo = video;
            }
          });
        }
        return;
      }

      if ('IntersectionObserver' in window) {
        const playObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                pauseOthers(video);
                video.play().catch(function () {});
                activeVideo = video;
              } else if (activeVideo === video) {
                video.pause();
                activeVideo = null;
              }
            });
          },
          { threshold: 0.35, rootMargin: '0px 0px -8% 0px' }
        );
        playObserver.observe(wrapper);
      }
    });
  }

  initPortfolioVideos();

  /* --- Portfolio area filters --- */
  function initPortfolioFilters() {
    const nav = document.querySelector('[data-portfolio-filters]');
    const list = document.querySelector('[data-portfolio-list]');
    if (!nav || !list) return;

    const chips = nav.querySelectorAll('[data-filter]');
    const items = list.querySelectorAll('[data-areas]');
    const statusEl = document.getElementById('portfolio-filter-status');
    const areaLabels = {
      'spatial-computing': 'Spatial Computing',
      'intelligenza-artificiale': 'Artificial Intelligence',
      'software-engineering': 'Software Engineering',
      'digital-experience': 'Digital Experience',
    };
    const areaAliases = {
      'ai-applicata': 'intelligenza-artificiale',
      'software-custom': 'software-engineering',
    };
    const validAreas = Object.keys(areaLabels);

    function normalizeArea(area) {
      const slug = (area || '').trim().toLowerCase();
      if (validAreas.indexOf(slug) !== -1) return slug;
      return areaAliases[slug] || '';
    }

    let emptyEl = list.querySelector('.portfolio-filter-empty');
    if (!emptyEl) {
      emptyEl = document.createElement('p');
      emptyEl.className = 'portfolio-filter-empty';
      emptyEl.setAttribute('role', 'status');
      emptyEl.textContent = 'Nessun progetto in questa area al momento.';
      list.appendChild(emptyEl);
    }

    function readAreaFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const area = normalizeArea(params.get('area'));
      return area || 'all';
    }

    function updatePortfolioAlternation() {
      items.forEach(function (item) {
        item.classList.remove('is-alternate');
      });

      var visibleIndex = 0;
      items.forEach(function (item) {
        if (item.classList.contains('is-filtered-out') || item.hidden) return;
        item.classList.toggle('is-alternate', visibleIndex % 2 === 1);
        visibleIndex += 1;
      });
    }

    function applyFilter(area, pushUrl) {
      const filter = validAreas.indexOf(area) !== -1 ? area : 'all';
      let visible = 0;

      items.forEach(function (item) {
        const areas = (item.getAttribute('data-areas') || '').split(/\s+/);
        const match = filter === 'all' || areas.indexOf(filter) !== -1;
        item.classList.toggle('is-filtered-out', !match);
        if (match) visible += 1;
      });

      updatePortfolioAlternation();

      chips.forEach(function (chip) {
        const active = chip.getAttribute('data-filter') === filter;
        chip.classList.toggle('is-active', active);
        if (active) {
          chip.setAttribute('aria-current', 'true');
        } else {
          chip.removeAttribute('aria-current');
        }
      });

      if (statusEl) {
        if (filter === 'all') {
          statusEl.hidden = true;
          statusEl.textContent = '';
        } else {
          statusEl.hidden = false;
          statusEl.textContent = 'Progetti collegati a ' + areaLabels[filter];
        }
      }

      emptyEl.classList.toggle('is-visible', visible === 0);

      if (pushUrl) {
        const url = filter === 'all' ? '/portfolio.html' : '/portfolio.html?area=' + filter;
        if (window.location.pathname + window.location.search !== url) {
          history.pushState({ area: filter }, '', url);
        }
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function (event) {
        event.preventDefault();
        applyFilter(chip.getAttribute('data-filter') || 'all', true);
      });
    });

    window.addEventListener('popstate', function () {
      applyFilter(readAreaFromUrl(), false);
    });

    applyFilter(readAreaFromUrl(), false);

    const params = new URLSearchParams(window.location.search);
    const rawArea = (params.get('area') || '').trim().toLowerCase();
    if (rawArea && areaAliases[rawArea]) {
      const canonical = normalizeArea(rawArea);
      const canonicalUrl = '/portfolio.html?area=' + canonical;
      if (window.location.pathname + window.location.search !== canonicalUrl) {
        history.replaceState({ area: canonical }, '', canonicalUrl);
      }
    }
  }

  initPortfolioFilters();
})();
