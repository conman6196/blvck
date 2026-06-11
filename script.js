(function () {
  'use strict';

  /* Header scroll state */
  const header = document.getElementById('header');
  let lastScroll = 0;

  function updateHeader() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    lastScroll = y;
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* Hero parallax on scroll */
  const heroProduct = document.querySelector('.hero-product-img');
  const heroOrbs = document.querySelectorAll('.hero-orb');

  function heroParallax() {
    if (!heroProduct) return;
    const hero = document.getElementById('hero');
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
    const translateY = progress * 120;
    const rotate = progress * 8;
    const scale = 1 - progress * 0.15;

    heroProduct.style.transform = `translateY(${translateY}px) rotate(${-2 + rotate}deg) scale(${scale})`;

    heroOrbs.forEach((orb, i) => {
      const dir = i === 0 ? 1 : -1;
      orb.style.transform = `translate(${progress * 40 * dir}px, ${progress * 60 * dir}px)`;
    });
  }

  window.addEventListener('scroll', heroParallax, { passive: true });

  /* Scroll-driven horizontal gallery */
  const gallery = document.getElementById('scrollGallery');
  const galleryTrack = document.querySelector('.scroll-gallery-track');
  const galleryBar = document.getElementById('galleryBar');

  function updateGallery() {
    if (!gallery || !galleryTrack) return;

    const rect = gallery.getBoundingClientRect();
    const scrollable = gallery.offsetHeight - window.innerHeight;

    if (scrollable <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollable));

    const trackWidth = galleryTrack.scrollWidth;
    const viewWidth = galleryTrack.parentElement.offsetWidth;
    const maxTranslate = trackWidth - viewWidth + 80;

    galleryTrack.style.transform = `translateX(${-progress * maxTranslate}px)`;

    if (galleryBar) {
      galleryBar.style.width = `${progress * 100}%`;
    }
  }

  window.addEventListener('scroll', updateGallery, { passive: true });
  window.addEventListener('resize', updateGallery, { passive: true });
  updateGallery();

  /* Cursor glow (desktop only) */
  const glow = document.querySelector('.cursor-glow');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window;

  if (glow && !prefersReducedMotion && !isTouch) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });
  } else if (glow) {
    glow.style.display = 'none';
  }

  /* Manifesto text scale on scroll */
  const manifestoLines = document.querySelectorAll('.manifesto-line');

  function updateManifesto() {
    const manifesto = document.querySelector('.manifesto');
    if (!manifesto) return;

    const rect = manifesto.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const dist = Math.abs(rect.top + rect.height / 2 - center);
    const progress = Math.max(0, 1 - dist / (window.innerHeight * 0.6));

    manifestoLines.forEach((line, i) => {
      const offset = (i - 1.5) * 8 * (1 - progress);
      line.style.transform = `translateY(${offset}px)`;
      line.style.opacity = 0.4 + progress * 0.6;
    });
  }

  window.addEventListener('scroll', updateManifesto, { passive: true });

  /* Notify form */
  const form = document.getElementById('notifyForm');
  const success = document.getElementById('notifySuccess');
  const error = document.getElementById('notifyError');
  const submitBtn = document.getElementById('notifySubmit');
  const NOTIFY_EMAIL = 'thakur.saurabh6196@gmail.com';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (error) error.hidden = true;

      const emailInput = form.querySelector('input[name="email"]');
      const honeyInput = form.querySelector('input[name="_honey"]');
      const email = emailInput ? emailInput.value.trim() : '';

      if (honeyInput && honeyInput.value) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email,
            _subject: 'BLVCK — New waitlist signup',
            _template: 'table',
            _captcha: 'false',
          }),
        });

        const data = await response.json();

        if (!response.ok || data.success !== 'true') {
          throw new Error('Submission failed');
        }

        form.style.display = 'none';
        if (success) success.hidden = false;
      } catch (err) {
        if (error) error.hidden = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Notify Me';
        }
      }
    });
  }

  /* Smooth anchor offset for fixed header */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
