# Revision preview verification

Verified locally on 2026-10-22. Scope: `?preview=revision`, with the previous site preserved at `/`. This is the layout review stage, not publication or approval of a complete replacement.

- `pnpm check`: Oxlint, TypeScript, three model tests, both geometry audits, and production build pass.
- `pnpm test:e2e`: 18 cases pass on desktop Chrome and Chromium with iPhone 13 emulation. Six cases cover the revision: timeline/story/history navigation, story-first mobile navigation and demo reset, Spanish, reduced motion, and no-WebGL fallback.
- `pnpm format:check` and `git diff --check`: pass.
- Ten rendered view checks: desktop and mobile opening, engineering story, app library, Seen contribution, and Spanish engineering story. No horizontal overflow, browser page errors, or Axe violations were found.
- Anatomy access console: 59 solids, 157 tested overlaps, no geometry audit problems. Rendered line-end check: 40 lines, 40 ends, no problems. A detail capture was inspected at approximately four times the displayed figure width.
- WebGL uses the SVG camera and deck plane. The static channel fallback remains visible without WebGL. Rendering stops after a short transition, offscreen, and when the tab is hidden. Reduced motion draws the selected state without animation.

Evidence is under `.impeccable/review/revision-*` (local, ignored). The fresh independent review is recorded in `revision-review.md` there. The visual brief is `src/preview/brief.md`.

The independent reviewer returned `ship` on the focused fixes: documented launcher fallback, immediate mobile contribution access, and the desktop link wrapping correction. This disposition covers those scored fixes in the preview; it is not user approval or a new whole-surface review. After the last CSS correction, the production build and six revision browser cases passed again, and all ten capture checks remained clean.

Limitations: the console is a conceptual explanation, not a deployment topology. The detailed CDC incident is not established by the reviewed sources. Mobile demos are existing local recreations with fictional data. Native devices and Safari were not tested in this pass. No deployment, push, or commit was performed.
