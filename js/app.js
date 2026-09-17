/* ========================================
   PARALEAX — JS (V12)
   Lenis + GSAP ScrollTrigger + SVG scrub
   ======================================== */

(function () {
  "use strict";

  /* ---- Lenis smooth scroll ---- */
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });

  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ---- Default tween settings ---- */
  gsap.defaults({ ease: "power2.out", duration: 1 });

  /* ==================================================
     SECTION 1: HERO
     ================================================== */
  (function hero() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-1",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        pin: false,
      },
    });

    tl.fromTo("#section-1 .parallax-slow", { y: 0 }, { y: -200, force3D: false }, 0)
      .fromTo("#section-1 .parallax-mid", { y: 0 }, { y: -100, force3D: false }, 0);

    var clouds = gsap.utils.toArray("#section-1 .cloud");
    var cloudXs = [80, 60, -90, -70, 50];
    clouds.forEach((c, i) => {
      tl.to(c, { x: cloudXs[i] || 0, force3D: false }, 0);
    });
  })();

  /* Hero text visibility */
  ScrollTrigger.create({
    trigger: "#section-1",
    start: "top 80%",
    end: "bottom 20%",
    onEnter: () => gsap.fromTo(".hero-heading", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }),
    onLeaveBack: () => gsap.to(".hero-heading", { opacity: 0, y: 40, duration: 0.4 }),
    onEnterBack: () => gsap.fromTo(".hero-heading", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }),
  });

  /* ==================================================
     SECTION 2: MISSION — RUSHING WATERFALL
     ================================================== */
  (function mission() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-2",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        pin: false,
      },
    });

    tl.fromTo("#section-2 .parallax-slow", { y: 0 }, { y: -150, force3D: false }, 0)
      .fromTo("#section-2 .parallax-mid", { y: 0 }, { y: -80, force3D: false }, 0);

    /* Waterfall lines — scrub with scroll (parallax accent) */
    var wfLines2 = gsap.utils.toArray("#waterfall-curtain .water-line");
    wfLines2.forEach((l, i) => {
      tl.to(l, { y: -180 - (i * 30), force3D: false }, 0);
    });

    /* Continuous waterfall rush — GSAP (independent of scroll) */
    function animateWaterfall(id, xCenter, width) {
      var lines = gsap.utils.toArray(id + " .wf-fast");
      lines.forEach(function (line, i) {
        gsap.to(line, {
          y: "+=70",
          duration: 0.8 + (i * 0.08),
          ease: "power1.in",
          repeat: -1,
          yoyo: true,
          delay: i * 0.06,
        });
      });
      var midLines = gsap.utils.toArray(id + " .wf-mid");
      midLines.forEach(function (line, i) {
        gsap.to(line, {
          y: "+=45",
          duration: 1.4 + (i * 0.1),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.12,
        });
      });
      var slowLines = gsap.utils.toArray(id + " .wf-slow");
      slowLines.forEach(function (line, i) {
        gsap.to(line, {
          y: "+=20",
          duration: 2.2 + (i * 0.2),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        });
      });
    }
    animateWaterfall("#waterfall-curtain", 940, 220);

    /* Splash particles — spawn dynamically */
    function createSplashParticles(containerId, cx, cy, count) {
      var container = document.querySelector(containerId + " .splash-group");
      if (!container) return;
      var svg = container.closest("svg");
      for (var i = 0; i < count; i++) {
        var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("r", 1.5 + Math.random() * 2);
        dot.setAttribute("fill", "rgba(200,240,255," + (0.2 + Math.random() * 0.3) + ")");
        dot.setAttribute("cx", cx + (Math.random() - 0.5) * 140);
        dot.setAttribute("cy", cy);
        container.appendChild(dot);
        gsap.fromTo(dot,
          { y: 0, opacity: 0.5 },
          {
            y: -20 - Math.random() * 30,
            x: (Math.random() - 0.5) * 30,
            opacity: 0,
            duration: 0.6 + Math.random() * 0.8,
            repeat: -1,
            delay: Math.random() * 2,
            ease: "power2.out",
          }
        );
      }
    }
    createSplashParticles("#waterfall-curtain", 940, 1050, 10);

    /* Streak wobble — subtle horizontal drift */
    var streaks2 = gsap.utils.toArray("#waterfall-curtain .streak");
    streaks2.forEach(function (s, i) {
      gsap.to(s, {
        x: (Math.random() - 0.5) * 4,
        duration: 0.3 + Math.random() * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.05,
      });
    });

    /* Bubbles floating up */
    var bubbles = gsap.utils.toArray("#bubbles-s2 .bubble");
    bubbles.forEach(function (b, i) {
      gsap.fromTo(b,
        { y: 100 + i * 30, opacity: 0 },
        {
          y: -200 - i * 50,
          opacity: 0.6,
          force3D: false,
          duration: 4 + i * 0.5,
          repeat: -1,
          ease: "power1.out",
          delay: i * 0.4,
        }
      );
    });
  })();

  /* Mission text visibility */
  ScrollTrigger.create({
    trigger: "#section-2",
    start: "top 60%",
    end: "bottom 40%",
    onEnter: () => gsap.fromTo("#mission-content", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8 }),
    onLeaveBack: () => gsap.to("#mission-content", { opacity: 0, x: -40, duration: 0.4 }),
    onEnterBack: () => gsap.fromTo("#mission-content", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8 }),
  });

  /* ==================================================
     SECTION 3: ADVANTAGES — RUSHING WATERFALL
     ================================================== */
  (function advantages() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-3",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        pin: false,
      },
    });

    tl.fromTo("#section-3 .parallax-slow", { y: 0 }, { y: -150, force3D: false }, 0)
      .fromTo("#section-3 .parallax-mid", { y: 0 }, { y: -80, force3D: false }, 0);

    var wfLines3 = gsap.utils.toArray("#waterfall-s3 .water-line");
    wfLines3.forEach(function (l, i) {
      tl.to(l, { y: -180 - (i * 25), force3D: false }, 0);
    });

    /* Continuous rush */
    var fast3 = gsap.utils.toArray("#waterfall-s3 .wf-fast");
    fast3.forEach(function (line, i) {
      gsap.to(line, {
        y: "+=65",
        duration: 0.85 + (i * 0.07),
        ease: "power1.in",
        repeat: -1,
        yoyo: true,
        delay: i * 0.05,
      });
    });
    var mid3 = gsap.utils.toArray("#waterfall-s3 .wf-mid");
    mid3.forEach(function (line, i) {
      gsap.to(line, {
        y: "+=40",
        duration: 1.5 + (i * 0.1),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.1,
      });
    });
    var slow3 = gsap.utils.toArray("#waterfall-s3 .wf-slow");
    slow3.forEach(function (line, i) {
      gsap.to(line, {
        y: "+=18",
        duration: 2.4 + (i * 0.2),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.25,
      });
    });

    /* Splash particles */
    (function () {
      var container = document.querySelector("#waterfall-s3 .splash-group");
      if (!container) return;
      for (var i = 0; i < 8; i++) {
        var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("r", 1.5 + Math.random() * 2);
        dot.setAttribute("fill", "rgba(200,240,255," + (0.2 + Math.random() * 0.3) + ")");
        dot.setAttribute("cx", 230 + (Math.random() - 0.5) * 160);
        dot.setAttribute("cy", 1055);
        container.appendChild(dot);
        gsap.fromTo(dot,
          { y: 0, opacity: 0.5 },
          {
            y: -18 - Math.random() * 28,
            x: (Math.random() - 0.5) * 25,
            opacity: 0,
            duration: 0.7 + Math.random() * 0.7,
            repeat: -1,
            delay: Math.random() * 2,
            ease: "power2.out",
          }
        );
      }
    })();

    /* Streak wobble */
    var streaks3 = gsap.utils.toArray("#waterfall-s3 .streak");
    streaks3.forEach(function (s, i) {
      gsap.to(s, {
        x: (Math.random() - 0.5) * 4,
        duration: 0.3 + Math.random() * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.05,
      });
    });

    /* Turbine rotation */
    gsap.to("#turbine-blades", {
      rotation: 360,
      transformOrigin: "0 0",
      force3D: false,
      duration: 12,
      repeat: -1,
      ease: "linear",
    });
  })();

  /* Advantages text visibility */
  ScrollTrigger.create({
    trigger: "#section-3",
    start: "top 60%",
    end: "bottom 40%",
    onEnter: () => gsap.fromTo("#advantages-content", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8 }),
    onLeaveBack: () => gsap.to("#advantages-content", { opacity: 0, x: 40, duration: 0.4 }),
    onEnterBack: () => gsap.fromTo("#advantages-content", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8 }),
  });

  /* ==================================================
     SECTION 4: MODEL — RUSHING WATERFALL
     ================================================== */
  (function model() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-4",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        pin: false,
      },
    });

    tl.fromTo("#section-4 .parallax-slow", { y: 0 }, { y: -150, force3D: false }, 0)
      .fromTo("#section-4 .parallax-mid", { y: 0 }, { y: -80, force3D: false }, 0);

    var wfLines4 = gsap.utils.toArray("#waterfall-s4 .water-line");
    wfLines4.forEach(function (l, i) {
      tl.to(l, { y: -180 - (i * 25), force3D: false }, 0);
    });

    /* Continuous rush */
    var fast4 = gsap.utils.toArray("#waterfall-s4 .wf-fast");
    fast4.forEach(function (line, i) {
      gsap.to(line, {
        y: "+=65",
        duration: 0.85 + (i * 0.07),
        ease: "power1.in",
        repeat: -1,
        yoyo: true,
        delay: i * 0.05,
      });
    });
    var mid4 = gsap.utils.toArray("#waterfall-s4 .wf-mid");
    mid4.forEach(function (line, i) {
      gsap.to(line, {
        y: "+=40",
        duration: 1.5 + (i * 0.1),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.1,
      });
    });
    var slow4 = gsap.utils.toArray("#waterfall-s4 .wf-slow");
    slow4.forEach(function (line, i) {
      gsap.to(line, {
        y: "+=18",
        duration: 2.4 + (i * 0.2),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.25,
      });
    });

    /* Splash particles */
    (function () {
      var container = document.querySelector("#waterfall-s4 .splash-group");
      if (!container) return;
      for (var i = 0; i < 8; i++) {
        var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("r", 1.5 + Math.random() * 2);
        dot.setAttribute("fill", "rgba(200,240,255," + (0.2 + Math.random() * 0.3) + ")");
        dot.setAttribute("cx", 1680 + (Math.random() - 0.5) * 160);
        dot.setAttribute("cy", 1055);
        container.appendChild(dot);
        gsap.fromTo(dot,
          { y: 0, opacity: 0.5 },
          {
            y: -18 - Math.random() * 28,
            x: (Math.random() - 0.5) * 25,
            opacity: 0,
            duration: 0.7 + Math.random() * 0.7,
            repeat: -1,
            delay: Math.random() * 2,
            ease: "power2.out",
          }
        );
      }
    })();

    /* Streak wobble */
    var streaks4 = gsap.utils.toArray("#waterfall-s4 .streak");
    streaks4.forEach(function (s, i) {
      gsap.to(s, {
        x: (Math.random() - 0.5) * 4,
        duration: 0.3 + Math.random() * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.05,
      });
    });

    /* Bubbles from left vat */
    var bubbles = gsap.utils.toArray("#bubbles-s4 .bubble");
    bubbles.forEach(function (b, i) {
      gsap.fromTo(b,
        { y: 80 + i * 25, opacity: 0 },
        {
          y: -250 - i * 40,
          opacity: 0.5,
          force3D: false,
          duration: 5 + i * 0.6,
          repeat: -1,
          ease: "power1.out",
          delay: i * 0.3,
        }
      );
    });
  })();

  /* Model text visibility */
  ScrollTrigger.create({
    trigger: "#section-4",
    start: "top 60%",
    end: "bottom 40%",
    onEnter: () => gsap.fromTo("#model-content", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8 }),
    onLeaveBack: () => gsap.to("#model-content", { opacity: 0, x: -40, duration: 0.4 }),
    onEnterBack: () => gsap.fromTo("#model-content", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8 }),
  });

  /* ==================================================
     SECTION 5: LANDSCAPE
     ================================================== */
  (function landscape() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-5",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        pin: false,
      },
    });

    tl.fromTo("#section-5 .parallax-slow", { y: 0 }, { y: -120, force3D: false }, 0)
      .fromTo("#bridge-arch", { y: 60 }, { y: 0, force3D: false }, 0);
  })();

  /* Landscape text visibility */
  ScrollTrigger.create({
    trigger: "#section-5",
    start: "top 60%",
    end: "bottom 40%",
    onEnter: () => gsap.fromTo("#landscape-content", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }),
    onLeaveBack: () => gsap.to("#landscape-content", { opacity: 0, y: 30, duration: 0.4 }),
    onEnterBack: () => gsap.fromTo("#landscape-content", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }),
  });

  /* ==================================================
     NAVBAR ACTIVE STATE
     ================================================== */
  const sections = [
    { id: "section-1", link: "s1" },
    { id: "section-2", link: "s2" },
    { id: "section-3", link: "s3" },
    { id: "section-4", link: "s4" },
    { id: "section-5", link: "s5" },
  ];

  sections.forEach(({ id, link }) => {
    ScrollTrigger.create({
      trigger: `#${id}`,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if (self.isActive) {
          document.querySelectorAll(".glass-nav__link").forEach((el) => el.classList.remove("is-active"));
          document.querySelectorAll(`.glass-nav__link[data-nav="${link}"]`).forEach((el) => el.classList.add("is-active"));
        }
      },
    });
  });

  /* ==================================================
     NAV SCROLL-TO
     ================================================== */
  function setupNavScroll() {
    document.querySelectorAll('.glass-nav__link, .glass-nav__logo, .mobile-link').forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const href = link.getAttribute("href");
        if (href) lenis.scrollTo(href, { offset: 0 });
        const mobileMenu = document.getElementById("mobile-menu");
        const hamburger = document.querySelector(".glass-nav__hamburger");
        if (mobileMenu && hamburger) {
          mobileMenu.setAttribute("aria-hidden", "true");
          hamburger.setAttribute("aria-expanded", "false");
        }
      });
    });
  }
  setupNavScroll();

  /* ==================================================
     HAMBURGER
     ================================================== */
  function setupHamburger() {
    const hamburger = document.querySelector(".glass-nav__hamburger");
    const mobileMenu = document.getElementById("mobile-menu");
    if (!hamburger || !mobileMenu) return;
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.setAttribute("aria-hidden", String(expanded));
    });
  }
  setupHamburger();

  /* ==================================================
     MOUSE TILT
     ================================================== */
  function setupTilt() {
    if (window.matchMedia("(hover: none)").matches) return;
    const tiltEls = document.querySelectorAll(".tilt-element");
    if (!tiltEls.length) return;
    let ticking = false;
    window.addEventListener("mousemove", (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rx = ((e.clientY / window.innerHeight) - 0.5) * 6;
        const ry = ((e.clientX / window.innerWidth) - 0.5) * -6;
        tiltEls.forEach((el) => { el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`; });
        ticking = false;
      });
    });
  }
  setupTilt();

})();
