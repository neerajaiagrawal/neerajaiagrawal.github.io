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
