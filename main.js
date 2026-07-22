/* =============================================
   CAMS-MAN — main.js
   ============================================= */

(function () {
  'use strict';

  /* ---- Dynamic year in footer ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Search / filter camera cards ---- */
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const cameraGrid = document.getElementById('camera-grid');
  const searchNotice = document.getElementById('search-notice');

  if (searchForm && searchInput && cameraGrid) {
    function filterCards(query) {
      const q = query.trim().toLowerCase();
      const cards = cameraGrid.querySelectorAll('.card');
      let visibleCount = 0;

      cards.forEach(function (card) {
        const title = (card.querySelector('.card-title') || {}).textContent || '';
        const desc = (card.querySelector('.card-desc') || {}).textContent || '';
        const category = (card.querySelector('.card-category') || {}).textContent || '';
        const tags = card.getAttribute('data-tags') || '';
        const haystack = [title, desc, category, tags].join(' ').toLowerCase();

        const match = q === '' || haystack.includes(q);
        card.hidden = !match;
        if (match) visibleCount += 1;
      });

      if (searchNotice) {
        searchNotice.hidden = (q === '' || visibleCount > 0);
      }
    }

    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      filterCards(searchInput.value);
    });

    // Live filtering as user types
    searchInput.addEventListener('input', function () {
      filterCards(searchInput.value);
    });
  }

  /* ---- Category card click → filter ---- */
  const categoryCards = document.querySelectorAll('.category-card[data-filter]');

  categoryCards.forEach(function (catCard) {
    catCard.addEventListener('click', function (e) {
      e.preventDefault();
      const filter = catCard.getAttribute('data-filter');
      if (searchInput) {
        searchInput.value = filter;
        searchInput.dispatchEvent(new Event('input'));
      }
      // Scroll to featured section
      const featured = document.getElementById('featured');
      if (featured) {
        featured.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---- Smooth active-link highlight on scroll ---- */
  const sections = document.querySelectorAll('section[id], main > section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(function (section) { observer.observe(section); });
  }

})();
