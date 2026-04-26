
  // ── LOADING SCREEN ──────────────────────────────────────────────
  window.addEventListener('load', () => {
    const fill   = document.getElementById('loadingFill');
    const screen = document.getElementById('loadingScreen');
    if (!fill || !screen) return;

    // Animate fill bar
    requestAnimationFrame(() => { fill.style.width = '100%'; });

    setTimeout(() => {
      screen.classList.add('hidden');
      setTimeout(() => screen.remove(), 600);
      // Trigger AOS after load
      initAOS();
      generateParticles();
      startCounters();
    }, 2200);
  });

  // ── PARTICLES ───────────────────────────────────────────────────
  function generateParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 25;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      p.style.setProperty('--dur',   (6 + Math.random() * 8) + 's');
      p.style.setProperty('--delay', (Math.random() * 8)     + 's');
      p.style.left  = (Math.random() * 100) + '%';
      p.style.width = p.style.height = (3 + Math.random() * 4) + 'px';
      container.appendChild(p);
    }
  }

  // ── NAVBAR SCROLL BEHAVIOUR ─────────────────────────────────────
  const nav = document.getElementById('mainNav');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Nav shrink
    if (nav) nav.classList.toggle('scrolled', scrollY > 60);

    // Scroll-to-top button
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrollY > 400);

    // Active nav link
    updateActiveNav();
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(sec => {
      if (window.scrollY + 120 >= sec.offsetTop) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  // Smooth-close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const navCollapse = document.getElementById('navMenu');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // ── SCROLL TO TOP ───────────────────────────────────────────────
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── AOS (Animate On Scroll — vanilla) ──────────────────────────
  function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.aosDelay
            ? parseInt(entry.target.dataset.aosDelay)
            : 0;
          setTimeout(() => entry.target.classList.add('aos-animate'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
  }

  // ── COUNTER ANIMATION ───────────────────────────────────────────
  function startCounters() {
    const statNums = document.querySelectorAll('.stat-num');
    if (!statNums.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => observer.observe(el));
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target) || 0;
    const duration = 2000;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current).toLocaleString('ar');
    }, 16);
  }

  // ── PROJECTS FILTER ─────────────────────────────────────────────
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      document.querySelectorAll('.project-item').forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        if (show) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              item.style.transition = 'opacity 0.4s, transform 0.4s';
              item.style.opacity    = '1';
              item.style.transform  = 'scale(1)';
            }, 50);
          });
        } else {
          item.style.transition = 'opacity 0.3s';
          item.style.opacity    = '0';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ── TESTIMONIALS SLIDER ─────────────────────────────────────────
  (function initSlider() {
    const track    = document.getElementById('testimonialsTrack');
    const dotsWrap = document.getElementById('sliderDots');
    if (!track) return;

    const cards    = track.querySelectorAll('.testimonial-card');
    const perView  = window.innerWidth < 768 ? 1 : 2;
    const total    = cards.length;
    const maxIndex = Math.ceil(total / perView) - 1;
    let current    = 0;
    let autoTimer;

    // Build dots
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIndex));
      const cardW = cards[0].offsetWidth + 24; // gap
      track.style.transform = `translateX(${current * cardW * perView}px)`;

      dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) =>
        d.classList.toggle('active', i === current)
      );
      resetAuto();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current < maxIndex ? current + 1 : 0), 5000);
    }

    document.getElementById('nextBtn').addEventListener('click', () =>
      goTo(current < maxIndex ? current + 1 : 0)
    );
    document.getElementById('prevBtn').addEventListener('click', () =>
      goTo(current > 0 ? current - 1 : maxIndex)
    );

    // Swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    resetAuto();
  })();

  // ── BEFORE/AFTER TOGGLE ─────────────────────────────────────────
  function toggleBA(el) {
    el.classList.toggle('on');
    const item   = el.closest('.before-after-toggle');
    const before = item.querySelector('.before');
    const after  = item.querySelector('.after');

    if (el.classList.contains('on')) {
      before.classList.remove('active-ba');
      after.classList.add('active-ba');
    } else {
      after.classList.remove('active-ba');
      before.classList.add('active-ba');
    }
  }

  // ── PROJECT MODAL ───────────────────────────────────────────────
  function openModal(el) {
    document.getElementById('projectModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    return false;
  }

  function closeModal() {
    document.getElementById('projectModal').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ── CONTACT FORM ─────────────────────────────────────────────────
  function submitForm(e) {
    e.preventDefault();
    const form    = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const btn     = form.querySelector('button[type=submit]');

    // Button loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    btn.disabled  = true;

    // Simulate async submit
    setTimeout(() => {
      form.style.display    = 'none';
      success.classList.remove('d-none');
    }, 1500);
  }

  // ── TYPED EFFECT in HERO (subtle cursor blink) ──────────────────
  (function typedEffect() {
    const el = document.querySelector('.highlight-stroke');
    if (!el) return;

    const words   = ['التسربات', 'الرطوبة', 'العزل', 'المشاكل'];
    let wordIdx   = 0;
    let charIdx   = 0;
    let deleting  = false;
    let paused    = false;

    function tick() {
      const word = words[wordIdx];

      if (paused) {
        paused = false;
        setTimeout(tick, 1500);
        return;
      }

      if (!deleting) {
        el.textContent = word.slice(0, ++charIdx);
        if (charIdx === word.length) { deleting = true; paused = true; }
      } else {
        el.textContent = word.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          wordIdx  = (wordIdx + 1) % words.length;
        }
      }
      setTimeout(tick, deleting ? 60 : 100);
    }
    setTimeout(tick, 2500);
  })();

  // ── SERVICE CARDS hover tilt ────────────────────────────────────
  document.querySelectorAll('.service-card:not(.service-cta-card)').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -5;
      const rotY   = ((x - cx) / cx) *  5;
      this.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

  // ── WHY CARDS ripple click ──────────────────────────────────────
  document.querySelectorAll('.why-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);

      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY  - rect.top  - size/2}px;
        background:rgba(30,111,191,0.15);
        transform:scale(0); animation:ripple 0.6s ease-out forwards;
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = '@keyframes ripple { to { transform:scale(2); opacity:0; } }';
  document.head.appendChild(style);

  // ── NAVBAR SCROLL PROGRESS BAR ──────────────────────────────────
  (function progressBar() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position:fixed; top:0; right:0; left:0; height:3px; z-index:9999;
      background:linear-gradient(90deg,#1a4a8a,#3a9fd6);
      transform-origin:left; transform:scaleX(0); transition:transform 0.1s;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const winH  = document.documentElement.scrollHeight - window.innerHeight;
      const pct   = window.scrollY / winH;
      bar.style.transform = `scaleX(${pct})`;
    });
  })();

  // ── LAZY IMAGE REVEAL (placeholder shimmer) ──────────────────────
  document.querySelectorAll('.project-img-placeholder').forEach((el, i) => {
    el.style.animationDelay = (i * 0.1) + 's';
  });

  // ── SMOOTH ANCHOR OFFSET (for fixed nav) ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id  = this.getAttribute('href').slice(1);
      const sec = document.getElementById(id);
      if (!sec) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: sec.offsetTop - offset, behavior: 'smooth' });
    });
  });

  // ── RESIZE HANDLER ───────────────────────────────────────────────
  window.addEventListener('resize', () => {
    // re-center slider on resize
    const track = document.getElementById('testimonialsTrack');
    if (track) track.style.transform = 'translateX(0)';
  });
