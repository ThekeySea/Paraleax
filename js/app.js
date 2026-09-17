/* ========================================
   PARALEAX — CONTINUOUS VECTOR PARALLAX
   Lenis + GSAP ScrollTrigger Engine
   ======================================== */

(function () {
  'use strict';

  var lenis = null;
  var prefersReducedMotion = false;

  function init() {
    detectReducedMotion();
    if (prefersReducedMotion) { initNav(); return; }
    initLenis();
    initGSAP();
    initContinuous();
    initNav();
    window.scrollTo(0, 0);
  }

  function detectReducedMotion() {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mq.matches;
    mq.addEventListener('change', function (e) { prefersReducedMotion = e.matches; });
  }

  /* ========================================
     LENIS
     ======================================== */
  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ========================================
     GSAP SCROLLTRIGGER ENGINE
     ======================================== */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* =============================================
       CONTENT VISIBILITY — separate from scrub
       ============================================= */
    var contentMap = [
      { id: '#section-1', text: '.hero-heading, .hero-sub', start: 'top 80%' },
      { id: '#section-2', text: '#mission-content',        start: 'top 70%' },
      { id: '#section-3', text: '#advantages-content',     start: 'top 70%' },
      { id: '#section-4', text: '#model-content',          start: 'top 70%' },
      { id: '#section-5', text: '#landscape-content',      start: 'top 70%' }
    ];

    contentMap.forEach(function (item) {
      var targets = document.querySelectorAll(item.text);
      if (targets.length === 0) return;

      gsap.set(targets, { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: item.id,
        start: item.start,
        onEnter: function () {
          gsap.to(targets, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 });
        },
        onLeaveBack: function () {
          gsap.to(targets, { opacity: 0, y: 30, duration: 0.3, ease: 'power2.in' });
        }
      });
    });

    /* Show hero content immediately */
    var heroTargets = document.querySelectorAll('.hero-heading, .hero-sub');
    gsap.set(heroTargets, { opacity: 1, y: 0 });

    /* =============================================
       STAGE 01: HERO — parallax scrub
       ============================================= */
    var tl1 = gsap.timeline({
      defaults: { force3D: false },
      scrollTrigger: {
        trigger: '#section-1',
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });

    tl1.to('#section-1 .parallax-slow', { scale: 0.92, y: 50, ease: 'none' }, 0);
    tl1.to('#section-1 .parallax-mid', { y: -80, scale: 1.05, ease: 'none' }, 0);
    tl1.to('#section-1 .parallax-float', { y: -120, ease: 'none' }, 0);
    tl1.to('#seam-hero-river', { scaleY: 1.3, transformOrigin: 'bottom center', ease: 'none' }, 0);

    /* =============================================
       STAGE 02: WATERFALL — parallax + waterfall line scrub
       ============================================= */
    var tl2 = gsap.timeline({
      defaults: { force3D: false },
      scrollTrigger: {
        trigger: '#section-2',
        start: 'top top',
        end: '+=120%',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1
      }
    });

    var waterfallLines2 = document.querySelectorAll('#waterfall-curtain .waterfall-line');
    waterfallLines2.forEach(function (line, i) {
      var len = line.getTotalLength ? line.getTotalLength() : 1100;
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      tl2.to(line, { strokeDashoffset: 0, ease: 'none' }, i * 0.06);
    });

    tl2.to('#section-2 .parallax-slow', { y: 30, ease: 'none' }, 0);
    tl2.to('#section-2 .parallax-float', { y: -60, ease: 'none' }, 0);

    /* =============================================
       STAGE 03: TURBINE — parallax + turbine rotation
       ============================================= */
    var tl3 = gsap.timeline({
      defaults: { force3D: false },
      scrollTrigger: {
        trigger: '#section-3',
        start: 'top top',
        end: '+=120%',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1
      }
    });

    var turbineBlades = document.getElementById('turbine-blades');
    if (turbineBlades) {
      tl3.to(turbineBlades, { rotation: 180, transformOrigin: '0 0', ease: 'none' }, 0);
    }

    tl3.to('#section-3 .parallax-slow', { y: 25, ease: 'none' }, 0);
    tl3.to('#section-3 .parallax-float', { y: -40, ease: 'none' }, 0);

    /* =============================================
       STAGE 04: MOLTEN ENERGY — parallax scrub
       ============================================= */
    var tl4 = gsap.timeline({
      defaults: { force3D: false },
      scrollTrigger: {
        trigger: '#section-4',
        start: 'top top',
        end: '+=150%',
        pin: true,
        pinSpacing: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    tl4.to('#section-4 .parallax-slow', { y: 20, ease: 'none' }, 0);
    tl4.to('#section-4 .parallax-float', { y: -80, ease: 'none' }, 0);

    /* =============================================
       STAGE 05: SUNSET — parallax scrub
       ============================================= */
    var tl5 = gsap.timeline({
      defaults: { force3D: false },
      scrollTrigger: {
        trigger: '#section-5',
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });

    tl5.to('#section-5 .parallax-mid', { y: -60, ease: 'none' }, 0);
    tl5.to('#section-5 .parallax-float', { y: -30, ease: 'none' }, 0);

    /* =============================================
       NAV ACTIVE
       ============================================= */
    var sectionKeys = ['s1', 's2', 's3', 's4', 's5'];
    var sectionIds = ['section-1', 'section-2', 'section-3', 'section-4', 'section-5'];
    sectionIds.forEach(function (id, i) {
      ScrollTrigger.create({
        trigger: '#' + id,
        start: 'top 30%',
        end: 'bottom 70%',
        onEnter: function () { updateNavActive(sectionKeys[i]); },
        onEnterBack: function () { updateNavActive(sectionKeys[i]); }
      });
    });

    /* =============================================
       REFRESH
       ============================================= */
    refreshAll();
    window.addEventListener('load', function () {
      requestAnimationFrame(function () { refreshAll(); });
    });
  }

  function refreshAll() {
    ScrollTrigger.refresh();
    if (lenis && lenis.resize) lenis.resize();
  }

  /* ========================================
     CONTINUOUS ANIMATIONS
     ======================================== */
  function initContinuous() {
    var t0 = performance.now();

    var riverWave = document.getElementById('riverWave');
    var clouds = document.querySelectorAll('.cloud');
    var bubbles2 = document.querySelectorAll('#bubbles-s2 .bubble');
    var bubbles4 = document.querySelectorAll('#bubbles-s4 .bubble');

    /* Cache base positions for clouds and bubbles */
    var cloudBaseX = [];
    clouds.forEach(function (cloud) {
      cloudBaseX.push(parseFloat(cloud.getAttribute('cx')) || 0);
    });

    var bubble2Base = [];
    bubbles2.forEach(function (bubble) {
      bubble2Base.push({
        x: parseFloat(bubble.getAttribute('cx')) || 0,
        y: parseFloat(bubble.getAttribute('cy')) || 0
      });
    });

    var bubble4Base = [];
    bubbles4.forEach(function (bubble) {
      bubble4Base.push({
        x: parseFloat(bubble.getAttribute('cx')) || 0,
        y: parseFloat(bubble.getAttribute('cy')) || 0
      });
    });

    gsap.ticker.add(function () {
      var t = (performance.now() - t0) * 0.001;

      /* River wave */
      if (riverWave) {
        var y1 = 15 + Math.sin(t * 1.2) * 5;
        var y2 = 15 + Math.sin(t * 1.2 + 1) * 4;
        var y3 = 15 + Math.sin(t * 1.2 + 2) * 6;
        riverWave.setAttribute('d',
          'M0,' + y1 + ' Q480,' + y2 + ' 960,' + (15 + Math.sin(t * 1.2 + 0.5) * 5) +
          ' Q1440,' + y3 + ' 1920,' + y1 + ' L1920,0 L0,0 Z'
        );
      }

      /* Cloud drift */
      clouds.forEach(function (cloud, i) {
        var speed = 0.15 + i * 0.04;
        var offsetX = Math.sin(t * speed + i * 2) * 40;
        cloud.setAttribute('cx', cloudBaseX[i] + offsetX);
      });

      /* Bubble rise (S2) */
      bubbles2.forEach(function (bubble, i) {
        var rise = (t * (15 + i * 5)) % 200;
        var drift = Math.sin(t * 1.5 + i * 1.2) * 12;
        bubble.setAttribute('cy', bubble2Base[i].y - rise);
        bubble.setAttribute('cx', bubble2Base[i].x + drift);
        var opacity = 1 - (rise / 200);
        bubble.style.opacity = Math.max(0.05, opacity * 0.6);
        if (rise > 180) {
          bubble.setAttribute('cy', bubble2Base[i].y);
        }
      });

      /* Bubble rise (S4) */
      bubbles4.forEach(function (bubble, i) {
        var rise = (t * (18 + i * 6)) % 250;
        var drift = Math.sin(t * 1.3 + i * 1.5) * 15;
        bubble.setAttribute('cy', bubble4Base[i].y - rise);
        bubble.setAttribute('cx', bubble4Base[i].x + drift);
        var opacity = 1 - (rise / 250);
        bubble.style.opacity = Math.max(0.05, opacity * 0.7);
        if (rise > 230) {
          bubble.setAttribute('cy', bubble4Base[i].y);
        }
      });
    });
  }

  /* ========================================
     NAVIGATION
     ======================================== */
  function initNav() {
    var hamburger = document.querySelector('.glass-nav__hamburger');
    var mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        var exp = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!exp));
        mobileMenu.setAttribute('aria-hidden', String(exp));
        document.body.style.overflow = exp ? '' : 'hidden';
      });
      var mLinks = mobileMenu.querySelectorAll('.mobile-link');
      for (var i = 0; i < mLinks.length; i++) {
        mLinks[i].addEventListener('click', function () {
          hamburger.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        });
      }
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
          hamburger.setAttribute('aria-expanded', 'false');
          mobileMenu.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          hamburger.focus();
        }
      });
    }

    var allLinks = document.querySelectorAll('.glass-nav__link, .glass-nav__cta, .glass-nav__logo, .mobile-link');
    for (var k = 0; k < allLinks.length; k++) {
      allLinks[k].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) {
            if (lenis) { lenis.scrollTo(target, { offset: 0 }); }
            else { target.scrollIntoView({ behavior: 'smooth' }); }
          }
        }
      });
    }

    /* Scroll-down arrow → Section 2 */
    var scrollDownBtn = document.getElementById('scroll-down');
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener('click', function () {
        var target = document.getElementById('section-2');
        if (target) {
          if (lenis) { lenis.scrollTo(target, { offset: 0 }); }
          else { target.scrollIntoView({ behavior: 'smooth' }); }
        }
      });
    }
  }

  function updateNavActive(activeKey) {
    var desktopLinks = document.querySelectorAll('.glass-nav__link[data-nav]');
    for (var d = 0; d < desktopLinks.length; d++) {
      if (desktopLinks[d].getAttribute('data-nav') === activeKey) {
        desktopLinks[d].classList.add('is-active');
      } else {
        desktopLinks[d].classList.remove('is-active');
      }
    }
    var mobileLinks = document.querySelectorAll('.mobile-link[data-section]');
    for (var m = 0; m < mobileLinks.length; m++) {
      if (mobileLinks[m].getAttribute('data-section') === activeKey) {
        mobileLinks[m].classList.add('is-active');
      } else {
        mobileLinks[m].classList.remove('is-active');
      }
    }
  }

  /* ========================================
     BOOT
     ======================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 100);
    });
  } else {
    setTimeout(init, 100);
  }

})();
