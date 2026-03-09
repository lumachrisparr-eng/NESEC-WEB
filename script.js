/* ============================================================
   NESAC CSC HUB — MAIN JAVASCRIPT
   Handles: navbar scroll, mobile menu, scroll reveal,
            contact form validation + Formspree submission
   ============================================================ */

/* ── 1. NAVBAR: add .scrolled class when page is scrolled ── */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ── 2. MOBILE OVERLAY MENU ── */
(function () {
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay   = document.querySelector('.nav-overlay');
  if (!hamburger || !overlay) return;

  function openMenu() {
    hamburger.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close when any overlay link is clicked
  overlay.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ── 3. SCROLL REVEAL ── */
(function () {
  var elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
})();


/* ── 4. SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ── 5. CONTACT FORM — Formspree + client-side validation ──
   HOW TO ACTIVATE:
   1. Go to https://formspree.io and create a free account
   2. Create a new form and copy your endpoint URL
   3. In contact.html, set the form's action="YOUR_FORMSPREE_URL"
      e.g.  action="https://formspree.io/f/xpwzabcd"
   4. That's it — submissions are forwarded to your email.
   ────────────────────────────────────────────────────────── */
(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  var msgEl = document.getElementById('formMessage');

  function showMsg(text, type) {
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className   = 'form__message form__message--' + type;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // ── Client-side validation ──
    var name    = (form.querySelector('#cf-name')?.value    || '').trim();
    var email   = (form.querySelector('#cf-email')?.value   || '').trim();
    var subject = (form.querySelector('#cf-subject')?.value || '').trim();
    var message = (form.querySelector('#cf-message')?.value || '').trim();

    if (!name || !email || !message) {
      showMsg('Please fill in all required fields.', 'error');
      return;
    }

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMsg('Please enter a valid email address.', 'error');
      return;
    }

    // ── Submit to Formspree ──
    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled    = true;
      submitBtn.textContent = 'Sending…';
    }

    try {
      var response = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showMsg('✓ Message sent successfully. We will be in touch shortly.', 'success');
        form.reset();
      } else {
        var data = await response.json();
        var errText = (data.errors || []).map(function (e) { return e.message; }).join(', ')
          || 'Something went wrong. Please try again.';
        showMsg(errText, 'error');
      }
    } catch (err) {
      showMsg('Network error. Please check your connection and try again.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message →';
      }
    }
  });
})();
