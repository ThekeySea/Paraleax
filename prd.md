# PRD --- Native Parallax Landing Page Reconstruction

## 1. Project Overview

### Product

A single-page, editorial/visual landing page reconstructed from the
supplied nine screenshots.

### Primary objective

Recreate the **visual composition, spatial rhythm, layered illustration,
navigation treatment, typography hierarchy, and scroll-driven parallax
behavior** visible in the references.

This is a **native web implementation**: - HTML5 - CSS3 - Vanilla
JavaScript - Native browser APIs only

Do not use: - React / Vue / Svelte / Angular - Bootstrap / Tailwind -
GSAP / Framer Motion / Lenis / Locomotive Scroll - jQuery - component
libraries - animation libraries - external UI frameworks

External image assets are allowed only when they are local project
assets or explicitly supplied by the project owner. The implementation
must not depend on a third-party CDN.

------------------------------------------------------------------------

## 2. Reference Set

The reference sequence supplied by the owner is:

  -----------------------------------------------------------------------
  Reference               Role                    Visual state
  ----------------------- ----------------------- -----------------------
  01                      Hero                    Dark futuristic studio
                                                  / architecture scene,
                                                  `Our Mission`

  02                      Transition 1→2          Urban canyon, central
                                                  waterfall,
                                                  `Our Mission` entering
                                                  at bottom

  03                      Section 2               Same visual frame as
                                                  reference 01

  04                      Transition 2→3          Dark continuation with
                                                  `Our Advantages`
                                                  entering

  05                      Section 3               Large
                                                  industrial/futuristic
                                                  wheel on left, content
                                                  on right

  06                      Transition 3→4          Continuation of
                                                  industrial scene,
                                                  lower-left text

  07                      Section 4               Industrial chamber,
                                                  orange glowing objects
                                                  and vertical light
                                                  structure

  08                      Transition 4→5          Dark foreground giving
                                                  way to a large
                                                  landscape/water scene

  09                      Section 5               Wide sunset mountain /
                                                  sea landscape
  -----------------------------------------------------------------------

### Important observation

Reference 01 and reference 03 are **pixel-identical** in the supplied
files. Treat this as intentional reference information, not as an error
to be "fixed" automatically.

The transition screenshots are not simple decorative separators. They
communicate that the page is one **continuous visual world** and that
the camera is moving through it.

------------------------------------------------------------------------

## 3. Design Direction

### Core visual language

The page should feel like: - futuristic editorial - cinematic -
architectural - immersive - dark - premium but not glossy - highly
art-directed - intentionally surreal

### Palette

Use the references as the source of truth. The dominant palette is
approximately: - near-black navy: `#080820` / `#0b0928` - deep indigo /
violet: `#171044` / `#241052` - blue-violet atmospheric light -
magenta/pink accents - warm amber/orange light - white typography

Do not turn the page into a generic purple gradient website. The
important characteristic is the **relationship between dark
architectural masses and localized colored illumination**.

### Typography

The reference uses a modern sans-serif with: - large white display
headings - compact navigation - small supporting body text - relatively
tight heading line-height - restrained letter spacing

Use a robust system sans-serif stack by default. If a supplied local
font exists, use it through `@font-face`.

Do not invent a decorative font.

------------------------------------------------------------------------

## 4. Global Layout

### Desktop reference frame

The screenshots are approximately 942--946 px wide and 701--712 px high.
They should be treated as **desktop viewport references**, not as a
fixed implementation size.

The actual website must be responsive.

### Global navigation

A persistent top navigation is visible across the references.

Approximate structure:

-   left: `Our Story`
-   left/center: a second navigation item resembling `Solutions`
-   left/center: `Clients`
-   center: small geometric triangular logo
-   right: `Portfolio`
-   right: `Blog`
-   far right: outlined `Contact` button

Because the source screenshot is low resolution, do not pretend
uncertain copy is exact. Preserve the visual hierarchy and spacing; use
the project's final copy where provided.

### Navigation behavior

Desktop: - fixed/sticky at the top - transparent over the visual scene -
small white/very-light text - centered logo - outlined contact button -
high z-index - should remain readable over all scenes

Mobile: - keep logo visible - collapse navigation into a native menu
button - do not allow navigation text to overlap the artwork - use a
simple full-screen or dropdown menu - menu must be keyboard accessible

The navigation should not have a large opaque background unless required
for contrast at a breakpoint.

------------------------------------------------------------------------

## 5. Parallax Architecture

The page must be implemented as a **layered scene system**, not as nine
unrelated background images.

### Recommended model

Use a scroll track containing chapters:

``` text
page
├── fixed/sticky navigation
├── parallax-stage
│   ├── chapter-hero
│   ├── transition-1
│   ├── chapter-mission
│   ├── transition-2
│   ├── chapter-advantages
│   ├── transition-3
│   ├── chapter-model
│   ├── transition-4
│   └── chapter-landscape
└── footer / ending state if required
```

Each chapter should have: - a scroll range - a sticky viewport -
background layer - atmospheric layer - architectural/illustration
layer - foreground layer - content layer

### Layer depth

Use different movement coefficients.

Example conceptual depth map:

``` text
Depth 0.00 — background color / distant atmosphere
Depth 0.15 — distant architecture / sky
Depth 0.30 — large environmental structures
Depth 0.50 — waterfall / central light / major illustration
Depth 0.70 — foreground structures
Depth 0.85 — people / screens / furniture
Depth 1.00 — typography / UI
```

The exact values should be tuned visually rather than copied blindly.

### Scroll model

Use vanilla JavaScript with `requestAnimationFrame`.

Do not attach expensive layout work directly to every raw `scroll`
event.

Preferred pattern:

1.  `scroll` event records the current scroll position.
2.  `requestAnimationFrame` updates the scene.
3.  Calculate normalized progress for the active chapter.
4.  Write progress to CSS custom properties.
5.  CSS performs transforms/opacity where possible.

Example conceptual variables:

``` css
--scroll-progress: 0;
--chapter-progress: 0;
--parallax-y: 0px;
--scene-opacity: 1;
```

### Avoid

Do not create a fake parallax effect by simply applying:

``` css
background-attachment: fixed;
```

The reference contains **multiple depth relationships**. At minimum,
foreground, midground and background must move at different rates.

------------------------------------------------------------------------

## 6. Section-by-Section Visual Specification

## 6.1 Reference 01 --- Hero

### Composition

The first frame contains:

-   dark purple/navy full-bleed environment
-   navigation at top
-   large `Our Mission` heading on the left
-   supporting copy below
-   white rectangular `Let's Build` CTA
-   a person and workstation/interface at bottom-left
-   tall vertical waterfall/light structure in the center
-   transparent architectural/platform structures
-   three stacked illuminated spaces on the right
-   human silhouettes inside the right structure
-   magenta/purple floor glow
-   strong depth from foreground railing/platforms

### Layout

The content block occupies roughly the left third.

The center is intentionally kept visually open around the vertical
waterfall/light column.

The right third is dominated by the stacked architecture.

Do not center the hero text.

### Text hierarchy

`Our Mission` is the dominant heading.

The body copy is substantially smaller and visually subordinate.

The CTA is small and rectangular, white background with dark text.

### Parallax

As the user begins scrolling: - background architecture moves slowly -
central waterfall/light column remains a strong visual anchor -
foreground person/workstation moves faster - right-side architectural
structure shifts independently - content begins to move/fade according
to the transition choreography

------------------------------------------------------------------------

## 6.2 Reference 02 --- Transition from Hero to Section 2

### Composition

The visual world opens into: - a long urban corridor - buildings on both
sides - repeated warm triangular/spot lighting - rocks around a central
water channel - a waterfall flowing toward the viewer -
sunset/pink-orange sky in the distance - `Our Mission` entering near the
lower edge

### Purpose

This is a **camera transition**, not a conventional section divider.

The user should feel that the camera has moved away from the hero
architecture and is traveling through a new environment.

### Motion

During scroll: - city walls drift laterally/vertically at different
rates - water moves toward the viewer - foreground rocks move faster -
waterfall has subtle vertical motion - sky remains comparatively
stable - heading enters from below

------------------------------------------------------------------------

## 6.3 Reference 03 --- Section 2

This supplied image is exactly identical to Reference 01.

Do not replace it with a different composition without explicit
instruction.

Implementation should preserve the reference state while allowing the
scroll choreography to explain why this state appears again.

------------------------------------------------------------------------

## 6.4 Reference 04 --- Transition from Section 2 to Section 3

### Composition

The previous architecture is still partially visible.

A large dark horizontal foreground mass crosses the page.

`Our Advantages` begins to enter from below on the right.

Vertical blue/purple architectural light elements appear behind it.

### Motion

The transition should feel like the camera is moving downward/forward
through the same constructed world.

Use: - foreground wipe/parallax - vertical architectural movement -
heading reveal - gradual opacity transition

Do not use a hard cut.

------------------------------------------------------------------------

## 6.5 Reference 05 --- Section 3: Our Advantages

### Composition

Two-column visual balance:

**Left** - huge futuristic circular wheel / mechanical structure -
people and platform/railing - pink/red internal illumination - deep
architectural background

**Right** - large `Our Advantages` heading - thin horizontal divider -
multiple text blocks - small bold subheadings - illustration of people
working with translucent interfaces near the bottom

### Typography

Heading is very large and white.

A thin divider separates heading and body.

Body copy is compact and editorial.

Subheadings are visually stronger than body text but much smaller than
the main heading.

### Layout principle

This section is asymmetrical.

Do not convert it into two equal cards.

The illustration should feel integrated into the environment rather than
placed inside a card.

------------------------------------------------------------------------

## 6.6 Reference 06 --- Transition from Section 3 to Section 4

The industrial environment continues.

Important visible elements: - upper part of the wheel scene - dark
foreground platform - lower-left text block beginning to appear - warm
orange illuminated objects in the lower region - central/right vertical
waterfall or light structure

This transition should preserve environmental continuity.

Avoid a full-screen fade to a blank background.

------------------------------------------------------------------------

## 6.7 Reference 07 --- Section 4

### Composition

A darker industrial/futuristic chamber.

Left: - a person at a translucent interface - glowing orange spheres /
objects on a platform

Center/right: - architectural scaffolding - tall orange illuminated
vertical structures - central waterfall/light column

### Text

Visible content includes: - `A Model For Success.` -
`Attentiveness as a Priority.`

These are smaller editorial headings followed by compact body copy.

### Spatial strategy

The text is placed on the left against a dark architectural area.

The artwork occupies the right and lower-right area.

The environment should feel more mechanical and industrial than the
previous scene.

------------------------------------------------------------------------

## 6.8 Reference 08 --- Transition from Section 4 to Section 5

The industrial environment falls away.

A very large dark foreground form dominates the lower portion.

A warm orange landscape begins to emerge behind it.

The transition eventually reveals: - water - mountain silhouettes - warm
sunset - distant clouds - purple rocks

This is the largest tonal shift in the page.

### Motion

Use a slow reveal: - industrial layers move upward/out of frame -
landscape layers move into frame - foreground rocks move at a different
rate - sun/light glow expands subtly - water remains calm - final scene
becomes increasingly open

------------------------------------------------------------------------

## 6.9 Reference 09 --- Section 5

### Composition

Wide cinematic landscape: - orange/pink sunset sky - low sun near
left/center-left - calm water - distant horizon - large purple mountain
on right - smaller mountain near center - purple rocks in foreground -
warm reflections across water

This scene should function as a visual release after the dense
architectural sections.

### Motion

Use very restrained parallax: - sky: almost static - distant mountains:
slow - main mountain: medium - foreground rocks: faster - water
reflection: very subtle

Do not overanimate the final landscape.

------------------------------------------------------------------------

## 7. Asset Strategy

### Preferred

If original illustration assets are available: - separate background -
architecture - people - effects - foreground - typography/UI

Keep them as individual assets.

### If only screenshots exist

Do not simply place each screenshot as a full-screen `<img>` and call it
parallax.

Instead: 1. use the screenshots to reconstruct composition; 2. identify
reusable visual layers; 3. create local image/SVG/CSS layers; 4. use the
screenshot only as a visual reference or fallback during development.

### Native SVG is permitted

Inline or local SVG is acceptable because it is a browser-native
technology.

Use SVG for: - simple architectural lines - geometric logo - railings -
circles - abstract shapes - simple atmospheric geometry

Do not attempt to manually recreate highly detailed painterly artwork
with hundreds of arbitrary SVG paths unless the asset is actually
supplied.

### No invented assets

If an exact artwork cannot be reconstructed from available assets,
create a clearly documented placeholder and structure the code so the
asset can be replaced later.

Do not silently substitute generic stock imagery.

------------------------------------------------------------------------

## 8. Responsive Requirements

### Desktop

The supplied screenshots primarily represent desktop.

Preserve: - large cinematic composition - asymmetry - full viewport
scenes - navigation - large typography - layered depth

### Tablet

Reduce: - typography scale - scene depth - number of visible foreground
layers

Reposition content rather than allowing clipping.

### Mobile

Do not attempt to squeeze the desktop composition into a 390 px
viewport.

Create a deliberate mobile composition: - simplified artwork layers -
reduced parallax amplitude - stacked content - readable typography -
touch-safe controls - navigation menu - no horizontal overflow

The visual identity must remain recognizable.

------------------------------------------------------------------------

## 9. Accessibility

Required: - semantic HTML - proper heading hierarchy -
keyboard-accessible navigation - visible focus states - sufficient text
contrast - buttons must be real `<button>` or `<a>` elements -
meaningful `alt` text for meaningful images - decorative images use
empty alt - `aria-expanded` / `aria-controls` for mobile menu - support
`prefers-reduced-motion`

When reduced motion is enabled: - disable large scroll translations -
disable decorative floating movement - keep opacity/structural
transitions minimal - preserve content order and readability

------------------------------------------------------------------------

## 10. Performance

Requirements: - no continuous DOM layout reads inside the animation
write loop - use `requestAnimationFrame` - transform/opacity for
animated properties - avoid animating `top`, `left`, `width`, `height`
when transform is possible - lazy-load noncritical images - use
appropriately sized local assets - avoid excessive DOM nodes - avoid
huge uncompressed raster assets when alternatives exist

Use `will-change` selectively, not globally.

------------------------------------------------------------------------

## 11. Interaction Details

### CTA

`Let's Build` is a visible primary CTA.

Its exact destination is not defined by the references. Keep it
configurable.

### Navigation

Each navigation item must have a real destination or a documented
placeholder.

### Scroll

Scrolling is the primary interaction.

The parallax must: - respond continuously - remain stable at different
scroll speeds - not hijack the user's scroll - not use forced smooth
scrolling that makes the page feel sluggish

Do not override native scrolling with a custom virtual-scroll engine.

------------------------------------------------------------------------

## 12. Suggested File Structure

``` text
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── assets/
│   ├── logo/
│   ├── scenes/
│   │   ├── hero/
│   │   ├── mission/
│   │   ├── advantages/
│   │   ├── model/
│   │   └── landscape/
│   └── icons/
└── reference/
    ├── 01-hero.png
    ├── 02-transition-1.png
    ├── 03-section-2.png
    ├── 04-transition-2.png
    ├── 05-section-3.png
    ├── 06-transition-3.png
    ├── 07-section-4.png
    ├── 08-transition-4.png
    └── 09-section-5.png
```

------------------------------------------------------------------------

## 13. CSS Architecture

Use CSS custom properties:

``` css
:root {
  --bg-deep: #080820;
  --bg-indigo: #171044;
  --text-primary: #ffffff;
  --text-secondary: rgba(255,255,255,.72);
  --accent-warm: #f6a04a;
  --accent-pink: #d44d9b;

  --content-max: 1440px;
  --gutter-desktop: clamp(32px, 5vw, 88px);
  --gutter-mobile: 20px;

  --display-xl: clamp(3rem, 7vw, 7rem);
  --display-lg: clamp(2.5rem, 5vw, 5rem);
  --body-md: clamp(.9rem, 1vw, 1.05rem);
}
```

These values are starting points only. Tune against the references.

Use classes based on visual responsibility rather than arbitrary
utility-class proliferation.

------------------------------------------------------------------------

## 14. JavaScript Architecture

Use small, explicit modules/functions:

``` text
initNavigation()
initParallax()
updateScrollState()
updateChapterProgress()
applySceneTransforms()
initReducedMotion()
```

A chapter should expose a normalized progress value:

``` text
0.0 = chapter entering
0.5 = chapter centered
1.0 = chapter leaving
```

Each layer maps progress to: - translateX - translateY - scale -
opacity - optional rotation

Keep animation configuration data-driven.

Example conceptual data:

``` js
{
  selector: ".hero__foreground",
  from: { y: 40, x: 0, scale: 1.02, opacity: 0 },
  to:   { y: -80, x: 0, scale: 1, opacity: 1 }
}
```

The final implementation should avoid a giant collection of unrelated
hard-coded scroll handlers.

------------------------------------------------------------------------

## 15. Visual QA Checklist

Compare the implementation against all nine references.

### Global

-   [ ] navigation position matches
-   [ ] logo remains centered
-   [ ] background darkness is correct
-   [ ] white typography has the correct hierarchy
-   [ ] no unintended gradients or cards
-   [ ] composition feels cinematic rather than template-like

### Hero

-   [ ] heading is left aligned
-   [ ] central waterfall/light column is visually dominant
-   [ ] right stacked architecture is visible
-   [ ] CTA is compact
-   [ ] foreground person/workstation provides depth

### Mission transition

-   [ ] urban canyon opens up
-   [ ] central water/waterfall leads the eye
-   [ ] rocks and buildings have separate depth

### Advantages

-   [ ] giant wheel is not treated as a card
-   [ ] heading is right aligned
-   [ ] divider is present
-   [ ] body copy is compact
-   [ ] lower interface illustration is integrated

### Model

-   [ ] orange objects and vertical structures create warm focal points
-   [ ] environment remains dark
-   [ ] text remains legible
-   [ ] transition into landscape is gradual

### Final landscape

-   [ ] sunset is warm
-   [ ] mountains are purple
-   [ ] foreground rocks are dark/purple
-   [ ] water provides horizontal calm
-   [ ] parallax amplitude is restrained

------------------------------------------------------------------------

## 16. Acceptance Criteria

The implementation is accepted only when:

1.  It uses native HTML/CSS/JavaScript.
2.  It does not depend on animation or UI libraries.
3.  The page has real scroll-driven parallax.
4.  The nine supplied references are represented in the intended
    sequence.
5.  The transitions visually connect scenes rather than functioning as
    hard cuts.
6.  The layout is responsive.
7.  The navigation remains usable.
8.  Reduced-motion users receive a usable non-parallax experience.
9.  No horizontal overflow exists at supported viewport sizes.
10. The code is organized so artwork can be replaced without rewriting
    the animation engine.
11. The visual result is judged against the supplied screenshots, not
    against a generic "parallax website" aesthetic.
12. Uncertain copy or missing artwork is not fabricated as though it
    were sourced from the reference.

------------------------------------------------------------------------

## 17. Implementation Principle

The most important implementation rule is:

> **Build the page as a camera moving through a layered visual
> environment, not as a sequence of static web sections.**

The HTML provides semantic content and scene structure.

CSS provides: - composition - depth - clipping - typography - responsive
behavior

Vanilla JavaScript provides: - scroll progress - layer transforms -
scene transitions - navigation state - reduced-motion handling

The result should feel like one continuous illustrated world.
