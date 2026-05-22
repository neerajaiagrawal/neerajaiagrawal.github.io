// ===== DARK MODE TOGGLE =====
(function () {
  const html = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Brief transition class for smooth colour switch
    html.classList.add('transitioning');
    setTimeout(() => html.classList.remove('transitioning'), 300);

    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
      html.removeAttribute('data-theme');
      try { localStorage.setItem('theme', 'light'); } catch(e) {}
    } else {
      html.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('theme', 'dark'); } catch(e) {}
    }
  });
})();

// Nav scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
}, { passive: true });

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinksList = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});
navLinksList.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinksList.classList.remove('open'));
});

// Scroll-reveal: cards animate in when they enter the viewport
const revealEls = document.querySelectorAll('.skill-card, .project-card, .recognition-card, .edu-card, .testimonial-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), Number(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// ===== ANIMATED COUNTERS =====
(function () {
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.counter, 10);
    const start    = parseInt(el.dataset.start || 0, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = parseInt(el.dataset.duration || 1400, 10);
    const startTs  = performance.now();

    function tick(now) {
      const elapsed  = now - startTs;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(start + easeOutCubic(progress) * (target - start));
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (!counterEls.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.done) {
        entry.target.dataset.done = '1';
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counterEls.forEach(el => io.observe(el));
})();

// ===== EXAMS COLLAPSIBLE =====
(function () {
  const toggle = document.querySelector('.exams-toggle');
  const grid   = document.getElementById('examsGrid');
  if (!toggle || !grid) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    grid.classList.toggle('open', !open);
  });
})();

// ===== HERO TYPED / CYCLING SUBTITLE =====
(function () {
  const el = document.getElementById('heroTyped');
  if (!el) return;

  const phrases = [
    'Principal Architect',
    'Agentic AI Solutions Architect',
    'Enterprise CRM Architect',
    'Techno Functional CRM Executive',
    'Power Platform Architect',
    'AI Business Solutions Architect',
    'Power CAT Trainer',
    'AI Strategist',
    'Digital Transformation Lead',
  ];
  let pIdx = 0, shown = 0, deleting = false;

  function tick() {
    const word = phrases[pIdx];
    if (!deleting) {
      shown++;
      el.textContent = word.slice(0, shown);
      if (shown === word.length) {
        deleting = true;
        setTimeout(tick, 2400);          // pause at end before erasing
      } else {
        setTimeout(tick, 75);            // typing speed
      }
    } else {
      shown--;
      el.textContent = word.slice(0, shown);
      if (shown === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tick, 420);           // pause before typing next
      } else {
        setTimeout(tick, 38);            // erasing speed (faster)
      }
    }
  }

  tick();
})();

// ===== CAROUSELS (Projects · Education · Testimonials) =====
(function () {
  function initCarousel(container) {
    const track   = container.querySelector('.carousel-track');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    const dots    = container.querySelectorAll('.carousel-dot');
    const counter = container.querySelector('.carousel-counter');
    if (!track || !prevBtn) return;

    const cards = Array.from(track.children);
    const total = cards.length;
    let current = 0;

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, total - 1));
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      if (counter) counter.textContent = `${current + 1} / ${total}`;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === total - 1;
      cards[current].scrollTop = 0;
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Touch / swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    // Keyboard — only fires for the carousel most centred in the viewport
    document.addEventListener('keydown', e => {
      const rect = track.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    });

    goTo(0);
  }

  document.querySelectorAll('.carousel-container').forEach(initCarousel);
})();

// ===== CONTACT FORM — async submit with success state =====
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Sending&nbsp;…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.innerHTML = `
          <div class="form-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--ms-blue)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h3>Message sent!</h3>
            <p>Thanks for reaching out — I'll get back to you shortly.</p>
          </div>`;
      } else {
        btn.innerHTML = original;
        btn.disabled = false;
        showFormError(form, 'Something went wrong. Please email me directly at neeraj.agrawal@zohomail.com');
      }
    } catch (err) {
      btn.innerHTML = original;
      btn.disabled = false;
      showFormError(form, 'Network error. Please try again or email me directly.');
    }
  });

  function showFormError(form, msg) {
    let el = form.querySelector('.form-error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'form-error';
      form.appendChild(el);
    }
    el.textContent = msg;
  }
})();

// ===== BACK TO TOP =====
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
