# Project instruments

Seven Anatomy Figures extend `?preview=revision`, preserving its Shadowland surfaces, typography and native controls. Each figure has its own physical mechanism and optical display. The three stages in each story remain the source of contribution facts; interactive inputs, signals and counts are illustrative local models, never production telemetry. [Distinct architecture figures](distinct-instruments.md) records the current geometry and mechanisms.

## Current implementation — October 23

`Architecture.tsx` dispatches `#story/mcp`, `#story/boards`, `#story/graphql`, `#story/puramente`, `#story/boom`, `#story/seen` and `#story/superpowered` to the instrument family. Only `#story/events` retains the lazy-loaded legacy `ConsoleArchitecture.tsx`. Separately loaded generated art modules contain 50 MCP, 44 Boards, 49 GraphQL, 50 PuraMente, 44 Boom, 47 Seen and 50 Superpowered solids.

`scripts/instrument-scenes.mjs` defines different bounds, silhouettes, movement vectors and optical planes. `scripts/build-instruments.mjs` fits each camera to an 800×500 view and audits 21 mechanism positions per scene. Moving SVG items use named drivers and depth keys. SVG base, WebGL surface and SVG foreground share the scene camera; physical foreground elements occlude light and moving parts. MCP's right rack upright, roof and monitor bezel remain above the optical layer; the left upright stays depth-sorted behind the tool banks.

Shared renderer code manages easing, visibility, cleanup and the optional 6.5-second stage tour. It does not impose a common traveling carriage or shader. Manual stage/input changes pause the tour. Settled scenes stop requesting animation frames except the PuraMente and Superpowered waveforms in their visible, unblocked third stage with reduced motion off. Hidden documents and offscreen figures suspend rendering and the tour; the newest IntersectionObserver entry handles rapid leave/re-entry. Reduced motion applies selected poses immediately and disables tour playback.

WebGL loss/restoration, scene-specific SVG fallback and usable controls apply across all seven figures. Dark and paper modes change only the drawing stage. Native dropdowns preserve 42px of right padding for an arrow inset 14px from the edge, a 44px minimum height and native appearance in forced-colors mode. English/Spanish labels, selected-state semantics and polite readouts remain shared.

## Content and entry points

PuraMente has a timeline link and architecture story. Mobile contribution pages link to their corresponding stories, including Luxury Presence → Boards and SteadyMD → Events. A dedicated native-audio entry and Earlier experience link open Superpowered. Its 2018 Thumbjive/Jiveworld engagement uses Java/JNI/Android NDK and Objective-C over a shared C++ core. The standalone Java Android harness compares the same JNI layer with a React Native demo; the portfolio executes neither the SDK nor a benchmark and claims no measured speedup or exact shipped binary.

The AI header link opens four bilingual rows: the internal ContextForge MCP gateway, Datadog alerts becoming Linear tickets and pull requests, the OpenAI-powered Notes chatbot, and an explicitly academic FastAPI NLP service. Applied work and academic work remain distinct from learning interests. [Content evidence](content-evidence.md) records CV experience-bank entries 1, 2, 22 and 45 and the limits of those claims.

## Verification

The implementation handoff reports `pnpm check` passing with nine unit tests and nine geometry audits (two legacy scenes and seven instruments), plus all 54 browser tests. Current evidence is in `.impeccable/review/distinct/`: `browser-report.json` covers seven figures at 1440px and 390px with active WebGL, no errors and no overflow; `line-report.json` contains 42 scene/stage/theme checks with zero reported problems. `shader-report.json` records visible ink and zero boundary alpha for all seven effects, plus a monotonically decreasing MCP paper-view fade. These alpha checks concern optical boundaries; physical occlusion is also reviewed in screenshots and the foreground implementation.

Captures include the seven figures in both viewport widths, dark/paper details, mechanism transitions, selected control states, AI, native audio and header navigation. The full review is recorded in `.impeccable/review/distinct/finish-review.md`. The follow-up `.impeccable/review/distinct/finish-verdict.md` scores both findings resolved with disposition `ship`; that verdict covers the two fixes, not a new whole-surface review.

## Superseded extension evidence

The initial six-figure extension used related deck/rail/carriage compositions and a shared transport-light treatment. The user rejected that repetition. Its geometry and parts counts are obsolete; the current seven scenes above replace them. Earlier `.impeccable/review/extension/` evidence remains historical: 46 browser tests, eight geometry audits, 36 line checks and an independent `SHIP` at that earlier scope. None establishes acceptance of the current revision.

The earlier reported MCP failure was a discontinued localhost:5175 server; localhost:5174 was verified during that session. Those addresses are historical observations, not a guarantee that a development server is currently running.

This remains an ordinary extension of the review preview. Root design documents, token sidecars and shipping raster assets are preserved; no root-site replacement or deployment is authorized. The Impeccable launcher remained unavailable with permission denied, and no detector, generated comp or quality-bar artifact is claimed.
