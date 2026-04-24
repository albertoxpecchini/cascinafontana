// ══════════════════════════════════════════════════════════════
// GSAP Shop & Gallery Animations
// ══════════════════════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger);

// ──────────────────────────────────────────────────────────────
// 1. GALLERY ITEMS STAGGER ANIMATION
// ──────────────────────────────────────────────────────────────
function initGalleryAnimation() {
  // Animate gallery items on scroll
  const galleryItems = document.querySelectorAll('#gallery-grid > div');
  
  galleryItems.forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.6,
      delay: index * 0.05,
      ease: 'power2.out'
    });
  });

  // Gallery hover animation
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('mouseenter', function() {
      gsap.to(this, {
        filter: 'brightness(1.1)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    img.addEventListener('mouseleave', function() {
      gsap.to(this, {
        filter: 'brightness(1)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 2. SHOP PRODUCTS GRID ANIMATION
// ──────────────────────────────────────────────────────────────
function initShopAnimation() {
  // Animate product cards in sequence
  const cards = document.querySelectorAll('#shop-grid > div');
  
  cards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: '#shop-grid',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 40,
      rotation: -2,
      scale: 0.9,
      duration: 0.6,
      delay: index * 0.08,
      ease: 'back.out(1.5)'
    });
  });

  // Product card hover effect
  document.querySelectorAll('#shop-grid > div').forEach(card => {
    card.addEventListener('mouseenter', function() {
      gsap.to(this, {
        y: -8,
        boxShadow: '0 20px 40px rgba(62, 207, 142, 0.15)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', function() {
      gsap.to(this, {
        y: 0,
        boxShadow: '0 0px 0px rgba(62, 207, 142, 0)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 3. FILTER BUTTONS ANIMATION
// ──────────────────────────────────────────────────────────────
function initFilterAnimation() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Pulse animation on click
      gsap.fromTo(this, 
        { scale: 1 },
        {
          scale: 0.95,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        }
      );
    });
    
    // Hover animation
    btn.addEventListener('mouseenter', function() {
      gsap.to(this, {
        scale: 1.05,
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
// 4. PAGE TRANSITION ANIMATION
// ──────────────────────────────────────────────────────────────
function initPageAnimation() {
  const hero = document.querySelector('section:first-of-type');
  if (!hero) return;

  // Hero section fade in
  gsap.from(hero, {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out'
  });

  // Hero h1 animation
  const h1 = hero.querySelector('h1');
  if (h1) {
    gsap.from(h1, {
      opacity: 0,
      scale: 0.95,
      y: 30,
      duration: 0.8,
      delay: 0.1,
      ease: 'power2.out'
    });
  }

  // Hero p animation
  const p = hero.querySelector('p.text-white/45, p.text-white/55');
  if (p) {
    gsap.from(p, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out'
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 5. CTA BUTTONS ANIMATIONS
// ──────────────────────────────────────────────────────────────
function initCTAAnimation() {
  document.querySelectorAll('a[href*="shop"], a[href*="contatti"], button[type="submit"]').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      gsap.to(this, {
        scale: 1.05,
        duration: 0.25,
        ease: 'back.out(1.5)'
      });
    });
    btn.addEventListener('mouseleave', function() {
      gsap.to(this, {
        scale: 1,
        duration: 0.25,
        ease: 'back.out(1.5)'
      });
    });

    btn.addEventListener('click', function(e) {
      if (e.button === 0) { // Left click only
        gsap.to(this, {
          scale: 0.97,
          duration: 0.1,
          ease: 'power2.in'
        });
      }
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 6. SCROLL PARALLAX EFFECTS
// ──────────────────────────────────────────────────────────────
function initParallaxAnimation() {
  // Parallax on hero sections
  document.querySelectorAll('section:first-of-type').forEach(section => {
    gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false
      },
      y: -50,
      opacity: 0.8,
      ease: 'none'
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 7. COUNT UP ANIMATIONS FOR NUMBERS
// ──────────────────────────────────────────────────────────────
function initCountUpAnimation() {
  const numberElements = document.querySelectorAll('[data-count]');
  
  numberElements.forEach(el => {
    const count = parseInt(el.dataset.count);
    
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      innerText: count,
      duration: 1.5,
      snap: { innerText: 1 },
      ease: 'power2.out'
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 8. INIT ALL ANIMATIONS
// ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Detect current page and initialize appropriate animations
  const currentPath = window.location.pathname;

  if (currentPath.includes('/galleria')) {
    initGalleryAnimation();
  }

  if (currentPath.includes('/shop')) {
    initShopAnimation();
    initFilterAnimation();
  }

  // Common animations for all pages
  initPageAnimation();
  initCTAAnimation();
  initParallaxAnimation();
  initCountUpAnimation();

  // Navbar scroll effect (already in main, but enhance it)
  const navbar = document.querySelector('header');
  if (navbar) {
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      if (Math.abs(scrollY - lastScrollY) > 50) {
        if (scrollY > 50) {
          gsap.to(navbar, {
            backgroundColor: 'rgba(15, 15, 15, 0.95)',
            duration: 0.3,
            boxShadow: '0 4px 12px rgba(62, 207, 142, 0.06)'
          });
        } else {
          gsap.to(navbar, {
            backgroundColor: 'rgba(15, 15, 15, 0.5)',
            duration: 0.3,
            boxShadow: 'none'
          });
        }
        lastScrollY = scrollY;
      }
    });
  }
});

// ──────────────────────────────────────────────────────────────
// 9. INTERSECTION OBSERVER FOR FADE-IN ELEMENTS
// ──────────────────────────────────────────────────────────────
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animated-in')) {
      entry.target.classList.add('animated-in');
      
      gsap.from(entry.target, {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  });
}, observerOptions);

// Apply to sections and feature cards
setTimeout(() => {
  document.querySelectorAll('section > div[class*="max-w"], .feature-card, [data-animate="true"]').forEach(el => {
    observer.observe(el);
  });
}, 100);
