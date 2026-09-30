/**
 * LOMESH PAWAR — DEVELOPER PORTFOLIO
 * Lightweight, accessible, performant vanilla JavaScript.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. THEME TOGGLE (DARK / LIGHT)
  // ---------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to dark
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Default to dark theme for professional developer look
    return 'dark';
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const current = htmlRoot.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // ---------------------------------------------------------------------------
  // 2. MOBILE MENU TOGGLE
  // ---------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(isOpen) {
    const currentState = mobileMenuDrawer.classList.contains('open');
    const shouldOpen = isOpen !== undefined ? isOpen : !currentState;

    if (shouldOpen) {
      mobileMenuDrawer.classList.add('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileMenuDrawer.setAttribute('aria-hidden', 'false');
    } else {
      mobileMenuDrawer.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileMenuDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', function () {
      toggleMobileMenu();
    });

    // Close when clicking on any mobile nav link
    mobileNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggleMobileMenu(false);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenuDrawer.classList.contains('open')) {
        toggleMobileMenu(false);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 3. ACTIVE SECTION HIGHLIGHTING (INTERSECTION OBSERVER)
  // ---------------------------------------------------------------------------
  const trackedSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if ('IntersectionObserver' in window && trackedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          updateActiveNavLinks(sectionId);
        }
      });
    }, observerOptions);

    trackedSections.forEach(function (sec) {
      sectionObserver.observe(sec);
    });

    function updateActiveNavLinks(currentId) {
      desktopNavLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === '#' + currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      mobileNavLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === '#' + currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 4. PROJECT FILTERING
  // ---------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectEntries = document.querySelectorAll('.project-entry');

  if (filterBtns.length > 0 && projectEntries.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Active button styling
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterValue = btn.getAttribute('data-filter');

        projectEntries.forEach(function (entry) {
          const categories = entry.getAttribute('data-category') || '';
          if (filterValue === 'all' || categories.split(' ').includes(filterValue)) {
            entry.classList.remove('hidden');
          } else {
            entry.classList.add('hidden');
          }
        });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 5. COPY EMAIL TO CLIPBOARD WITH TOAST FEEDBACK
  // ---------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toast.classList.remove('show');
    }, 2600);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function () {
      const email = copyEmailBtn.getAttribute('data-email') || 'lomeshpawar11@gmail.com';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          if (copyBtnText) copyBtnText.textContent = 'Copied!';
          showToast('Email copied to clipboard: ' + email);
          setTimeout(function () {
            if (copyBtnText) copyBtnText.textContent = 'Copy Email';
          }, 2000);
        }).catch(function () {
          fallbackCopyText(email);
        });
      } else {
        fallbackCopyText(email);
      }
    });
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      if (copyBtnText) copyBtnText.textContent = 'Copied!';
      showToast('Email copied to clipboard: ' + text);
      setTimeout(function () {
        if (copyBtnText) copyBtnText.textContent = 'Copy Email';
      }, 2000);
    } catch (err) {
      showToast('Please copy manually: ' + text);
    }
    document.body.removeChild(tempInput);
  }

  // ---------------------------------------------------------------------------
  // 6. DIRECT CONTACT NOTE (MAILTO GENERATOR - NO BACKEND NEEDED)
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'Inquiry for Lomesh Pawar';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!message) {
        showToast('Please enter a message before sending.');
        return;
      }

      const bodyText = `Hi Lomesh,\n\n${message}\n\nBest regards,\n${name}`;
      const mailtoUrl = `mailto:lomeshpawar11@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

      // Open email client
      window.location.href = mailtoUrl;
      showToast('Opening your email application...');

      // Reset form fields
      contactForm.reset();
    });
  }

})();
