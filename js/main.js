/* ============================================================
   PRIME NEXUS — main.js
   ============================================================ */

/* ── 1. LANGUAGE SYSTEM ─────────────────────────────────── */
const Lang = (() => {
  const STORAGE_KEY = 'pn_lang';

  function applyLang(lang) {
    document.body.className = lang;

    // data-fr / data-en attributes on any element → set innerHTML
    document.querySelectorAll('[data-fr],[data-en]').forEach(el => {
      const text = el.dataset[lang];
      if (text) el.innerHTML = text;
    });

    // lang-btn active state
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update <html lang>
    document.documentElement.lang = lang === 'fr' ? 'fr' : 'en';

    // Persist
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
  }

  function init() {
    let saved = 'fr';
    try { saved = localStorage.getItem(STORAGE_KEY) || 'fr'; } catch (_) {}
    applyLang(saved);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
  }

  return { init, apply: applyLang };
})();

/* ── 2. MOBILE MENU ─────────────────────────────────────── */
const MobileMenu = (() => {
  function init() {
    const hamburger = document.querySelector('.nav-hamburger');
    const menu      = document.getElementById('mobileMenu');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  return { init };
})();

/* ── 3. NAVBAR SCROLL SHADOW ────────────────────────────── */
const Navbar = (() => {
  function init() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const handler = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
  }
  return { init };
})();

/* ── 4. SCROLL REVEAL ───────────────────────────────────── */
const Reveal = (() => {
  function init() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
  }
  return { init };
})();

/* ── 5. CONTACT FORM ────────────────────────────────────── */
const ContactForm = (() => {
  function init() {
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();

      const btn = form.querySelector('.btn-submit');
      const lang = document.body.className || 'fr';
      btn.disabled = true;
      btn.textContent = lang === 'fr' ? 'Envoi en cours…' : 'Sending…';

      // Collect data
      const data = Object.fromEntries(new FormData(form));

      // --- Replace this block with your actual backend / Formspree endpoint ---
      // Example with Formspree:
      //   const res = await fetch('https://formspree.io/f/YOUR_ID', {
      //     method: 'POST', headers: { 'Accept': 'application/json' },
      //     body: new FormData(form)
      //   });
      //   if (res.ok) { ... }

      // Simulated success for static demo
      await new Promise(r => setTimeout(r, 900));

      console.log('Form submission:', data);
      form.reset();
      success.classList.add('show');
      btn.disabled = false;
      btn.textContent = lang === 'fr' ? 'Envoyer le message' : 'Send message';

      setTimeout(() => success.classList.remove('show'), 6000);
    });
  }
  return { init };
})();

/* ── 6. SMOOTH ANCHOR SCROLL (offset for fixed nav) ─────── */
const SmoothScroll = (() => {
  function init() {
    const NAV_HEIGHT = 72;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
  return { init };
})();

/* ── BOOT ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Lang.init();
  MobileMenu.init();
  Navbar.init();
  Reveal.init();
  ContactForm.init();
  SmoothScroll.init();
});
