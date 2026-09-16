/* ========================================
   CINEMATIC 16:9 PARALLAX — JS ENGINE
   Timeline: 0.00 → 9.00
   Canvas: 1920 × 1080
   ======================================== */

(function () {
  'use strict';

  /* ========================================
     HELPERS
     ======================================== */
  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* ========================================
     CONFIGURATION
     ======================================== */
  var CANVAS_W = 1920;
  var CANVAS_H = 1080;
  var TOTAL_TIMELINE = 9.0;
  var LERP_SPEED = 0.08;

  // Scene visibility windows: [start, end] in timeline units
  // Each scene is visible during its range, transitions bridge between
  var SCENES = [
    { id: 'scene1',  start: 0.0, end: 1.2 },  // City & River
    { id: 'sceneT1', start: 0.8, end: 2.2 },  // Transition 1
    { id: 'scene2',  start: 1.8, end: 3.2 },  // Our Mission
    { id: 'sceneT2', start: 2.8, end: 4.2 },  // Transition 2
    { id: 'scene3',  start: 3.8, end: 5.2 },  // Our Advantages
    { id: 'sceneT3', start: 4.8, end: 6.2 },  // Transition 3
    { id: 'scene4',  start: 5.8, end: 7.2 },  // A Model For Success
    { id: 'sceneT4', start: 6.8, end: 8.2 },  // Transition 4
    { id: 'scene5',  start: 7.8, end: 9.0 }   // Landscape
  ];

  /* ========================================
     STATE
     ======================================== */
  var currentProgress = 0;
  var targetProgress = 0;
  var prefersReducedMotion = false;
  var sceneData = [];
  var canvasEl = null;
  var scrollTrack = null;

  /* ========================================
     INIT
     ======================================== */
  function init() {
    canvasEl = document.getElementById('mainCanvas');
    scrollTrack = document.getElementById('scrollTrack');

    if (!canvasEl || !scrollTrack) return;

    detectReducedMotion();
    collectScenes();
    scaleCanvas();
    initNav();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      scaleCanvas();
      collectScenes();
    });

    requestAnimationFrame(loop);
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
     16:9 CANVAS AUTO-SCALING
     ======================================== */
  function scaleCanvas() {
    var ww = window.innerWidth;
    var wh = window.innerHeight;
    var scaleX = ww / CANVAS_W;
    var scaleY = wh / CANVAS_H;
    var scale = Math.max(scaleX, scaleY);
    canvasEl.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
  }

  /* ========================================
     COLLECT SCENE DATA
     ======================================== */
  function collectScenes() {
    sceneData = [];
    for (var i = 0; i < SCENES.length; i++) {
      var cfg = SCENES[i];
      var el = document.getElementById(cfg.id);
      if (!el) continue;

      var layerEls = el.querySelectorAll('.scene-layer');
      var layers = [];
      for (var j = 0; j < layerEls.length; j++) {
        var speed = parseFloat(layerEls[j].getAttribute('data-speed')) || 0;
        layers.push({
          el: layerEls[j],
          speed: speed,
          curY: 0,
          curOpacity: 1
        });
      }

      sceneData.push({
        el: el,
        start: cfg.start,
        end: cfg.end,
        layers: layers,
        curOpacity: 0
      });
    }
  }

  /* ========================================
     SCROLL HANDLER
     ======================================== */
  function onScroll() {
    var totalHeight = scrollTrack.offsetHeight - window.innerHeight;
    targetProgress = (window.pageYOffset / totalHeight) * TOTAL_TIMELINE;
  }

  /* ========================================
     MAIN LOOP
     ======================================== */
  function loop() {
    // LERP scroll progress
    currentProgress = lerp(currentProgress, targetProgress, LERP_SPEED);
    if (Math.abs(currentProgress - targetProgress) < 0.001) {
      currentProgress = targetProgress;
    }

    if (!prefersReducedMotion) {
      updateScenes();
    }

    updateNavBg();
    requestAnimationFrame(loop);
  }

  /* ========================================
     UPDATE ALL SCENES
     ======================================== */
  function updateScenes() {
    var vh = window.innerHeight;

    for (var i = 0; i < sceneData.length; i++) {
      var sc = sceneData[i];
      var t = currentProgress;

      // Calculate scene visibility (0 = invisible, 1 = fully visible)
      var fadeIn = clamp((t - sc.start) / 0.4, 0, 1);
      var fadeOut = clamp((sc.end - t) / 0.4, 0, 1);
      var visibility = Math.min(fadeIn, fadeOut);

      // Smooth opacity
      sc.curOpacity = lerp(sc.curOpacity, visibility, LERP_SPEED * 1.5);

      // Apply opacity
      if (sc.curOpacity < 0.01) {
        sc.el.style.opacity = '0';
        sc.el.classList.add('scene--hidden');
        continue;
      }
      sc.el.classList.remove('scene--hidden');
      sc.el.style.opacity = sc.curOpacity.toFixed(3);

      // Calculate local progress within this scene (0 to 1)
      var localProgress = clamp((t - sc.start) / (sc.end - sc.start), 0, 1);

      // Update layers
      for (var j = 0; j < sc.layers.length; j++) {
        var layer = sc.layers[j];
        updateLayer(layer, localProgress, vh);
      }
    }
  }

  function updateLayer(layer, localProgress, vh) {
    var speed = layer.speed;

    // Parallax Y offset
    // At localProgress 0.5 (center), offset = 0 (at rest position)
    // At localProgress 0 (entering from bottom), offset = positive (shifted DOWN)
    // At localProgress 1 (leaving at top), offset = negative (shifted UP)
    // This makes elements enter from below and rise into position
    // Higher speed = MORE movement
    var centered = (0.5 - localProgress) * 2; // 1 at entry, 0 at center, -1 at exit
    var maxTravel = 300; // pixels
    var targetY = centered * maxTravel * speed;

    // Subtle X sway
    var targetX = Math.sin(localProgress * Math.PI) * speed * 10;

    // Opacity for content layer (fade in/out more aggressively)
    var targetOpacity;
    if (speed >= 0.9) {
      // Content layers: fade based on distance from center
      var absCentered = Math.abs(localProgress - 0.5) * 2; // 0 at center, 1 at edges
      var contentFade = 1 - Math.pow(absCentered, 2.5);
      targetOpacity = clamp(contentFade, 0, 1);
    } else {
      targetOpacity = 1;
    }

    // Smooth interpolation
    layer.curY = lerp(layer.curY, targetY, LERP_SPEED * 1.2);
    layer.curOpacity = lerp(layer.curOpacity, targetOpacity, LERP_SPEED * 1.5);

    // Apply
    var tx = targetX.toFixed(2);
    var ty = layer.curY.toFixed(2);
    var op = layer.curOpacity.toFixed(3);

    layer.el.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
    layer.el.style.opacity = op;
  }

  /* ========================================
     RESET (reduced motion)
     ======================================== */
  function resetAll() {
    for (var i = 0; i < sceneData.length; i++) {
      var sc = sceneData[i];
      sc.curOpacity = 1;
      sc.el.style.opacity = '1';
      sc.el.classList.remove('scene--hidden');
      for (var j = 0; j < sc.layers.length; j++) {
        var l = sc.layers[j];
        l.curY = 0;
        l.curOpacity = 1;
        l.el.style.transform = '';
        l.el.style.opacity = '';
      }
    }
  }

  /* ========================================
     NAVIGATION
     ======================================== */
  function initNav() {
    // Hamburger
    var hamburger = document.querySelector('.nav-hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        var expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!expanded));
        mobileMenu.setAttribute('aria-hidden', String(expanded));
        document.body.style.overflow = expanded ? '' : 'hidden';
      });
      var links = mobileMenu.querySelectorAll('.mobile-link');
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
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
        }
      });
    }

    // Smooth anchor scroll
    var allLinks = document.querySelectorAll('a[href^="#"]');
    for (var k = 0; k < allLinks.length; k++) {
      allLinks[k].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href && href.length > 1) {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
          }
        }
      });
    }
  }

  function updateNavBg() {
    var nav = document.querySelector('.global-nav');
    if (!nav) return;
    if (targetProgress > 0.3) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
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
