/* ========================================
   CONTINUOUS WORLD — JS ENGINE
   Single canvas, timeline 0.0–9.0
   ======================================== */

(function () {
  'use strict';

  /* ========================================
     HELPERS
     ======================================== */
  function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function map(v, a, b, c, d) {
    if (b === a) return c;
    return c + ((v - a) / (b - a)) * (d - c);
  }

  /* ========================================
     CONFIG
     ======================================== */
  var CW = 1920, CH = 1080;
  var TIMELINE = 9.0;
  var LERP = 0.08;
  var MAX_TRAVEL = 300;

  /* ========================================
     LAYER VISIBILITY RANGES
     Each: { id, inStart, inEnd, outStart, outEnd }
     inStart→inEnd: fade from 0→1
     outStart→outEnd: fade from 1→0
     ======================================== */
  var LAYERS = {
    'L-sky':          { inS: 0,   inE: 0,   outS: 99, outE: 99 },
    'L-mountains-far':{ inS: 0,   inE: 0,   outS: 99, outE: 99 },
    'L-city-back':    { inS: 0,   inE: 0,   outS: 1.2, outE: 2.2 },
    'L-city-front':   { inS: 0,   inE: 0,   outS: 1.0, outE: 2.0 },
    'L-lights':       { inS: 0,   inE: 0,   outS: 0.8, outE: 1.8 },
    'L-water':        { inS: 0,   inE: 0,   outS: 3.0, outE: 4.0 },
    'L-industrial':   { inS: 2.5, inE: 3.5, outS: 7.0, outE: 8.0 },
    'L-machine':      { inS: 3.0, inE: 4.0, outS: 6.5, outE: 7.5 },
    'L-spheres':      { inS: 5.0, inE: 6.0, outS: 7.5, outE: 8.5 },
    'L-sunset':       { inS: 7.0, inE: 8.0, outS: 99,  outE: 99 },
    'L-fg':           { inS: 0,   inE: 0,   outS: 99,  outE: 99 },
    'L-ui':           { inS: 0,   inE: 0,   outS: 99,  outE: 99 }
  };

  /* UI text blocks: { id, showStart, showEnd } */
  var UI_BLOCKS = [
    { id: 'ui-s1', showS: -1.0, showE: 1.0 },
    { id: 'ui-s2', showS: 1.8, showE: 3.0 },
    { id: 'ui-s3', showS: 3.8, showE: 5.0 },
    { id: 'ui-s4', showS: 5.8, showE: 7.0 },
    { id: 'ui-s5', showS: 7.8, showE: 9.0 }
  ];

  /* ========================================
     STATE
     ======================================== */
  var currentProgress = 0;
  var targetProgress = 0;
  var prefersReducedMotion = false;
  var layerEls = {};
  var layerData = {};

  /* ========================================
     INIT
     ======================================== */
  function init() {
    cacheElements();
    detectReducedMotion();
    scaleCanvas();
    initNav();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scaleCanvas);
    requestAnimationFrame(loop);
  }

  function cacheElements() {
    for (var key in LAYERS) {
      var el = document.getElementById(key);
      if (el) {
        layerEls[key] = el;
        layerData[key] = { curOpacity: 0, curY: 0 };
      }
    }
  }

  function detectReducedMotion() {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mq.matches;
    mq.addEventListener('change', function (e) {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) resetAll();
    });
  }

  /* ========================================
     CANVAS SCALING
     ======================================== */
  function scaleCanvas() {
    var canvas = document.getElementById('canvas');
    if (!canvas) return;
    var sx = window.innerWidth / CW;
    var sy = window.innerHeight / CH;
    var s = Math.max(sx, sy);
    canvas.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
  }

  /* ========================================
     SCROLL → TIMELINE
     ======================================== */
  function onScroll() {
    var track = document.getElementById('scrollTrack');
    var total = track.offsetHeight - window.innerHeight;
    targetProgress = (window.pageYOffset / total) * TIMELINE;
  }

  /* ========================================
     MAIN LOOP
     ======================================== */
  function loop() {
    currentProgress = lerp(currentProgress, targetProgress, LERP);
    if (Math.abs(currentProgress - targetProgress) < 0.001) {
      currentProgress = targetProgress;
    }

    if (!prefersReducedMotion) {
      updateAllLayers();
      updateWater();
      updateSunset();
      updateUI();
    }

    updateNavBg();
    requestAnimationFrame(loop);
  }

  /* ========================================
     UPDATE LAYERS
     ======================================== */
  function updateAllLayers() {
    var t = currentProgress;

    for (var key in LAYERS) {
      var cfg = LAYERS[key];
      var data = layerData[key];
      var el = layerEls[key];
      if (!el || !data) continue;

      // Calculate opacity based on timeline range
      var fadeIn = clamp((t - cfg.inS) / Math.max(cfg.inE - cfg.inS, 0.01), 0, 1);
      var fadeOut = clamp((cfg.outE - t) / Math.max(cfg.outE - cfg.outS, 0.01), 0, 1);

      // For layers always visible (outS=99), fadeIn=1, fadeOut=1
      var targetOpacity;
      if (cfg.inS === cfg.inE) {
        // Always visible (no fade in), just check fade out
        targetOpacity = fadeOut;
      } else {
        targetOpacity = Math.min(fadeIn, fadeOut);
      }

      // Special: city buildings should be fully visible at start
      if (key === 'L-city-back' || key === 'L-city-front' || key === 'L-lights') {
        targetOpacity = fadeOut;
      }

      // Smooth opacity
      data.curOpacity = lerp(data.curOpacity, targetOpacity, LERP * 1.5);

      // Parallax Y based on depth speed
      var speed = parseFloat(el.getAttribute('data-speed')) || 0;
      var centered = (0.5 - (t / TIMELINE)) * 2; // 1 at start, -1 at end
      var targetY = centered * MAX_TRAVEL * speed;

      // Don't parallax layers that are invisible
      if (data.curOpacity < 0.01) {
        data.curY = lerp(data.curY, 0, LERP);
        el.style.opacity = '0';
        continue;
      }

      data.curY = lerp(data.curY, targetY, LERP * 1.2);

      el.style.transform = 'translate3d(0,' + data.curY.toFixed(2) + 'px,0)';
      el.style.opacity = data.curOpacity.toFixed(3);
    }
  }

  /* ========================================
     WATER TRANSITION (river → waterfall)
     ======================================== */
  function updateWater() {
    var t = currentProgress;

    // River: full at t=0, shrinks at t=1-2
    var river = document.getElementById('river');
    var riverFlow = document.getElementById('riverFlow');
    if (river) {
      var riverOpacity = clamp((2.0 - t) / 0.8, 0, 1);
      river.style.opacity = riverOpacity.toFixed(3);
      // River widens as camera approaches
      var riverScale = map(t, 0, 1.5, 1, 1.4);
      river.style.transform = 'scaleX(' + riverScale.toFixed(3) + ')';
    }
    if (riverFlow) {
      var rfOpacity = clamp((1.8 - t) / 0.6, 0, 1);
      riverFlow.style.opacity = rfOpacity.toFixed(3);
    }

    // Waterfall: grows at t=1-2, stays until t=3
    var waterfall = document.getElementById('waterfall');
    var waterfallCol = document.getElementById('waterfallCol');
    var waterfallFoam = document.getElementById('waterfallFoam');
    var waterfallGlow = document.getElementById('waterfallGlow');

    if (waterfall) {
      var wfGrowth = clamp((t - 1.0) / 0.8, 0, 1);
      var wfFade = clamp((3.5 - t) / 0.5, 0, 1);
      var wfOpacity = Math.min(wfGrowth, wfFade);
      var wfHeight = wfGrowth * 55; // percent
      waterfall.style.height = wfHeight + '%';
      waterfall.style.opacity = wfOpacity.toFixed(3);
    }
    if (waterfallCol) {
      var wfcGrowth = clamp((t - 1.2) / 0.6, 0, 1);
      var wfcFade = clamp((3.5 - t) / 0.5, 0, 1);
      waterfallCol.style.height = (wfcGrowth * 85) + '%';
      waterfallCol.style.opacity = Math.min(wfcGrowth, wfcFade).toFixed(3);
    }
    if (waterfallFoam) {
      var wffGrowth = clamp((t - 1.4) / 0.5, 0, 1);
      var wffFade = clamp((3.5 - t) / 0.5, 0, 1);
      waterfallFoam.style.height = (wffGrowth * 10) + '%';
      waterfallFoam.style.opacity = Math.min(wffGrowth, wffFade).toFixed(3);
    }
    if (waterfallGlow) {
      var wfgGrowth = clamp((t - 1.3) / 0.5, 0, 1);
      var wfgFade = clamp((3.5 - t) / 0.5, 0, 1);
      waterfallGlow.style.height = (wfgGrowth * 30) + '%';
      waterfallGlow.style.opacity = Math.min(wfgGrowth, wfgFade).toFixed(3);
    }
  }

  /* ========================================
     SUNSET TRANSITION
     ======================================== */
  function updateSunset() {
    var t = currentProgress;

    // Sky: city → sunset
    var skySunset = document.getElementById('skySunset');
    if (skySunset) {
      var skyProgress = clamp((t - 6.5) / 1.5, 0, 1);
      skySunset.style.opacity = skyProgress.toFixed(3);
    }

    // Sun
    var sun = document.getElementById('sun');
    var sunGlow = document.getElementById('sunGlow');
    if (sun) {
      var sunProgress = clamp((t - 7.0) / 1.0, 0, 1);
      sun.style.opacity = sunProgress.toFixed(3);
      // Sun rises slightly
      var sunY = map(sunProgress, 0, 1, 20, 0);
      sun.style.transform = 'translateY(' + sunY.toFixed(1) + 'px)';
    }
    if (sunGlow) {
      var glowP = clamp((t - 7.0) / 1.0, 0, 1);
      sunGlow.style.opacity = glowP.toFixed(3);
    }

    // Clouds
    var clouds = document.querySelectorAll('.cloud');
    for (var i = 0; i < clouds.length; i++) {
      var cP = clamp((t - 7.2) / 0.8, 0, 1);
      clouds[i].style.opacity = (cP * 0.6).toFixed(3);
    }

    // Birds
    var birds = document.querySelectorAll('.bird');
    for (var j = 0; j < birds.length; j++) {
      var bP = clamp((t - 7.5) / 0.6, 0, 1);
      birds[j].style.opacity = (bP * 0.8).toFixed(3);
    }

    // Sunset mountains
    var smtns = document.querySelectorAll('.smtn--large, .smtn--mid, .smtn--small');
    for (var k = 0; k < smtns.length; k++) {
      var mP = clamp((t - 7.0) / 1.0, 0, 1);
      smtns[k].style.opacity = mP.toFixed(3);
    }

    // Water + reflection
    var swater = document.getElementById('swater');
    var sreflection = document.getElementById('sreflection');
    if (swater) {
      var wP = clamp((t - 7.2) / 0.8, 0, 1);
      swater.style.opacity = wP.toFixed(3);
    }
    if (sreflection) {
      var rP = clamp((t - 7.3) / 0.7, 0, 1);
      sreflection.style.opacity = rP.toFixed(3);
    }
  }

  /* ========================================
     UI TEXT OVERLAYS
     ======================================== */
  function updateUI() {
    var t = currentProgress;

    for (var i = 0; i < UI_BLOCKS.length; i++) {
      var cfg = UI_BLOCKS[i];
      var el = document.getElementById(cfg.id);
      if (!el) continue;

      // Fade in / fade out
      var fadeIn = clamp((t - cfg.showS) / 0.3, 0, 1);
      var fadeOut = clamp((cfg.showE - t) / 0.3, 0, 1);
      var opacity = Math.min(fadeIn, fadeOut);

      // Smooth
      var cur = parseFloat(el.style.opacity) || 0;
      var smooth = lerp(cur, opacity, LERP * 2);

      el.style.opacity = smooth.toFixed(3);

      if (smooth > 0.01) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }

      // Content layers (UI) get upward slide-in effect
      var slideOffset = (1 - fadeIn) * 40;
      el.style.transform = el.id === 'ui-s1'
        ? 'translate(-50%, calc(-50% + ' + slideOffset + 'px))'
        : 'translateY(calc(-50% + ' + slideOffset + 'px))';
    }
  }

  /* ========================================
     RESET
     ======================================== */
  function resetAll() {
    for (var key in layerEls) {
      layerEls[key].style.transform = '';
      layerEls[key].style.opacity = '1';
    }
    var uiEls = document.querySelectorAll('.ui-block');
    for (var i = 0; i < uiEls.length; i++) {
      uiEls[i].style.opacity = '1';
      uiEls[i].style.transform = '';
    }
  }

  /* ========================================
     NAVIGATION
     ======================================== */
  function initNav() {
    var hamburger = document.querySelector('.pill-nav__hamburger');
    var mobileMenu = document.getElementById('mobile-menu');

    // Hamburger toggle
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

    // Smooth scroll for pill nav links
    var pillLinks = document.querySelectorAll('.pill-nav__link, .pill-nav__cta, .mobile-link');
    for (var k = 0; k < pillLinks.length; k++) {
      pillLinks[k].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) {
            // Convert element position to scroll-track position
            var track = document.getElementById('scrollTrack');
            var targetTop = target.getBoundingClientRect().top + window.pageYOffset;
            var totalScroll = track.offsetHeight - window.innerHeight;
            // Map element position to timeline position
            var sectionMap = { 'ui-s1': 0.5, 'ui-s2': 2.4, 'ui-s3': 4.4, 'ui-s4': 6.4, 'ui-s5': 8.4 };
            var sectionKey = href.replace('#', '');
            var timelineTarget = sectionMap[sectionKey] || 0.5;
            var scrollTarget = (timelineTarget / TIMELINE) * totalScroll;
            window.scrollTo({ top: scrollTarget, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          }
        }
      });
    }
  }

  function updateNavBg() {
    // Highlight active section link based on timeline
    var t = currentProgress;
    var sections = [
      { key: 's1', start: 0.0, end: 1.0 },
      { key: 's2', start: 1.8, end: 3.0 },
      { key: 's3', start: 3.8, end: 5.0 },
      { key: 's4', start: 5.8, end: 7.0 },
      { key: 's5', start: 7.8, end: 9.0 }
    ];

    var activeKey = '';
    for (var i = 0; i < sections.length; i++) {
      if (t >= sections[i].start && t <= sections[i].end) {
        activeKey = sections[i].key;
        break;
      }
    }

    // Update pill nav active state
    var pillLinks = document.querySelectorAll('.pill-nav__link');
    for (var j = 0; j < pillLinks.length; j++) {
      var linkSection = pillLinks[j].getAttribute('data-section');
      if (linkSection === activeKey) {
        pillLinks[j].classList.add('active');
      } else {
        pillLinks[j].classList.remove('active');
      }
    }

    // Update mobile menu active state
    var mobileLinks = document.querySelectorAll('.mobile-link[data-section]');
    for (var k = 0; k < mobileLinks.length; k++) {
      var mSection = mobileLinks[k].getAttribute('data-section');
      if (mSection === activeKey) {
        mobileLinks[k].classList.add('active');
      } else {
        mobileLinks[k].classList.remove('active');
      }
    }
  }

  /* ========================================
     BOOT
     ======================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
