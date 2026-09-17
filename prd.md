# PRD — SEGESTA Continuous Vector Parallax Landing Page

## 1. Project Overview

### Product
A single-page, high-end editorial landing page reconstructing the **SEGESTA** visual world. 

### Primary objective
Recreate the visual composition, faceted vector illustration style, spatial rhythm, and most importantly, the **continuous vertical camera journey**. The page passes through five distinct visual environments connected physically by fluid elements (River ➔ Waterfall ➔ Turbine ➔ Molten Energy ➔ Ocean).

This requires:
- HTML5, CSS3, Vanilla JS
- **Lenis Smooth Scroll** and **GSAP (ScrollTrigger)** for advanced parallax and path scrubbing.

------------------------------------------------------------------------

## 2. Reference Set (Visual Stages)

The website is ONE continuous vertical artwork.

| Stage | Section Name | Key Visual Elements | Continuity Seam Contract |
| :--- | :--- | :--- | :--- |
| **01** | Hero / Story | City skyline, central river, distant faceted mountains | Bottom: River reaches cliff edge |
| **02** | Our Mission | Central vertical waterfall, glass laboratory on right with staircases & scientists | Top: River falls into waterfall<br>Bottom: Basin feeds turbine |
| **03** | Our Advantages | Water turbine on left, control room with operator on right | Top: Turbine intake<br>Bottom: Metallic pipes channel fluid |
| **04** | Model For Success | Molten glowing golden energy streams, underground catwalks, bottom archway | Top: Pipes pour energy streams<br>Bottom: Archway opens to nature |
| **05** | Landscape Finale | Sunset ocean, glowing sun, pyramid mountains, birds | Top: Emerging from archway into open landscape |

------------------------------------------------------------------------

## 3. Design Direction

### Core visual language
- Stylized vector artwork (Faceted / Low-poly geometry)
- Cinematic, dark, and futuristic
- Continuous spatial continuity (no hard cuts)

### Palette
- Ambient Dark: Midnight Purple (`#120B29`), Deep Indigo (`#1C1236`)
- Cool Accents (Water): Electric Cyan (`#38C6FF`), Sky Blue (`#82E2FF`)
- Warm Accents (Energy/Sunset): Sunset Gold (`#FFAC43`), Molten Coral (`#FF7B42`)
- Typography: White

### Typography
Modern sans-serif system stack. Huge display headings for titles, compact editorial sizes for body text.

------------------------------------------------------------------------

## 4. Global Layout

### Global navigation
- Fixed at the top (`position: fixed; z-index: 9999`)
- Glassmorphism effect (`backdrop-filter: blur(12px)`)
- Structure: `Our Story | SolutionLab | Clients | [SEGESTA LOGO] | Portfolio | Blog | [Contact]`
- Collapses to a hamburger menu on mobile.

------------------------------------------------------------------------

## 5. Parallax Architecture & Seam Alignment

The page must be implemented as a standard vertical document flow (`100vh` sections), NOT as a `position: fixed` virtual canvas hack.

### Zero-Gap Seam Rule
To maintain the illusion of one continuous painting:
- The bottom visual edge of Section 1 MUST perfectly touch the top visual edge of Section 2.
- These "seam" layers must have a parallax speed multiplier of `1.0` (they move exactly with the native scroll). 
- Parallax depth is created by moving the *inner* layers (background sky, midground buildings) at speeds like `0.2` or `0.5` using GSAP ScrollTrigger.

Example Depth Map:
``` text
Depth 0.20 — Background (Sky, Sun, Distant Mountains) - Slow
Depth 0.50 — Midground (Buildings, Laboratories) - Medium
Depth 1.00 — Foreground & Seams (River, Waterfall, Pipes) - Moves naturally
Depth 1.00 — Content (Typography, Buttons)
6. Section-by-Section Visual Specification
6.1 Hero
Left/Right: City skyline with glowing streetlights.

Center/Bottom: Horizontal river flowing down.

Text: Huge SEGESTA heading.

6.2 Mission
Center: Giant vertical waterfall.

Right: Glass lab with staircases and scientists.

Left: "Our Mission" text and CTA button.

6.3 Advantages
Left: Giant mechanical water turbine.

Right: Control room and "Our Advantages" text.

6.4 Model for Success
Center/Right: Molten golden energy streams falling from pipes.

Background: Underground dark cavern.

Bottom: Stone archway.

6.5 Landscape Finale
Full width: Sunset ocean landscape. Warm gradient sky, faceted purple mountains.

7. Asset Strategy
Recreate the environments using HTML, CSS gradients, and SVG paths (for mountains, rivers, and waterfalls). Apply CSS drop-shadow for the glowing water and energy effects.

8. - 10. Responsive, Accessibility & Performance
Desktop-first, but must stack elegantly on mobile without horizontal scroll.

Respect prefers-reduced-motion.

Use Lenis + GSAP to ensure smooth 60FPS animation without layout thrashing. Use transform and opacity strictly for animations.

11. Implementation Principle
"Reconstruct a single continuous illustrated environment connected by fluid elements (Water/Energy) and move the camera through it using native scroll-driven parallax powered by GSAP and Lenis."