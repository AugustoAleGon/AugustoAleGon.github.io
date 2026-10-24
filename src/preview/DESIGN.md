---
name: 'Augusto Gonzalez — Revision preview'
description: 'Shadowland surfaces and physical engineering figures for the published portfolio.'
colors:
  {
    'black': '#000000',
    'surface': '#141414',
    'raised': '#1f1f1f',
    'control': '#2e2e2e',
    'rule': '#3b3a3a',
    'ink': '#f2f2f2',
    'dim': '#b5b5b5',
    'separator': '#303030',
    'figure': '#101010',
    'phone': '#090909',
    'action': '#eeeeee',
    'white': '#ffffff',
    'anatomy-mid': '#666666',
    'anatomy-lo': '#424242',
    'anatomy-hi': '#999999',
    'anatomy-top': '#222222',
    'anatomy-shade-3': '#1e1e1e',
    'anatomy-active-mid': '#b6b6b6',
  }
typography:
  {
    'display':
      {
        'fontFamily': 'Manrope Variable, sans-serif',
        'fontSize': 'clamp(44px, 4.5vw, 64px)',
        'fontWeight': 500,
        'lineHeight': 1.06,
        'letterSpacing': '-0.03em',
      },
    'story-display':
      {
        'fontFamily': 'Manrope Variable, sans-serif',
        'fontSize': 'clamp(34px, 4.5vw, 58px)',
        'fontWeight': 550,
        'lineHeight': 1.2,
        'letterSpacing': '-0.03em',
      },
    'headline':
      {
        'fontFamily': 'Manrope Variable, sans-serif',
        'fontSize': 'clamp(30px, 3.4vw, 44px)',
        'fontWeight': 550,
        'lineHeight': 1.2,
        'letterSpacing': '-0.03em',
      },
    'role-title':
      {
        'fontFamily': 'Manrope Variable, sans-serif',
        'fontSize': '19px',
        'fontWeight': 550,
        'lineHeight': 1.2,
        'letterSpacing': '-0.02em',
      },
    'body':
      {
        'fontFamily': 'Manrope Variable, sans-serif',
        'fontSize': '15px',
        'fontWeight': 400,
        'lineHeight': 1.65,
      },
    'prose':
      {
        'fontFamily': 'Manrope Variable, sans-serif',
        'fontSize': '14px',
        'fontWeight': 400,
        'lineHeight': 1.65,
      },
    'link':
      {
        'fontFamily': 'Manrope Variable, sans-serif',
        'fontSize': '13px',
        'fontWeight': 400,
        'lineHeight': 1.65,
      },
    'label':
      {
        'fontFamily': 'Manrope Variable, sans-serif',
        'fontSize': '12px',
        'fontWeight': 400,
        'lineHeight': 1.65,
      },
    'action':
      {
        'fontFamily': 'Manrope Variable, sans-serif',
        'fontSize': '12px',
        'fontWeight': 650,
        'lineHeight': 1.65,
      },
  }
rounded:
  {
    'small': '4px',
    'control': '6px',
    'identity': '7px',
    'action': '8px',
    'brand': '9px',
    'figure': '14px',
    'app-icon': '17px',
    'phone': '49px',
  }
spacing:
  {
    'compact': '10px',
    'inline': '14px',
    'text': '20px',
    'section-gap': '30px',
    'section-heading': '48px',
    'columns': '60px',
    'story-columns': '80px',
  }
components:
  {
    'story-link':
      {
        'backgroundColor': '{colors.raised}',
        'textColor': '{colors.ink}',
        'typography': '{typography.link}',
        'rounded': '{rounded.small}',
        'padding': '11px 12px',
      },
    'story-link-hover': { 'backgroundColor': '{colors.control}' },
    'identity-action':
      {
        'backgroundColor': '{colors.control}',
        'textColor': '{colors.ink}',
        'typography': '{typography.link}',
        'rounded': '{rounded.identity}',
        'padding': '13px 15px',
      },
    'primary-action':
      {
        'backgroundColor': '{colors.action}',
        'textColor': '{colors.surface}',
        'typography': '{typography.action}',
        'rounded': '{rounded.action}',
        'padding': '12px 15px',
        'width': '100%',
      },
    'primary-action-hover': { 'backgroundColor': '{colors.white}' },
    'step-control':
      {
        'backgroundColor': '{colors.control}',
        'textColor': '{colors.action}',
        'typography': '{typography.label}',
        'rounded': '{rounded.control}',
        'padding': '11px 14px',
      },
    'figure': { 'backgroundColor': '{colors.figure}', 'rounded': '{rounded.figure}' },
    'phone':
      {
        'backgroundColor': '{colors.phone}',
        'rounded': '{rounded.phone}',
        'padding': '9px',
        'width': '374px',
        'height': '740px',
      },
  }
---

# Design System: Augusto Gonzalez — Revision preview

## Overview

**Creative North Star: "Shadowland technical workspace"**

This document describes the published design at `/`, promoted with the user’s authorization on October 23, 2026. Existing `?preview=revision` links remain compatible. Root `DESIGN.md` and root `.impeccable/design.json` record the earlier portfolio, now available only at `?preview=legacy`; this document is the visual authority for the homepage.

The user pinned Shadowland and the supplied desk-computer reference. The preview translates those references into charcoal reading surfaces, restrained Manrope typography, authentic colored app identities, and distinct isometric instruments whose physical mechanisms explain engineering responsibilities. The direction comes from that explicit brief, not a generated comp: the launcher failed with exit 126 and the documented fallback was used. No FORM seed, QUALITY BAR card, or detector report exists.

**Key Characteristics:**

- A dark, mostly flat reading surface with fine dividers.
- A career timeline and contribution stories, with a separate phone-shaped mobile workspace.
- Physical depth concentrated in the instruments, legacy Events console and phone; brand assets retain their colors.
- English and Spanish share the same hierarchy and navigation.

Evidence: `Preview.tsx`, `Preview.module.css`, `Architecture.tsx`, `Architecture.module.css`, `signal.ts`, `content.ts`, `instruments/Instrument.tsx`, `instruments/Instrument.module.css`, `instruments/renderer.ts`, `instruments/effects.ts`, `../../scripts/instrument-scenes.mjs`, inherited `../global.css`, `../../PRODUCT.md`, and `brief.md`. Current instrument and section evidence is in `../../.impeccable/review/distinct/`; the earlier `revision-desktop-story.png` and `revision-mobile-library.png` document the preserved surrounding preview. Token primitives above are extracted from implementation, not a pre-build seed. The sidecar extends them with motion, depth, responsive metadata, and isolated component specimens; its generated tonal ramps are panel aids, not implemented surface scales.

## Colors

The page is a neutral charcoal system. The five pinned Shadowland shades appear as black recesses, the page surface, raised contribution rows, control surfaces, and rules/hover surfaces. There is no separate chromatic UI accent.

### Primary

Light ink carries titles and primary reading contrast. The pale primary action reverses this relationship, placing dark text on a light surface. White is reserved for the observed hover and active navigation states.

### Neutral

Surface and raised tones organize content without gradients. Dim text carries summaries and secondary information; separator and rule tones delineate rows. Figure and phone tones are darker object containers. Anatomy tokens shade the console’s planes and selected module. Brand colors belong to authentic assets and are not generalized into page tokens.

**The Scoped Preview Rule.** Treat these values as evidence for the revision route only until the user approves a broader change.

Project instruments extend this palette locally with graphite plane tones and a paper inspection view. Paper view changes only the drawing stage, independently of the page theme. Its warm off-white ground (`#f1f0ec`) and inverted neutral linework are component treatments in `instruments/Instrument.module.css`, separate from the page theme tokens. Existing frontmatter and sidecar values remain preserved; this extension requires no approved system-level token changes.

## Typography

**Display and Body Font:** self-hosted Manrope Variable, with sans-serif fallback. The global font face supports weights 200–800 and uses `font-display: swap`. The inherited serif font is not used as a preview heading voice.

The hierarchy is restrained and compact. Titles use balanced wrapping and negative tracking; prose uses a relaxed line height. Display, story display, headline, role title, body, prose, link, label, and action values are normative in the frontmatter. Career section headings use 31px; story readout titles use 23px. Dates and step counters use tabular numerals. The small 10–11px app hints, figure disclaimer, and footer remain secondary copy, not a general body-text standard.

Text measures vary by purpose: identity introduction 37ch, career descriptions 54ch, web descriptions 64ch, story summary 55ch, and story title 17ch. Mobile changes are specified under Layout. No uppercase eyebrow system is introduced; company, category, date, and step labels identify actual content.

**The Reading First Rule.** Keep the explanatory text and controls usable independently of the physical figure and its light trace.

## Layout

The desktop page uses horizontal padding `max(28px, calc((100vw - 1240px) / 2))`, yielding a 1240px reading container on large screens. The header is a flex row with a 102px minimum height and a bottom divider. The opening pairs a `minmax(260px, .83fr)` identity column with a `minmax(0, 1.32fr)` timeline column, separated by `clamp(70px, 9vw, 142px)`. Identity is sticky at 45px. The portrait retains its original colors, at most 330px wide, with a 1.16 aspect ratio and crop at 50% 30%.

The career spine uses a one-pixel rule, circular markers and 30px left inset. Contribution actions remain compact rows. Web sections use ruled rows with `30px 1fr 190px` columns. Web3 projects use three columns with 48px gaps. Story header and detail use `1.1fr 1fr` columns with an 80px gap. The figure pairs the drawing with a 280px readout and three equal step controls. The phone workspace uses a centered column with a 32px gap: introduction, phone, then supporting expertise and the fictional-data note. The 374px by 740px phone has an internally scrolling screen. The app library uses two columns with centered icons, labels, and 44px-high light action pills. A static graphite folded wallpaper spans the library display; contribution stories keep a solid surface.

Responsive rules are exact source breakpoints:

- At 1600px and above, the opening gap is 160px.
- At 1000px and below, the opening uses `.8fr 1.2fr` with a 55px gap; story columns use 45px gaps, the phone workspace 40px, and figure readout 240px.
- At 700px and below, page gutters become 22px and body text 14px. The header becomes 114px high with navigation on its own lower row. Identity becomes a `1fr 105px` grid with a 105×158px portrait; its headline is 39px and introduction 13px. Sticky identity is removed. Career follows after 55px with a 21px spine inset. Story title is 36px with a 19ch measure; story, learning, Web3, and section-heading columns stack. Web rows retain icon/text columns and put metadata below text.
- On the same narrow breakpoint, figure readout follows the illustration and the three steps become full-width rows. The phone fits its container up to 374px wide, remains 740px high, and uses 42px shell corners, 34px display corners, and 8px shell padding. Supporting mobile-workspace introduction and expertise copy hide; the fictional-data note stays visible. App library remains two columns.

English and Spanish use the same structural rules. Links with adjacent arrows use inline flex where appropriate, including the opening contribution link, so the arrow stays grouped with its label.

The seven project instruments use their own figure layout: a flexible drawing beside a 270px readout, three stage buttons beneath, then a two-column input/explanation workbench. At 1000px the readout narrows to 220px. At 700px the drawing, readout, stage buttons and workbench stack in reading order; native fields fit the available width and inspected payloads wrap. Figure titles use 18px type (16px on narrow screens), readout titles 24px (21px at the middle breakpoint, 23px when stacked), and explanatory text 13px. These are scoped component sizes, not replacements for the preview's type hierarchy.

## Elevation & Depth

Most page content is flat. Fine rules, tonal surfaces, and measured spacing create hierarchy. Tangible objects have soft grounding shadows and visible edge construction. The console uses shaded isometric SVG planes, fine strokes, individual physical parts, and foreground occlusion. The supplied computer reference guides that material treatment; the console is not a literal replica.

### Shadow Vocabulary

- Figure housing: `0 22px 45px #0004`.
- Console SVG: `drop-shadow(0 14px 9px #0009)`; foreground overlay removes the duplicate filter.
- Project instrument base SVG: `drop-shadow(0 12px 8px #0007)`; the separate foreground layer preserves moving-part occlusion without another shadow.
- Phone shell: `0 30px 60px #0009, inset 0 0 0 1px #777, inset 0 0 0 4px #2e2e2e, inset 0 0 0 6px #080808`.
- App icon hover: `0 8px 20px #000a`, paired with a 2px upward translation.
- Timeline markers use a six-pixel surface-colored ring to clear the spine; it is an occlusion device, not elevation.

**The Physical Depth Rule.** Use grounding shadows for tangible objects and their housings; keep ordinary editorial rows flat.

## Shapes

Small radii belong to rows and actions, larger radii to physical housings. The frontmatter records the actual 4/6/7/8/9/14/17/49px assignments, not a freely interchangeable scale. Brand images remain square with rounded corners; the phone’s black island has 20px corners. The figure is clipped to its housing. The console carries bevels, recessed surfaces, repeated fasteners, and precise geometric modules. The portrait keeps a small corner radius rather than a circular avatar crop.

## Components

### Contribution links and actions

Contribution links are raised full-width flex rows with the arrow at the opposite end and a darker-to-lighter hover change. The mobile-workspace entry is a subdued filled action; the CV download is a plain text link. The optional demo action is a full-width pale button. Architecture Next step is a compact dark control. The sidecar provides isolated specimens of these incumbent variants. Technology labels remain plain inline text. Project instruments introduce scoped native form controls described below; imported demos retain their own inputs.

Links transition color/background over 0.2s; buttons transition background/shadow over 0.2s. Preview focus is a two-pixel light outline with five-pixel offset. The skip link appears on focus; the route’s main landmark is focusable for navigation and intentionally has no extra outline. Icon-only phone toolbar links have translated accessible names. Main navigation exposes current location/page where implemented.

### Career and navigation

The timeline organizes roles as ruled articles with brand or functional work symbols, dates, contribution links and mobile entry points. Earlier experience uses native disclosure. Header navigation links into experience, mobile, React/Next.js, AI and Web3; the language button changes English/Spanish. Hash navigation moves focus to the main landmark, while scroll restoration handles section and story changes. PuraMente has a timeline link to its architecture story. Each mobile contribution page also links to its corresponding architecture story; Luxury Presence maps to Boards and SteadyMD to Events. These are browser links and buttons, not image hotspots.

### Architecture console

`Architecture.tsx` lazy-loads the preserved `ConsoleArchitecture.tsx` only for the Events story. The console behavior below belongs to that story; MCP, Boards, GraphQL, PuraMente, Boom, Seen and Superpowered use the distinct project instrument family.

Three modules depict input, processing and output. A labeled SVG carries static geometry; a screen-blended, pointer-transparent WebGL canvas adds the selected path, with an SVG foreground layer preserving occlusion. The selected module changes plane tones. When WebGL is unavailable, selected SVG signal strokes become light. The readout has polite, atomic announcements and the step buttons expose `aria-pressed`; the diagram label and caption state its conceptual role.

The light trace eases toward its target by 0.16 per frame and settles after 650ms. It updates only while visible and while the document is not hidden; resize and visibility changes refresh it. Reduced motion jumps to the target. Renderer pixel ratio is capped at 1.5, and observers, frame requests, listeners and GL resources are disposed on unmount. Module filters transition over 0.4s; reduced motion removes this and the preview’s CSS transitions/animations. There is no decorative looping ambient animation.

### Project instruments

The seven story routes under `?preview=revision` are `#story/mcp`, `#story/boards`, `#story/graphql`, `#story/puramente`, `#story/boom`, `#story/seen` and `#story/superpowered`. Each numbered Anatomy Figure has three story stages, a live state, native controls, an expandable example payload and a conceptual-model caption. Their silhouettes and mechanisms are distinct: MCP patch rack (50 audited solids), Boards printing press (44), GraphQL field loom (49), PuraMente audio deck (50), Boom game cabinet (44), Seen cache cabinet (47), and Superpowered native bridge bench (50). Geometry is defined in `scripts/instrument-scenes.mjs` and generated by `scripts/build-instruments.mjs`; each separately loaded art module has its own camera bounds within an 800×500 drawing.

MCP slides an SSO shutter and routes the optical monitor to a selected tool. Boards lowers its platen in the second stage, then raises it and feeds the note sheet in the third; an empty note blocks progress. GraphQL raises a reed across the selected field threads; checkboxes, active fields, query and response share one model. Illustrative field counts remain separate from the documented performance outcome.

PuraMente has independent narration/background faders and a mixed waveform; access and download conditions govern the local playback model. Boom changes between quiz, prediction and poll screen programs with matching controls; an empty configuration stays a draft. Seen opens cache drawers for reuse or displays provider normalization for a miss; Spoiler Shield masks the displayed score. Superpowered highlights the selected Android or iOS native module and the shared C++ core, with an Android-only Java test-harness control that bypasses the JavaScript API. Its scope is an illustrative signal, not measured playback. None of these instruments executes production services, the audio SDK, or health-data writes.

All controls have English/Spanish labels. Stage buttons expose selected state and the readout announces manual changes politely. Next step, Play/Pause tour and Reset are native buttons; changing a stage or input pauses the tour. All eight current architecture walkthroughs autoplay every four seconds while visible, including the Events console. The tour clock is independent of WebGL drawing, resize notifications and material changes, so redraws cannot postpone a step. Manual steps and input changes pause the tour; Play tour resumes it. Shared lifecycle code handles elapsed-time easing and resource cleanup; per-item movement vectors and named drivers produce different project mechanisms. Settled diagrams stop requesting frames except PuraMente and Superpowered waveforms in the unblocked third stage, while visible and with reduced motion off. Offscreen or hidden documents suspend animation and the tour timer. The observer consumes the newest entry in a visibility batch. Reduced motion disables the tour and applies selected poses immediately.

Each figure registers its SVG base, pointer-transparent WebGL surface and SVG foreground to its own camera. Moving parts are reordered by depth keys. Project-specific shaders sit on the relevant floor or wall plane: MCP routing monitor, Boards note sheet, GraphQL threads, PuraMente mixed waveforms, Boom format screen, Seen normalization display and Superpowered scope. Physical foreground pieces preserve occlusion; MCP’s right upright, roof and bezel sit above its light layer; the left upright remains depth-sorted behind the tool banks. Dark view uses screen blending; paper view uses neutral ink with normal blending. The renderer caps pixel ratio at 1.5, retains SVG fallback traces and usable controls when WebGL is unavailable or lost, restores the light after context restoration, and releases observers, timers, listeners and GL resources on unmount. `../../docs/distinct-instruments.md` records mechanisms and `../../docs/project-instruments.md` records verification and conceptual boundaries.

Inputs use dark raised surfaces, fine borders and small corners within the figure, inheriting the preview's visible focus treatment. Native dropdowns have a 44px minimum height, 42px of right padding and an arrow inset 14px from the right edge. Forced-colors mode restores native appearance and removes the custom arrow. The drawing remains descriptive rather than an image hotspot: all meaningful actions are available through controls. No shipping raster assets were introduced; the generated SVG and WebGL are the artwork, and captured PNGs are QA evidence only.

### AI and native audio evidence

The AI navigation item leads to four bilingual editorial rows: the ContextForge MCP gateway, Datadog-to-Linear/PR automation, the OpenAI-powered Notes chatbot, and an explicitly academic FastAPI NLP service. They reuse the existing ruled web-section layout rather than introducing another visual system. Learning interests remain separate from documented applied work. A dedicated native-audio entry and an Earlier experience timeline link open the Thumbjive/Jiveworld Superpowered story. Historical Java/JNI/NDK and Objective-C terminology is preserved; no JSI/TurboModule or measured-speedup claim is added.

### Phone workspace and authentic identity

The phone is a framed local portfolio workspace, not a native app or real operating-system home screen. Home, Back, and Exit remain available. App selection opens contribution copy before an optional demo. The four mapped assets in `content.ts` are `public/brands/seen.jpg`, `luxury-presence.jpg`, `steadymd.png`, and `pura-mente.jpg`; provenance is retained in `public/brands/sources.json`. Seen, Luxury Presence and Pura Mente use store art. SteadyMD uses its official corporate mark; the renamed Lemonaid store listing is not presented as a verified historical SteadyMD icon. Brand images use empty alt text beside visible names to avoid duplicate announcements.

Timeline brand images are 40px square; library and app-story images are 72px square. Functional actions use the existing inline stroked SVG icon system (24-unit viewBox, 1.6 stroke) and local technical marks (1.5 stroke), never text glyph substitutes. The professional portrait is `public/images/augusto-gonzalez.jpeg`. Colored icons and the portrait retain their original colors. LinkedIn and GitHub profile links appear below the introduction actions and in the shared footer, with external-link icons and translated navigation labels.

Imported demos retain their own existing surfaces, including the light phone demo wrapper and its dark focus outline. Those are a scoped compatibility boundary, not a new pale theme for this preview. Demos use fictional local data.

## Do's and Don'ts

### Do:

- Do keep the published homepage as the default and preserve existing preview links.
- Do use the provided portrait and verified brand assets with their established identity.
- Do keep the contribution story before its optional fictional-data demo.
- Do preserve visible focus, semantic controls, translated names, static signal fallback, and reduced-motion behavior.
- Do keep conceptual architecture separate from claims about production infrastructure.

### Don't:

- Don't apply the legacy root design tokens to the published homepage.
- Don't substitute letter avatars, emoji, or invented company marks for the verified brand assets.
- Don't turn the reference’s surrounding social/video interface into portfolio decoration.
- Don't generalize the inherited light demo surfaces into the preview’s page palette.
- Don't invent a FORM seed, quality card, detector result, or user approval.

Not canonized or repaired: root documentation belongs to the original light site; inherited demo styling is intentionally outside this preview’s general tokens. Publication was explicitly authorized on October 23, 2026. No new implementation defect is legitimized as a design rule by this documentation pass.

## Light and dark page modes

The shared header sun/moon control now supports both modes. The dark variant preserves Shadowland; the light variant uses neutral off-white (`#f5f5f3`), charcoal ink (`#202020`), gray secondary text (`#595959`), and subdued raised surfaces (`#eaeae7`). Layout, portrait, brand assets and content remain the same. Theme tokens live on `html.revision-preview[data-theme]` in `src/global.css` so the loading/error surface and browser background match before the lazy preview loads.

Contribution rows, architecture controls, fields and readouts follow the page theme. Project drawings initially follow the page theme; Paper view remains an independent material override for the current drawing. The legacy Events console remains a graphite object, and the phone workspace and playable demos retain their scoped palettes. Keyboard focus uses the current foreground color, with native controls inheriting the relevant color scheme.

Both routes share the saved preference, dark default, translated control labels and pre-paint initialization described in the root design document. The revised design is now the default at `/`; the earlier design requires `?preview=legacy`.

## Pointer-driven water surface

The user-approved background interaction is a soft liquid wake, shared by every current portfolio route. `wake/PointerWake.tsx` owns a decorative, pointer-transparent canvas inside the isolated page stacking context. Its negative layer sits above the page background and below content, preserving sticky layout, focus indicators and solid object surfaces.

`wake/simulation.ts` evolves a damped height field at fixed 60 Hz. Movement deposits a continuous, speed-sensitive disturbance; overlapping waves share the same surface. `wake/renderer.ts` shades the slope as neutral silver relief in dark mode and graphite relief in light mode. Alpha is capped at 0.13; theme changes update the shader without remounting the page. The field's longest edge is at most 192 cells, and the drawing buffer's longest edge is at most 1600 pixels with no high-DPI multiplier. There are no new runtime dependencies.

The surface becomes still within 2.2 seconds of the last movement and then stops requesting frames. Scroll, navigation, resize, blur and document visibility changes clear the wake. Touch/coarse pointers, reduced-motion preferences and printing retain the plain background. Reduced-motion changes take effect during the session. Missing WebGL or shader setup failure leaves all content usable; context loss hides the canvas and restoration rebuilds its resources. Cleanup releases listeners, observers, animation frames and GPU resources. Existing architecture animations remain independently controlled.

This interaction supersedes the earlier prohibition on page backdrop effects only for the requested liquid surface. It adds no autonomous motion, color accents or distortion to foreground content. Tests cover settling, idle rendering, both themes, navigation, reduced motion, touch fallback and WebGL availability/recovery.
