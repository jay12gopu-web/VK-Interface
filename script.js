const SITE_URL = 'https://jay12gopu-web.github.io/Visit-Kerala/';

const refreshIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons({
      attrs: {
        'stroke-width': 1.8
      }
    });
  }
};

const copyText = async text => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  document.execCommand('copy');
  field.remove();
};

document.addEventListener('DOMContentLoaded', () => {
  refreshIcons();

  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const copyButton = document.getElementById('copy-link');
  const toast = document.getElementById('copy-toast');
  const year = document.getElementById('year');
  let toastTimer;

  const updateNavbar = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 24);
  };

  const setMenuState = open => {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.toggle('mobile-active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuToggle.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" aria-hidden="true"></i>`;
    refreshIcons();
  };

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });

  menuToggle?.addEventListener('click', () => {
    setMenuState(!navLinks.classList.contains('mobile-active'));
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuState(false));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setMenuState(false);
    }
  });

  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(element => element.classList.add('active'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -35px'
    });

    revealElements.forEach(element => revealObserver.observe(element));
  }

  copyButton?.addEventListener('click', async () => {
    try {
      await copyText(SITE_URL);
      toast?.classList.add('visible');
      window.clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast?.classList.remove('visible'), 2400);
    } catch {
      window.open(SITE_URL, '_blank', 'noopener');
    }
  });

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
});
