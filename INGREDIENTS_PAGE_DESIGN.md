# Ingredients Page Design Spec

This spec is derived from the current homepage implementation in `src/App.tsx`, `src/App.css`, and `src/index.css`.

## Purpose

The Ingredients page must feel like a direct extension of the homepage, not a separate microsite.

That means:

- Use the same typography system already implemented on the homepage.
- Reuse existing layout rhythms and card patterns.
- Keep section purposes concrete and product-facing.
- Avoid decorative filler blocks that do not communicate content.

## Core Tokens

Source: `src/index.css`

- Body font: `var(--font-body)` = `Manrope`
- Display font token exists: `var(--font-display)` = `Fraunces`
- Homepage section headings override to `var(--font-body)`, not `Fraunces`
- Background: `#fdfaf5`
- Background off-tone: `#f4eee6`
- Surface: `#ffffff`
- Surface elevated: `#faf6f0`
- Surface muted: `#f0e9df`
- Body text: `#2c251d`
- Secondary text: `#74675a`
- Divider: `#e4d8c8`
- Accent dark: `#915e34`
- Brand gradient: `linear-gradient(135deg, #cc8c52 0%, #a66a36 100%)`
- Hero background: `#b87c47`
- Soft shadow: `0 18px 48px rgba(44, 37, 29, 0.08)`
- Glass shadow: `0 8px 32px 0 rgba(145, 94, 52, 0.15)`

## Typography Rules

Source: `src/index.css`, `src/App.css`

- Base page font is `Manrope`.
- Global `h1` / `h2` default to `Fraunces`, but homepage modules intentionally override major section headings to `Manrope`.
- Ingredients page should follow homepage section behavior, not global defaults.

### Homepage type sizes

- Header wordmark: `2rem`, weight `700`
- Nav links: `0.98rem`
- Hero label: `0.8rem`, uppercase, heavy tracking
- Hero title: `var(--hero-title-size)` = `52px`, `Manrope`, weight `700`
- Hero body: `1.08rem`, line-height `1.7`
- Section kicker: `0.9rem` or smaller, uppercase/heavy
- Section titles: `var(--section-title-size)` = `44px`, `Manrope`, tight letter spacing
- Standard section body copy: `1.02rem` to `1.06rem`, line-height `1.65` to `1.7`
- Card eyebrow/meta: `0.72rem` to `0.84rem`, uppercase, heavy tracking
- Card heading: around `1.15rem` to `2rem` depending on module

## Layout Rhythm

Source: `src/App.css`

- Main content sections sit inside `width: min(1200px, 100%)` or similar.
- Section padding is typically between `5rem` and `5.5rem` top, then smaller bottom spacing.
- Layout alternates between:
  - split editorial + visual section
  - centered intro + grid of cards
  - media frame + supporting copy
  - final CTA block
- Border radius is large and soft:
  - hero: `1.9rem`
  - large cards/frames: `2rem`
  - smaller cards: `1.3rem` to `1.5rem`

## Homepage Patterns To Reuse

### 1. Header

- Same header spacing and CTA behavior as homepage.
- Ingredients nav item should simply join the existing nav set.
- Desktop and mobile behavior must match homepage nav logic.

### 2. Hero Pattern

- Homepage hero is a two-panel composition.
- Left side contains ambient/decorative system plus floating data cards.
- Right side contains actual message and CTA.
- Ingredients page can reuse this pattern, but any visual panel must communicate ingredients content.
- Empty decorative slabs or blank framed areas are not acceptable.

### 3. Split Section Pattern

Used in `.benefits-section` and `.science-section`.

- One side: copy with kicker, heading, supporting paragraph, CTA or proof points.
- Other side: visual system or meaningful cards.
- If a side does not contain useful information, remove the split layout.

### 4. Blend Card Pattern

Used in `.paths-section`.

- Large immersive cards
- Dark gradient backgrounds
- Glass frame overlay
- Strong bottom-aligned content
- White text
- Subtle ambient shapes/gridlines

This is the strongest existing pattern for showcasing ingredient groups or featured blends.

### 5. Proof Card Pattern

Used in `.science-proof-item`.

- Light surface cards
- Small accent stroke
- Tight headline + short explanatory copy
- Works for ingredient facts, sourcing principles, or usage categories

### 6. Final CTA Pattern

- Warm gradient block
- High contrast white text
- Single clear CTA

## Content Rules For Ingredients Page

- Every section must answer a product question:
  - what ingredients exist
  - how they are grouped
  - why they matter
  - what key blends are included
- Do not include generic self-referential copy about the page design itself.
- Do not create sections whose content is “this page matches the homepage”.
- Avoid filler labels like “designed for continuity”.
- Use the CSV content to drive substance.

## Structural Direction For Redesign

Recommended page order:

1. Homepage header
2. Ingredients hero using homepage two-panel rhythm
3. Featured ingredient families using homepage `paths-section` card language
4. Full ingredient catalogue using lighter cards or grouped sections
5. Optional sourcing / formulation section using `science-section` structure only if content is meaningful
6. Existing footer

## Explicit No-Go Items

- No blank framed art blocks
- No sections explaining the design itself
- No new font system
- No arbitrary card styles that do not map back to homepage components
- No oversized light-beige panels that read as empty placeholders

## Responsive Rules

Source: homepage media queries in `src/App.css`

- At `1180px` and below:
  - split layouts collapse to one column
  - tall feature cards reduce in height
  - proof grids stack
- At `860px` and below:
  - mobile nav activates
  - layout should use same compact header behavior
- At `720px` and below:
  - spacing tightens
  - section blocks keep large radii but reduce padding

## Implementation Notes

- Prefer reusing existing homepage classes or class patterns where practical.
- If new classes are introduced, they should extend homepage behavior rather than invent a separate visual language.
- Ingredients page headings should use `Manrope` in the same way as homepage section headings.
