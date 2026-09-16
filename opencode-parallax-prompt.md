# OpenCode Prompt --- Build the Native Parallax Landing Page

You are a senior UI/UX designer, frontend engineer, motion designer, and
visual implementation specialist.

Your task is to build a **native HTML/CSS/Vanilla JavaScript parallax
landing page** from the supplied visual references and the attached
`prd.md`.

## NON-NEGOTIABLE RULES

1.  Read `prd.md` completely before writing code.
2.  Treat the nine reference images as the visual source of truth.
3.  Do not create a generic "modern parallax landing page".
4.  Do not redesign the composition into cards, grids, gradients,
    glassmorphism, or a conventional SaaS layout.
5.  The target is a cinematic, dark, futuristic, architectural visual
    world.
6.  Use only:
    -   HTML5
    -   CSS3
    -   Vanilla JavaScript
    -   native browser APIs
    -   local project assets
7.  Do NOT install or use:
    -   React
    -   Vue
    -   Svelte
    -   Angular
    -   Tailwind
    -   Bootstrap
    -   GSAP
    -   Framer Motion
    -   Lenis
    -   Locomotive Scroll
    -   jQuery
    -   animation libraries
    -   UI component libraries
    -   external CDN dependencies
8.  Do not use `background-attachment: fixed` as the entire parallax
    implementation.
9.  Do not hijack native scrolling.
10. Do not fabricate missing source artwork or pretend an uncertain
    detail from a low-resolution screenshot is exact.
11. Keep the animation engine separate from scene content so assets can
    be replaced later.
12. Make the result responsive and accessible.
13. Support `prefers-reduced-motion`.
14. Do not stop after producing a skeleton. Implement the actual page
    and tune it visually.

------------------------------------------------------------------------

# 1. FIRST: INSPECT THE PROJECT

Before editing anything:

-   inspect the existing directory structure;
-   identify the current entry HTML file;
-   identify existing CSS and JS;
-   inspect the existing assets;
-   identify whether the reference images are available in a
    `reference/` directory;
-   identify whether there is an existing build system.

Do not delete an existing project structure blindly.

If the project is empty, create:

``` text
index.html
css/style.css
js/app.js
assets/
reference/
```

If the project already has equivalent files, adapt them instead of
creating unnecessary duplicates.

------------------------------------------------------------------------

# 2. READ THE REFERENCE SEQUENCE CORRECTLY

There are exactly nine reference states:

1.  Hero
2.  Transition from hero to section 2
3.  Section 2
4.  Transition from section 2 to section 3
5.  Section 3
6.  Transition from section 3 to section 4
7.  Section 4
8.  Transition from section 4 to section 5
9.  Section 5

Important:

**Reference 01 and Reference 03 are exactly identical in the supplied
image set.**

Do not "correct" this by inventing a different Section 2.

The transitions are part of the visual storytelling.

------------------------------------------------------------------------

# 3. UNDERSTAND THE DESIGN BEFORE CODING

The page is not a normal collection of sections.

Think of it as:

> a camera traveling through one continuous futuristic illustrated
> environment.

The visual language consists of:

-   near-black navy
-   deep indigo/violet
-   blue-violet vertical light
-   localized magenta/pink illumination
-   warm amber/orange light
-   white typography
-   industrial architecture
-   translucent interfaces
-   platforms and railings
-   human silhouettes
-   water/waterfall motifs
-   cinematic atmospheric depth

The page must have strong spatial layering.

------------------------------------------------------------------------

# 4. RECONSTRUCT THE NAVIGATION

Create a persistent desktop navigation resembling the references.

Visual structure:

``` text
Our Story     Solutions     Clients          [logo]          Portfolio   Blog   [Contact]
```

The exact uncertain labels can be configured in one data object or
clearly marked for replacement.

Requirements:

-   fixed/sticky
-   transparent
-   high z-index
-   small typography
-   centered logo
-   outlined Contact button
-   no giant navigation background
-   subtle hover state
-   visible focus state

On mobile:

-   logo remains visible
-   desktop links collapse
-   native menu button opens the navigation
-   menu is keyboard accessible
-   no horizontal overflow

------------------------------------------------------------------------

# 5. BUILD THE PAGE AS A SCENE SYSTEM

Use a structure similar to:

``` html
<main class="parallax-page">
  <section class="chapter chapter--hero">...</section>
  <section class="chapter chapter--transition">...</section>
  <section class="chapter chapter--mission">...</section>
  ...
</main>
```

Inside each scene, use explicit layers:

``` html
<div class="scene">
  <div class="scene__background"></div>
  <div class="scene__atmosphere"></div>
  <div class="scene__midground"></div>
  <div class="scene__architecture"></div>
  <div class="scene__foreground"></div>
  <div class="scene__content"></div>
</div>
```

Use actual semantic HTML for text.

Do not put the entire scene into one HTML background image if it can
reasonably be layered.

------------------------------------------------------------------------

# 6. PARALLAX ENGINE

Implement a reusable vanilla JS parallax engine.

Use:

-   `window.scrollY`
-   `requestAnimationFrame`
-   normalized chapter progress
-   CSS custom properties
-   `transform`
-   `opacity`

Do not perform expensive DOM layout reads repeatedly in the animation
write phase.

Preferred flow:

``` text
scroll event
   ↓
store scroll position
   ↓
requestAnimationFrame
   ↓
calculate active chapter progress
   ↓
update CSS variables
   ↓
CSS transforms layers
```

Use a helper such as:

``` js
clamp(value, min, max)
lerp(a, b, t)
mapRange(value, inMin, inMax, outMin, outMax)
```

The animation should be data-driven.

Example:

``` js
const layers = [
  {
    selector: '.hero__background',
    x: 0,
    y: 0.10,
    scale: 0.01
  },
  {
    selector: '.hero__midground',
    x: 0,
    y: 0.25,
    scale: 0.02
  },
  {
    selector: '.hero__foreground',
    x: 0,
    y: 0.60,
    scale: 0.04
  }
];
```

These are examples, not final values.

Tune the coefficients by comparing against the screenshots.

------------------------------------------------------------------------

# 7. HERO IMPLEMENTATION

Recreate the visual logic of Reference 01.

Required composition:

### Left

-   large `Our Mission`
-   supporting copy
-   compact white `Let's Build` CTA
-   person/workstation near bottom-left

### Center

-   tall blue-violet waterfall/light column
-   vertical architectural lines
-   transparent structures

### Right

-   stacked illuminated rooms/platforms
-   people silhouettes
-   railings
-   warm orange/pink illumination

### Bottom

-   dark platform
-   magenta/purple environmental glow

Do not center the text.

The center visual axis must remain strong.

------------------------------------------------------------------------

# 8. TRANSITION 01

Reference 02 should feel like a camera movement.

Create:

-   tall buildings on both sides
-   repeated warm triangular lights
-   central river/water channel
-   rocks
-   waterfall toward the viewer
-   warm/pink sky
-   distant opening
-   `Our Mission` entering from below

Layer movement:

``` text
sky                very slow
distant buildings  slow
water channel      medium
rocks              faster
foreground         fastest
heading            independent content movement
```

Do not make everything translate by the same amount.

------------------------------------------------------------------------

# 9. SECTION 2

Reference 03 is identical to Reference 01.

Preserve that visual state.

If the page architecture requires a semantic section here, use the same
scene composition while allowing the scroll choreography to explain the
camera movement.

------------------------------------------------------------------------

# 10. TRANSITION 02

Reference 04:

-   preserve remnants of the previous architecture
-   create a large dark horizontal foreground mass
-   introduce blue-violet vertical structures
-   reveal `Our Advantages`
-   heading should enter naturally rather than pop in

Avoid a hard fade.

------------------------------------------------------------------------

# 11. SECTION 3 --- OUR ADVANTAGES

Recreate Reference 05.

### Left side

Large futuristic mechanical wheel:

-   enormous scale
-   dark metallic silhouette
-   pink/red internal glow
-   platforms
-   railings
-   small human figures

### Right side

Large:

``` text
Our Advantages
──────────────
We've Been There.
body text...

Boldly Transparent.
body text...
```

The divider is thin.

Do not place this content inside a white card.

The text should appear to belong to the environment.

Near the lower right, recreate the translucent workstation/interface
scene.

------------------------------------------------------------------------

# 12. TRANSITION 03

Reference 06:

-   continue the wheel/industrial environment
-   dark foreground platform
-   reveal lower-left text
-   introduce orange glowing objects
-   preserve central vertical light/waterfall structure

The transition should feel spatially continuous.

------------------------------------------------------------------------

# 13. SECTION 4

Recreate Reference 07.

Left:

-   person interacting with a translucent interface
-   glowing orange spheres/objects
-   dark platform

Right:

-   industrial structures
-   orange illuminated vertical elements
-   central blue-violet waterfall/light structure

Text:

``` text
A Model For Success.

[body copy]

Attentiveness as a Priority.

[body copy]
```

Use compact editorial typography.

Do not make the text huge.

------------------------------------------------------------------------

# 14. TRANSITION 04

Reference 08 is a major environmental transition.

The industrial environment should recede and reveal a warm landscape.

Use multiple layers:

``` text
industrial background
industrial architecture
dark foreground mass
warm sky
distant mountains
water
foreground rocks
```

As the user scrolls:

-   industrial layers leave the viewport
-   landscape layers enter
-   foreground rocks move at a different rate
-   warm light becomes stronger
-   water remains visually calm

Do not abruptly switch backgrounds.

------------------------------------------------------------------------

# 15. SECTION 5 --- LANDSCAPE

Recreate Reference 09.

Required:

-   warm orange/pink sunset
-   low sun
-   calm water
-   distant horizon
-   large purple mountain on right
-   smaller central mountain
-   purple foreground rocks
-   warm reflections

Use restrained parallax.

The final section should feel open and calm compared with the dense
industrial scenes.

------------------------------------------------------------------------

# 16. ASSET HANDLING

If supplied artwork exists:

-   use it;
-   preserve aspect ratio;
-   separate layers where possible;
-   do not distort the artwork.

If only screenshots exist:

Do not use each screenshot as a single full-page background and claim
the result is a layered parallax implementation.

Instead create a layered composition.

Acceptable native techniques:

-   local PNG/WebP
-   local SVG
-   inline SVG
-   CSS gradients for atmosphere
-   CSS shapes for simple geometry
-   CSS masks where appropriate
-   `<img>` with absolute positioning

Do not generate generic stock-photo replacements.

If a highly detailed illustration cannot be reconstructed without source
artwork, create a structurally correct asset slot and document it
clearly.

------------------------------------------------------------------------

# 17. RESPONSIVE BEHAVIOR

Desktop is the primary reference.

At desktop:

-   preserve asymmetry
-   preserve cinematic scale
-   preserve full-screen artwork
-   preserve large headings
-   preserve layered depth

At mobile:

Do NOT merely shrink the desktop composition.

Instead:

-   simplify background layers
-   reduce parallax distance
-   reposition text
-   stack content
-   maintain readable line lengths
-   make navigation usable
-   prevent horizontal overflow

Test at approximately:

``` text
1440 × 900
1280 × 800
1024 × 768
768 × 1024
390 × 844
```

------------------------------------------------------------------------

# 18. ACCESSIBILITY

Implement:

-   semantic headings
-   semantic navigation
-   keyboard navigation
-   focus-visible styles
-   descriptive alt text
-   decorative image handling
-   accessible mobile menu
-   reduced-motion mode

For:

``` css
@media (prefers-reduced-motion: reduce)
```

disable or substantially reduce:

-   large translations
-   continuous decorative movement
-   scale effects

The content must remain fully usable.

------------------------------------------------------------------------

# 19. VISUAL QUALITY BAR

Before considering the work complete, compare the implementation against
the references.

Check:

### Composition

-   Is the text in the same visual zones?
-   Are the large masses in the same locations?
-   Is the central waterfall/light motif positioned correctly?
-   Does the right-side architecture have comparable visual weight?
-   Does the wheel dominate Section 3?
-   Does the landscape open toward the end?

### Color

-   Is the environment predominantly dark?
-   Are blue/violet lights localized?
-   Are orange lights used as focal points?
-   Is white text sufficiently bright?
-   Is the final landscape significantly warmer?

### Motion

-   Do layers move at different speeds?
-   Do transitions feel like camera movement?
-   Is the final landscape calmer?
-   Does the page avoid cheap "floating card" animations?

### Typography

-   Is `Our Mission` dominant?
-   Is `Our Advantages` dominant in Section 3?
-   Are body paragraphs compact?
-   Are small headings visibly subordinate?

------------------------------------------------------------------------

# 20. CODE QUALITY

Keep the code readable.

Do not produce:

-   one giant JS function
-   duplicated scroll handlers
-   hundreds of arbitrary magic numbers
-   inline styles everywhere
-   unnecessary dependencies
-   inaccessible buttons
-   unnecessary absolute positioning for text

Centralize configuration:

``` js
const PARALLAX_CONFIG = {
  hero: {...},
  mission: {...},
  advantages: {...},
  model: {...},
  landscape: {...}
};
```

Use CSS custom properties for visual tuning.

------------------------------------------------------------------------

# 21. CONTENT RULE

The screenshots are low-resolution references.

If exact paragraph copy cannot be confidently read:

-   preserve approximate text density and line length;
-   use clearly editable placeholder copy;
-   do not invent a fake company identity;
-   do not claim the placeholder is the original wording.

The visual structure is more important than guessing unreadable text.

------------------------------------------------------------------------

# 22. FINAL DELIVERABLE

The project must contain:

``` text
index.html
css/style.css
js/app.js
assets/
```

plus any local scene assets required.

If `prd.md` is already present, leave it intact unless a technical
correction is genuinely necessary.

After implementation:

1.  run the available local validation/build command;
2.  check for console errors;
3.  check responsive overflow;
4.  check navigation interaction;
5.  check reduced motion;
6.  check that parallax works with normal scrolling;
7.  tune the visual values.

Do not finish with a generic explanation.

Finish only when the actual landing page implementation is present and
coherent.

------------------------------------------------------------------------

# 23. MOST IMPORTANT DIRECTIVE

Do not think of this as:

> "make nine screenshots into nine HTML sections."

Think of it as:

> **"reconstruct a single illustrated environment and move the camera
> through it using native scroll-driven parallax."**

That distinction determines the quality of the implementation.
