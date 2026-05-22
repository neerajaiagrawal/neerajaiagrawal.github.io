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
