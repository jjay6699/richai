# RicHealth AI Website Design System

This file documents the current design language implemented in the `richai` website codebase.

It is a working reference for:
- typography
- colors
- spacing
- radius
- shadows
- section widths
- interaction behavior
- responsive rules
- imagery direction

Use this file as the source of truth before adding new homepage sections.

## 1. Design Direction

Current site direction:
- premium health-tech / wellness
- clean, restrained, editorial
- warm neutral palette with gold-caramel brand accents
- rounded containers and soft shadows
- subtle motion, not flashy animation
- photography should feel lifestyle/editorial, not hospital/clinical stock
- hero is wider and more immersive than the rest of the page
- subsequent sections are more controlled in width

What to avoid:
- generic AI gradients and neon visuals
- over-designed “startup template” layouts
- mismatched stock imagery
- overly small or overly busy UI details

## 2. Fonts

Defined in `src/index.css`.

- Body/UI font: `Manrope`
- Display font available: `Fraunces`

Current usage:
- most headings are using `Manrope` through local component overrides
- body copy uses `Manrope`
- `Fraunces` is loaded but not currently the main heading style

CSS variables:
- `--font-body: "Manrope", "Segoe UI", sans-serif`
- `--font-display: "Fraunces", Georgia, serif`

## 3. Color System

Defined in `src/index.css`.

### Core brand colors
- `--primary: #d6945a`
- `--primary-deep: #bc7c46`
- `--accent-base: #b1794b`
- `--accent-dark: #915e34`

### Backgrounds
- `--background: #fdfaf5`
- `--background-off: #f4eee6`
- `--surface: #ffffff`
- `--surface-elevated: #faf6f0`
- `--surface-muted: #f0e9df`

### Text
- `--text: #2c251d`
- `--text-secondary: #74675a`
- `--text-inverse: #ffffff`

### Utility / feedback
- `--divider: #e4d8c8`
- `--success: #2e8b6c`
- `--warning: #c17b2f`
- `--error: #c94a3a`
- `--info: #3b6e8c`

### Special brand treatments
- `--brand-gradient: linear-gradient(135deg, #cc8c52 0%, #a66a36 100%)`
- `--hero-bg: #b87c47`

### Selection color
- `::selection: rgba(214, 148, 90, 0.2)`

## 4. Typography Scale

Current base heading rules in `src/index.css`:
- `h1`: `clamp(3.25rem, 7vw, 6.2rem)`
- `h2`: `clamp(2rem, 4vw, 3.4rem)`
- `h3`: `1.2rem`
- body copy: `1rem`

Custom variables currently present:
- `--hero-title-size: 52px`
- `--section-title-size: 44px`

Important note:
- Earlier design direction discussed with the user was:
  - hero title: `45px`
  - section titles: `38px`
- Current code is larger than that.
- Before building more sections, decide whether to keep current implementation or restore the intended 45px / 38px scale.

### Current local section styling

Hero title:
- font family: `Manrope`
- weight: `700`
- line-height: `1.05`
- letter-spacing: `-0.04em`
- color: white

Section 2 title:
- font family: `Manrope`
- size: `var(--section-title-size)`
- line-height: `1.02`
- letter-spacing: `-0.05em`
- forced line control via `.heading-line`

Small label / kicker style:
- uppercase in some contexts
- 0.72rem to 0.9rem range
- heavier tracking for metadata

## 5. Layout System

### Global page wrapper
Defined in `src/App.css`.

- `.page`
  - width: `100%`
  - min-height: `100vh`
  - desktop padding: `0.9rem 1.7rem 2rem`
  - mobile padding (`max-width: 640px`): `0.5rem 0.85rem 1.2rem`

### Header
- sits above the hero
- horizontal, minimal, clean
- uses page padding only

### Hero
- full-width relative to page wrapper
- not constrained to `1300px`
- larger and more immersive than later sections

Current hero dimensions:
- `.hero min-height: 48rem`
- `.hero-panel min-height: 47rem`
- border radius: `1.9rem`

### Section 2
- constrained width
- `.benefits-section width: min(1200px, 100%)`
- centered with `margin: 0 auto`
- padding top: `5.5rem`

This should remain the model for later non-hero content sections:
- controlled width
- centered
- more breathing room

Default rule moving forward:
- non-hero sections should use `1200px` max width unless explicitly changed

## 6. Radius System

Current radius language:
- major hero container: `1.9rem`
- hero accent slab: `2rem`
- data cards: `1rem`
- benefit cards: `1.5rem`
- nav dropdown: `1.25rem`
- mobile menu button: `1rem`
- pill CTAs: `999px`

Design rule:
- rounded, but not overly soft
- big sections are rounded
- cards are rounded
- CTA buttons are fully pill-shaped

## 7. Shadows and Depth

Current shadows:
- `--shadow-soft: 0 18px 48px rgba(44, 37, 29, 0.08)`
- `--shadow-glass: 0 8px 32px 0 rgba(145, 94, 52, 0.15)`

Implemented shadow patterns:
- hero container: `0 22px 58px rgba(44, 37, 29, 0.08)`
- CTA buttons: softer warm shadow
- benefit/photo cards: `0 20px 36px rgba(18, 32, 45, 0.12)`

Depth style:
- soft and ambient
- avoid harsh drop shadows
- subtle glassmorphism only where appropriate

## 8. Buttons

### Header CTA
- pill-shaped
- white background
- dark text
- soft shadow

### Hero CTA
- same base as header CTA
- white background on gold hero panel
- dark gold text

### Section CTA
- uses brand gradient
- white text
- medium shadow

Button behavior:
- hover lift is subtle
- hover shadow increases slightly
- should not feel glossy or over-animated

## 9. Hero Section Rules

Structure:
- 2-column desktop split
- left: ambient animated panel
- right: copy block on brand gradient background

### Left panel
- warm neutral animated system
- grid texture
- 3 orbit rings
- 3 floating data cards
- subtle radial ambient glows

### Right panel
- gold/caramel brand gradient
- strong white headline
- supporting paragraph
- white CTA
- angled translucent slab as a decorative anchor

### Motion used in hero
- floatField
- orbitPulse
- floatCard
- framer-motion intro transitions
- parallax mouse movement on floating cards

Motion rule:
- premium and restrained
- use motion to support depth, not to show off animation

## 10. Section 2 Rules

Structure:
- text left
- visual grid right
- width constrained to `1300px`

### Copy block
- kicker
- bold title
- supporting paragraph
- CTA

### Benefit grid
- 2-column desktop
- 2-column mobile
- photo-backed cards
- meta label at top-left area
- title on one line
- small badge at top-right
- dark overlay for text readability

### Current tile content
- Higher energy
- Memory & focus
- Better sleep
- Faster recovery
- Skin & hair support
- Balanced metabolism

## 11. Photography Rules

Current section 2 photos live in:
- `public/benefits/energy.jpg`
- `public/benefits/focus.jpg`
- `public/benefits/sleep.jpg`
- `public/benefits/recovery.jpg`
- `public/benefits/beauty.jpg`
- `public/benefits/metabolism.jpg`

Section 3 supporting imagery:
- `public/paths/bloodwork.jpg`

Photography style should be:
- editorial lifestyle
- premium wellness
- natural light or soft controlled lighting
- clean composition
- consistent grading
- not overly commercial

Avoid:
- hospital imagery
- doctor stock portraits
- gym cliché imagery
- obvious third-party supplement products
- random mixed-image quality

Hard rule:
- never use photography that shows another company’s packaged product on the RicHealth AI website

## 12. Responsive Rules

### Breakpoint: 1180px
- hero becomes column layout
- benefits section stacks vertically
- stagger on benefit cards is removed

### Breakpoint: 860px
- nav becomes hidden dropdown
- mobile menu toggle appears
- site header wraps

### Breakpoint: 640px
- page side padding reduces
- hero becomes `column-reverse`
  - text panel first
  - animated panel below
- hero left panel becomes grid-based
- hero cards become fixed grid positions
- orbit count reduced
- benefits section top padding reduced
- benefits grid remains 2 columns
- benefit cards become shorter

## 13. Motion Inventory

Defined in CSS:
- `floatField`
- `orbitPulse`
- `floatCard`
- `tileGlow`
- `menuFade`

Defined in React / Framer Motion:
- stagger container
- fade-up reveal
- hero card entrance
- hero card parallax
- CTA hover/tap scale
- benefit tile hover lift

Motion design principle:
- motion should feel expensive and intentional
- no noisy perpetual animation except subtle ambient movement

## 14. Current Design Decisions To Preserve

- warm gold brand system
- wide rounded hero
- constrained secondary sections
- strong whitespace around sections
- pill CTAs
- premium but simple composition
- mobile layout is deliberately rearranged, not just shrunk
- real photography is preferred over abstract filler where it adds value

## 15. Known Drift / Decisions To Revisit

These are current implementation points that may need review:

1. Type scale drift
- current code uses `52px` hero / `44px` section
- earlier preferred direction was `45px` hero / `38px` section

2. Font usage drift
- `Fraunces` is loaded but not really used as the design system heading font
- current site is effectively mostly `Manrope`

3. Naming drift
- some CSS uses `brand-accent` / `brand-accent-deep`
- root variables currently define `primary` / `primary-deep` / `accent-base` / `accent-dark`
- these should be normalized later

4. Motion complexity
- current hero uses both CSS animation and framer-motion
- this is acceptable for now, but should be watched to prevent over-design

## 16. Guidance For Future Sections

For sections after the hero:
- keep width constrained like section 2
- use `38px` section titles if we restore the intended scale
- use warm neutral backgrounds first, not bright color blocks by default
- reserve bold color fields for high-impact areas only
- use photo-backed cards only when the images are coherent as a set
- prioritize editorial composition over generic UI grids

Recommended section recipe:
- kicker
- bold title
- short paragraph
- one focused visual system
- one CTA only when needed

## 17. File Map

Main files controlling current design:
- `src/index.css`
- `src/App.css`
- `src/App.tsx`

Current image assets:
- `public/benefits/*`
- `public/hero/*`

## 18. Update Rule

Whenever a major visual change is approved, update this file.

Minimum updates to record:
- any new color token
- any change to heading scale
- any new section width rule
- any new border radius rule
- any new animation pattern
- any photography direction shift
