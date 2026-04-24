// ══════════════════════════════════════════════════════════════
// GSAP Animations — Cascina Fontana
// ══════════════════════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

// ──────────────────────────────────────────────────────────────
// 1. HERO SECTION ANIMATION
// ──────────────────────────────────────────────────────────────
function initHeroAnimation() {
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
  tl.from('#hero-cta a', {
    opacity: 0,
    y: 15,
    duration: 0.6,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  }, 0.5);

  // Button hover effect
  document.querySelectorAll('#hero-cta a').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      gsap.to(this, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', function() {
      gsap.to(this, {
        scale: 1,
        duration: 0.3,
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

  // Nav links hover animation
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('mouseenter', function() {
      gsap.to(this, {
        color: '#3ECF8E',
        duration: 0.2
      });
    });
    link.addEventListener('mouseleave', function() {
      gsap.to(this, {
        color: 'rgba(255,255,255,0.65)',
        duration: 0.2
      });
    });
  });
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
    y: 10,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}

// ──────────────────────────────────────────────────────────────
// 6. INIT ALL ANIMATIONS
// ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Add class for targeting
  const pill = document.querySelector('a[href="/novita"]');
  if (pill && pill.querySelector('svg')) {
    pill.classList.add('pill-announcement');
  }

  const subtitle = document.querySelector('p[style*="font-size"]');
  if (subtitle) {
    subtitle.classList.add('hero-subtitle');
  }

  // Initialize animations
  initHeroAnimation();
  initNavbarAnimation();
  initPillAnimation();
  initScrollTriggerAnimations();
  initFloatingAnimation();
});

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
