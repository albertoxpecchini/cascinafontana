// ══════════════════════════════════════════════════════════════
// GSAP Animations — Cascina Fontana
// ══════════════════════════════════════════════════════════════

if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ──────────────────────────────────────────────────────────────
// 1. HERO SECTION ANIMATION
// ──────────────────────────────────────────────────────────────
function initHeroAnimation() {
  const ctaButtons = gsap.utils.toArray('#hero-cta a');

  // Hard safety: buttons must always be visible before animating
  gsap.set(ctaButtons, { autoAlpha: 1, clearProps: 'opacity,visibility' });

  const tl = gsap.timeline();
  
  // Pill announcement — fade in from bottom
  tl.from('.pill-announcement', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out'
  }, 0);

  // H1 title — stagger word reveal with scale
  tl.from('#hero-title span', {
    opacity: 0,
    y: 40,
    scale: 0.95,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  }, 0.1);

  // Subtitle — fade in
  tl.from('.hero-subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out'
  }, 0.3);

  // CTA buttons — stagger with bounce
  tl.from(ctaButtons, {
    autoAlpha: 0,
    y: 15,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.7)',
    immediateRender: false
  }, 0.5);

  // Button hover effect
  ctaButtons.forEach(btn => {

    btn.addEventListener('mouseenter', function() {
      gsap.to(this, {
        scale: 1.04,
        duration: 0.2,
        ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', function() {
      gsap.to(this, {
        scale: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 2. NAVBAR ANIMATION
// ──────────────────────────────────────────────────────────────
function initNavbarAnimation() {
  const navbar = document.querySelector('header');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Toggle navbar shadow on scroll
    if (scrollY > 20) {
      gsap.to(navbar, {
        boxShadow: '0 4px 16px rgba(62, 207, 142, 0.08)',
        duration: 0.3
      });
    } else {
      gsap.to(navbar, {
        boxShadow: 'none',
        duration: 0.3
      });
    }
    
    lastScrollY = scrollY;
  });

  // Keep nav link colors managed by CSS utility classes to avoid accidental invisibility.
}

// ──────────────────────────────────────────────────────────────
// 3. SCROLL TRIGGER ANIMATIONS
// ──────────────────────────────────────────────────────────────
function initScrollTriggerAnimations() {
  // Animate marquee on scroll (parallax effect)
  gsap.to('.animate-marquee', {
    scrollTrigger: {
      trigger: '.relative.overflow-hidden',
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      markers: false
    },
    opacity: 0.5,
    duration: 1
  });
}

// ──────────────────────────────────────────────────────────────
// 4. PILL ANNOUNCEMENT HOVER ANIMATION
// ──────────────────────────────────────────────────────────────
function initPillAnimation() {
  const pill = document.querySelector('.pill-announcement');
  if (!pill) return;

  pill.addEventListener('mouseenter', function() {
    gsap.to(this, {
      borderColor: 'rgba(255,255,255,0.3)',
      backgroundColor: 'rgba(255,255,255,0.08)',
      duration: 0.3,
      ease: 'power2.out'
    });
    gsap.to(this.querySelector('svg'), {
      x: 4,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  pill.addEventListener('mouseleave', function() {
    gsap.to(this, {
      borderColor: 'rgba(255,255,255,0.15)',
      backgroundColor: 'rgba(0,0,0,0)',
      duration: 0.3,
      ease: 'power2.out'
    });
    gsap.to(this.querySelector('svg'), {
      x: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 5. FLOATING ELEMENTS ANIMATION
// ──────────────────────────────────────────────────────────────
function initFloatingAnimation() {
  // Animate hero title with subtle floating effect
  gsap.to('#hero-title', {
    y: 4,
    duration: 6,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

// ──────────────────────────────────────────────────────────────
// 5b. CERTIFICAZIONI BADGE ANIMATION
// ──────────────────────────────────────────────────────────────
function initCertBadges() {
  const section = document.getElementById('cert-section');
  if (!section) return;

  const badges = section.querySelectorAll('.group');
  if (!badges.length) return;

  gsap.set(badges, { opacity: 0, y: 28, scale: 0.75 });

  ScrollTrigger.create({
    trigger: section,
    start:   'top 78%',
    once:    true,
    onEnter: () => {
      const tl = gsap.timeline();

      tl.from(section.querySelector('p'), {
        opacity: 0, y: 10, duration: 0.4, ease: 'power2.out',
      }, 0);

      tl.to(badges, {
        opacity:  1,
        y:        0,
        scale:    1,
        duration: 0.55,
        stagger:  0.13,
        ease:     'back.out(1.8)',
      }, 0.25);

      tl.to(section.querySelectorAll('svg'), {
        scale:    [1, 1.28, 1],
        duration: 0.4,
        stagger:  0.13,
        ease:     'power2.inOut',
      }, 0.90);
    },
  });

  badges.forEach(badge => {
    const icon = badge.querySelector('svg');
    const box  = badge.querySelector('div');

    badge.addEventListener('mouseenter', () => {
      gsap.to(icon, { scale: 1.22, rotate: 10, duration: 0.22, ease: 'back.out(2)' });
      gsap.to(box,  { y: -5, duration: 0.22, ease: 'power2.out' });
    });
    badge.addEventListener('mouseleave', () => {
      gsap.to(icon, { scale: 1, rotate: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)' });
      gsap.to(box,  { y: 0,  duration: 0.35, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 6. INIT ALL ANIMATIONS
// ──────────────────────────────────────────────────────────────
function initAllAnimations() {
  // Add class for targeting
  const pill = document.querySelector('section a[href="/novita"]');
  if (pill && pill.querySelector('svg')) {
    pill.classList.add('pill-announcement');
  }

  // Avoid class selectors with '/' to prevent invalid selector runtime errors
  const subtitle = document.querySelector('#hero-title + p') || document.querySelector('section p[style*="clamp"]');
  if (subtitle) {
    subtitle.classList.add('hero-subtitle');
  }

  // Initialize animations
  initHeroAnimation();
  initNavbarAnimation();
  initPillAnimation();
  initScrollTriggerAnimations();
  initFloatingAnimation();
  initCertBadges();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
  initAllAnimations();
}

// ──────────────────────────────────────────────────────────────
// 7. REACTIVE ANIMATIONS FOR DYNAMIC ELEMENTS
// ──────────────────────────────────────────────────────────────
// Observer per animare elementi quando entrano nel viewport
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
      entry.target.classList.add('animated');
      gsap.from(entry.target, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  });
}, observerOptions);

// Apply observer to cards/sections (you can customize this based on your DOM structure)
setTimeout(() => {
  document.querySelectorAll('section > div[class*="max-w"]').forEach(el => {
    observer.observe(el);
  });
}, 100);
