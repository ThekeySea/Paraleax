# OpenCode Prompt — Build the SEGESTA Continuous Parallax Landing Page

You are a senior UI/UX designer, frontend engineer, motion designer, and visual implementation specialist.

Your task is to build a **Continuous Vertical Vector Parallax Landing Page** based on the SEGESTA visual identity and the attached `prd.md`.

## NON-NEGOTIABLE RULES

1.  Read `prd.md` completely before writing code.
2.  Treat the SEGESTA video references as the visual source of truth.
3.  Do not create a generic "modern parallax landing page" or disjointed cards.
4.  The website MUST BE ONE CONTINUOUS VERTICAL WORLD. Every section must physically and visually connect to the next via a central fluid element (River -> Waterfall -> Turbine -> Molten Energy).
5.  Use HTML5, CSS3, Vanilla JavaScript, and native browser APIs.
6.  **UPDATED TECH STACK RULE:** You ARE explicitly required to use **GSAP, ScrollTrigger, and Lenis Smooth Scroll** to achieve the awwwards-style continuous scroll and SVG path scrubbing.
7.  Do NOT install or use:
    -   React, Vue, Svelte, Angular
    -   Tailwind, Bootstrap
    -   jQuery
    -   Pre-built UI component libraries
8.  Do not use `position: fixed` on the entire page wrapper as a hack. Use a standard vertical document flow where elements stack naturally, but their visual boundaries seamlessly align (Zero-Gap Seams).
9.  Do not fabricate missing source artwork with generic stock photos. Use layered SVGs/Canvas for the vector environments.
10. Support `prefers-reduced-motion` by disabling the heavy parallax translations.

------------------------------------------------------------------------

# 1. FIRST: INSPECT THE PROJECT

Before editing anything:
- inspect the existing directory structure;
- identify the current entry HTML file, CSS, and JS;
- Do not delete an existing project structure blindly.

If the project is empty, create:
``` text
index.html
css/style.css
js/app.js
assets/
2. READ THE REFERENCE SEQUENCE CORRECTLY
There are exactly 5 continuous reference stages, NOT 9 disjointed images:

Hero (SEGESTA Skyline & Central River)

Section 2 (Mission & Vertical Waterfall)

Section 3 (Advantages, Water Turbine & Control Room)

Section 4 (Model For Success & Molten Energy Streams)

Section 5 (Sunset Ocean Landscape Finale)

The transitions between these are seamless. The bottom edge of Section 1's river physically falls into the top edge of Section 2's waterfall.

3. UNDERSTAND THE DESIGN BEFORE CODING
Think of it as:

a camera traveling downward through ONE continuous futuristic illustrated vector environment.

The visual language consists of:

Deep purple / midnight indigo (#120B29, #1C1236)

Electric Cyan / Blue water (#38C6FF)

Warm amber / Coral Pink / Molten Gold illumination (#FF7B42)

Faceted / low-poly vector geometry (mountains, rocks)

Industrial futuristic architecture and glass laboratories

White typography

4. RECONSTRUCT THE NAVIGATION
Create a persistent desktop navigation.

Visual structure:

Plaintext
Our Story     SolutionLab     Clients          [SEGESTA LOGO]          Portfolio   Blog   [Contact]
Requirements:

position: fixed, high z-index at the top.

Glassmorphism effect (backdrop-filter: blur(12px)) with semi-transparent dark background.

Centered logo.

Outlined or white-pill Contact button.

Must remain visible and legible over all scenes.

5. BUILD THE PAGE AS A SEAMLESS SCENE SYSTEM
Use a standard vertical stacking structure:

HTML
<main class="parallax-page">
  <section class="chapter chapter--hero">...</section>
  <section class="chapter chapter--mission">...</section>
  ...
</main>
CRITICAL SEAM ALIGNMENT:
Each scene must have a .seam-bottom and .seam-top. These elements MUST NOT have parallax offsets (their scroll speed must be 1.0x native scroll) so that the bottom of Section 1 perfectly aligns with the top of Section 2 without gaps.

Inside each scene, use explicit layers for inner-parallax:

HTML
<div class="scene">
  <div class="scene__background parallax-slow"></div>
  <div class="scene__midground parallax-mid"></div>
  <div class="scene__foreground"></div> <!-- Seams go here -->
  <div class="scene__content"></div>
</div>
6. PARALLAX & SMOOTH SCROLL ENGINE
Implement GSAP + Lenis integration.

Flow:

JavaScript
// Lenis Setup
const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
Use gsap.to() with ScrollTrigger (scrub: true) to shift .scene__background and .scene__midground vertically, creating depth.

7. SECTION 1: HERO
Required composition:

Background: Faceted mountains and warm sunset sky.

Left & Right Midground: City buildings with glowing streetlights.

Center/Bottom: A flowing river moving toward the viewer and ending at the bottom edge (y: 100%).

Content: Huge white "SEGESTA" heading, "INNOVATIVE SOLUTIONS" subheading in the center.

8. SECTION 2: OUR MISSION (WATERFALL)
Required composition:

Top Seam: The river from Section 1 pours vertically down.

Center: A massive vertical waterfall extending from top to bottom.

Right: A multi-story glass-walled futuristic laboratory. Include scientists on staircases and glowing orange orbs inside.

Left Content: "Our Mission" heading, body text, and a white pill "Let's Build!" button.

9. SECTION 3: OUR ADVANTAGES (TURBINE)
Required composition:

Top/Left: The waterfall falls into a giant mechanical Water Turbine.

Right Midground: An industrial control room with a scientist at a curved holographic desk.

Right Content: "Our Advantages" heading, with sub-points "We've Been There." and "Boldly Transparent.".

Bottom: Metallic pipes channeling the fluid downward.

10. SECTION 4: A MODEL FOR SUCCESS (MOLTEN ENERGY)
Required composition:

Center/Right: The fluid in the pipes turns into glowing molten golden/orange energy streams falling straight down into an underground facility.

Background: Dark underground cavern with hanging industrial lamps and catwalks.

Left Content: "A Model For Success." and "Attentiveness as a Priority."

Bottom: A dark stone archway (cave exit) spanning the bottom of the section.

11. SECTION 5: LANDSCAPE FINALE
Required composition:

Top Seam: The camera emerges from the dark archway of Section 4 into the open.

Background: A warm orange/pink sunset sky with a glowing sun.

Midground: Layered faceted purple pyramid mountains.

Foreground: Calm ocean water reflecting the sunset.

Content: Final CTA / Footer centered elegantly.

12. - 16. ASSET HANDLING & RESPONSIVENESS
Use SVG shapes/paths for the water, waterfall, and energy streams. Animate the SVG strokeDashoffset or use CSS filters (drop-shadow) for the glows.

Do NOT use generic stock photos.

On Mobile: Reduce parallax amplitude. Stack the text above the visual illustrations. Do not allow horizontal overflow.

17. - 18. ACCESSIBILITY & PERFORMANCE
Semantic headings.

If prefers-reduced-motion is active, disable the GSAP parallax transforms.

Use will-change: transform only on the parallax layers.

19. VISUAL QUALITY BAR
Checklist:

[ ] Is the website one continuous world?

[ ] Do the seams connect perfectly (River -> Waterfall -> Turbine)?

[ ] Is GSAP + Lenis making the scroll buttery smooth?

[ ] Are the colors accurate to the Midnight Purple / Electric Blue / Molten Gold palette?

[ ] Are the vector mountains faceted (low-poly style)?

20. CODE QUALITY
Centralize configuration. Do not write 50 disconnected scroll event listeners. Use GSAP ScrollTrigger arrays to loop through parallax layers automatically.

21. CONTENT RULE
Use placeholder copy if exact text is unreadable, but preserve the exact visual hierarchy (Huge headings vs compact editorial body paragraphs).

22. FINAL DELIVERABLE
The project must contain the complete HTML, CSS, and JS. Do not stop after producing a skeleton. Implement the actual page, draw the SVG water/energy, and tune it visually.

23. MOST IMPORTANT DIRECTIVE
Do not think of this as "making 5 HTML sections."
Think of it as:

"Reconstructing a single continuous vertical vector environment, stitched seamlessly together, and moving the camera through it using Lenis and GSAP."