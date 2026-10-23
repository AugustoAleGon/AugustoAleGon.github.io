---
name: 'Augusto Gonzalez — Engineering Studio'
description: 'Warm paper, graphite, copper, and working instruments for a bilingual engineering portfolio.'
colors:
  paper: '#f7f6f2'
  ink: '#252923'
  muted: '#6a6d62'
  line: '#d9dacf'
  copper: '#ae4728'
  focus: '#b35a34'
  button-hover: '#424b38'
  sage-field: '#e7ebdf'
  machine-run: '#35432b'
  machine-paper: '#e9ece2'
  machine-top: '#f4f5ed'
  machine-shade-0: '#b7bfaa'
  machine-shade-1: '#cbd1bf'
  machine-shade-2: '#d5dacb'
  machine-shade-3: '#e3e7db'
  machine-outline: '#505a43'
  machine-copper: '#a64c2a'
  seen-screen: '#10110f'
  seen-card: '#1c1e19'
  seen-text: '#f5f3ee'
typography:
  display:
    fontFamily: 'Manrope Variable, sans-serif'
    fontSize: 'clamp(54px, 6.25vw, 88px)'
    fontWeight: 550
    lineHeight: 1.05
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Manrope Variable, sans-serif'
    fontSize: 'clamp(32px, 3.7vw, 50px)'
    fontWeight: 550
    lineHeight: 1.15
    letterSpacing: '-0.035em'
  headline-emphasis:
    fontFamily: 'DM Serif Display, Georgia, serif'
    fontWeight: 400
  case-title:
    fontFamily: 'Manrope Variable, sans-serif'
    fontSize: '27px'
    fontWeight: 550
    lineHeight: 1.35
    letterSpacing: '-0.03em'
  intro:
    fontFamily: 'Manrope Variable, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.85
  body:
    fontFamily: 'Manrope Variable, sans-serif'
    fontSize: '13px'
    fontWeight: 400
    lineHeight: 1.85
  button:
    fontFamily: 'Manrope Variable, sans-serif'
    fontSize: '12px'
    fontWeight: 600
  control:
    fontFamily: 'Manrope Variable, sans-serif'
    fontSize: '11px'
    fontWeight: 600
  metadata:
    fontFamily: 'Manrope Variable, sans-serif'
    fontSize: '10px'
    fontWeight: 400
rounded:
  small: '4px'
  control: '5px'
  demo-card: '10px'
  phone-screen: '40px'
  phone-shell: '47px'
  circle: '50%'
spacing:
  compact: '8px'
  inline: '15px'
  mobile-gutter: '22px'
  tablet-gutter: '28px'
  desktop-gutter: '48px'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    typography: '{typography.button}'
    rounded: '{rounded.control}'
    padding: '14px 19px'
  button-primary-hover:
    backgroundColor: '{colors.button-hover}'
  button-machine-run:
    backgroundColor: '{colors.machine-run}'
    textColor: '#fff'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
    padding: '11px 15px'
  button-machine-secondary:
    backgroundColor: 'transparent'
    textColor: '#3e4934'
    typography: '{typography.control}'
    rounded: '{rounded.control}'
    padding: '11px 15px'
  input-note:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.metadata}'
    rounded: '{rounded.small}'
    padding: '8px'
    width: '100%'
  navigation:
    textColor: '#5c6255'
  chip-stack:
    textColor: '#5f6853'
    rounded: '{rounded.small}'
    padding: '5px 8px'
  card-seen:
    backgroundColor: '{colors.seen-card}'
    textColor: '{colors.seen-text}'
    rounded: '{rounded.demo-card}'
    padding: '11px 12px'
  phone-shell:
    rounded: '{rounded.phone-shell}'
    padding: '7px'
    width: '304px'
---

# Design System: Augusto Gonzalez

## Overview

**Creative North Star: "The Light Engineering Studio"**

A light technical studio pairs warm paper and graphite with copper details and sage instruments. Large, closely set sans-serif headings carry the argument; italic serif phrases add a human voice. Working objects provide the visual evidence.

The same visual hierarchy serves English and Spanish. The surrounding portfolio stays restrained while each interactive phone demo retains its own scoped product palette.

**Key Characteristics:**

- Warm paper and fine dividers.
- Manrope structure with italic DM Serif Display emphasis.
- Physical phone and isometric instrument; quiet surrounding surfaces.

This is a scan of the completed replacement world, not a pre-build seed. Sources: [global styles](src/global.css), [page styles](src/App.module.css), [phone styles](src/components/Phone.module.css), [demo styles](src/demos/Demos.module.css), and [instrument styles](src/system/System.module.css). Direction: [PRODUCT.md](PRODUCT.md) and [.impeccable/surface-brief.md](.impeccable/surface-brief.md). Supplied final render evidence: [desktop](.impeccable/review/desktop.png), [mobile](.impeccable/review/mobile.png), [Spanish](.impeccable/review/spanish.png), and [machine detail](.impeccable/review/machine.png).

## Colors

### Primary

Copper marks emphasis, selected project rules, and small identity details. Graphite fills the primary action; its hover shifts toward olive. The separate focus color is an interaction token.

### Secondary

Sage provides the instrument's field. The machine's paper, top, four numbered shades, outline, and copper are a scoped material system from `System.module.css`. Active machine components also receive local warm highlights.

### Neutral

Paper is the page ground; ink carries primary text; muted supports captions; line divides sections. Seen's screen, card, and text tokens belong only to its dark demo. Luxury Presence, SteadyMD, and Pura Mente retain their local neutral, teal, and green treatments in `Demos.module.css`; these are not global accents.

**The Scoped Product Color Rule.** Keep demo palettes inside the phone; use paper, graphite, copper, and sage for the portfolio.

Frontmatter contains source values. Sidecar tonal strips are synthesized inspection aids, not additional implemented palette tokens.

## Typography

Manrope Variable is self-hosted for display, prose, and controls. DM Serif Display's italic face is imported by [main.tsx](src/main.tsx); it supplies heading emphasis. No separate mono family is used. Readouts use tabular numerals.

The frontmatter records the hero display, instrument headline, case title, introduction, body, and controls. About and contact headings use their own observed clamps in `App.module.css`; they are contextual variants rather than a mathematical scale. Emphasis inherits heading size and line height and uses italic styling. Metadata stays subordinate. The introduction is limited to 420px on desktop.

**The Phrase Emphasis Rule.** Use the italic serif for meaningful heading phrases, with sans-serif for body text and controls.

The identity wordmark uses tracking (-0.04em). Small 8–10px demo labels and footer copy are local implementation details, not a recommended body-text scale.

## Layout

The main page container is centered with maximum width (1180px). At widths up to 1280px, margins become 48px; up to 850px, 28px; up to 650px, 22px. These are actual responsive overrides, not a universal spacing scale.

The desktop hero uses two columns (1.15fr / 1fr) with a 70px gap. The case study uses two columns (1.1fr / 1fr); career uses equal columns. At 650px these become a single reading column. The project selector moves before the phone and becomes a two-column grid. Header navigation hides while the language and contact controls remain.

Hero type becomes 58px at 850px, then `clamp(55px, 12vw, 76px)` at 650px. The instrument headline becomes 39px on mobile. The sage section has a narrower content measure (1060px calculation); the machine stage has maximum width (890px). Readouts change from four columns to two; the machine inspector becomes a horizontal scrollable stage selector above its explanation.

The phone keeps its hardware proportions (304px wide, 590px screen height), narrowing to 285px at 380px. It scrolls internally rather than stretching its contents to page width.

## Elevation & Depth

The editorial page is flat, separated by one-pixel rules and tonal fields. The phone uses a metallic gradient and soft cast shadow. The instrument's depth comes from SVG surfaces, four-tone shading, bevels, and fine edges; WebGL supplies the moving request effect. The illustrated house also uses a local extrusion, not a reusable UI shadow.

**The Object Depth Rule.** Reserve dimensional treatments for physical objects and illustrations; use rules and tonal fields for editorial sections.

The exact phone shadow is recorded in the sidecar from `Phone.module.css`. No generic card-elevation scale is established.

## Shapes

Controls use modest corners; chips and note fields use the small radius. Seen cards are rounder. Circular controls, status dots, phone hardware, and the arched phone ground have distinct object-specific geometry. The machine uses constructed solids and continuous routed channels. These silhouettes do not imply pill-shaped page navigation or rounded containers for every section.

## Components

### Buttons

Primary actions use graphite, paper text, and the frontmatter's control radius and padding. Hover uses the button-hover token. Machine run and secondary controls use their scoped sage palette; disabled machine buttons reduce opacity to 0.45. Demo submit buttons use local styling and opacity 0.5 when disabled. All interactive elements inherit the global focus outline (2px, offset 5px).

The circular contact action changes background and text color over 0.2s. Source controls without a dedicated hover style keep their resting appearance; do not infer a new hover system from the sidecar.

### Navigation

The header uses quiet text links that turn copper on hover. EN/ES is a button whose current language is darker and heavier. Project buttons use `aria-pressed`, a copper bottom rule, and an arrow for selection. The machine stage list uses the same semantic pressed state with its scoped copper treatment.

### Chips / Cards

Technology chips are small outlined labels, not buttons. Case studies and career entries use open ruled layouts. Seen score cards are tonal containers inside the phone; their compact content and rounded shape are scoped to that demo.

### Inputs / Fields

Luxury Presence notes use a transparent, bordered textarea with the small radius and a visible focus outline. SteadyMD uses a bordered composer and local teal send action. Pura Mente uses native range controls with green accent colors. These are functional demo controls, not a site-wide contact form.

### Phone / Instrument

Use [Phone.tsx](src/components/Phone.tsx) for the hardware frame, scrollable viewport, Home, and Reset. Seen, Luxury Presence, SteadyMD, and Pura Mente share the frame while preserving their own demo styling.

Use [System.tsx](src/system/System.tsx) for the request → cache → adapter/provider → normalize → response instrument. Controls, status readouts, and stage descriptions accompany the drawing. A normal stage tick is 950ms; reduced motion uses 80ms and clears the WebGL flow. Paused, hidden, and offscreen states stop the effect. Global reduced-motion styles disable smooth scrolling and reduce animation/transition duration to 0.01ms. Keep the static SVG and text states usable when WebGL is unavailable.

## Do's and Don'ts

### Do:

- Do keep both English and Spanish layouts usable at the implemented mobile breakpoints.
- Do retain visible keyboard focus, text readouts, and reduced-motion behavior.
- Do use the actual phone and machine component sources when extending their appearance.

### Don't:

- Don't reintroduce decorative eyebrows above the main section headings.
- Don't turn the phone demos’ local colors or compact text sizes into general page defaults.
- Don't replace physical SVG geometry with generic floating cards or hard offset UI shadows.

Not canonized: compact demo text, incidental brand weights, and illustration-only extrusion values are not promoted to general page rules. No additional source changes were made during documentation.

## Page themes

The header sun/moon button switches between light and dark modes on both `/` and `?preview=revision`. First visits default to dark regardless of the system color scheme; explicit choices persist under `portfolio.theme.v1` and synchronize across tabs. The head bootstrap resolves theme and browser chrome before the application loads. Blocked storage leaves switching available for the current visit. Accessible labels are translated into English and Spanish.

The original light palette remains the default light variant. Its dark variant uses deep olive graphite (`#191c18`), pale ink (`#eeeee7`), muted sage (`#b4bbac`) and lighter copper (`#ed9b78`). Semantic tokens in `src/global.css` cover editorial text, rules, actions, selection, focus and the system section. Phone demos retain their scoped product palettes. The revision has its own neutral variants documented in `src/preview/DESIGN.md`.
