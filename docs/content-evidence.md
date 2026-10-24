# Content evidence

Reviewed for this implementation on 2026-10-22.

| Portfolio claim                                                            | Evidence and boundary                                                                                                                                                                                            |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Senior full-stack engineer with deep React Native experience               | Supplied CV variants and experience notes in `cv_augusto`.                                                                                                                                                       |
| Luxury Presence mobile architecture, Boards/Notes, mentoring, GraphQL work | CV and experience notes. The demo illustrates a board, saved notes, and sharing state; it is not the production interface.                                                                                       |
| SteadyMD messaging, offline storage, WebSockets, backend reporting         | CV and experience notes. The cumulative messaging figure refers to the system, not individual users. Demo messages are fictional and are never sent.                                                             |
| Pura Mente playback, offline audio, HealthKit, and web tooling             | CV and experience notes. Portfolio audio is an original local sample with no narration or medical claims.                                                                                                        |
| Seen mobile and backend ownership                                          | User statement plus read-only review of `theseen-app` and `sport-api`. No private source, environment files, API keys, or production data were copied.                                                           |
| Seen scores, league browsing, personalized feeds, Spoiler Shield           | Mobile source and public [Seen website](https://theseen.app/) / [App Store listing](https://apps.apple.com/us/app/seen-womens-sports-scores/id6776036448). Team names and scores in the portfolio are synthetic. |
| Seen provider adapters and caching                                         | Backend source: Cloudflare Worker routing, adapter boundary, short-lived memory/Cache API storage, longer-lived KV storage. The machine collapses these cache tiers into one explanatory component.              |
| Seen identity and notifications                                            | Supabase account/follow data; per-league Durable Objects and OneSignal notification delivery. These are supporting paths, not mandatory stages of every score request.                                           |

The machine is a conceptual model. Its durations, number of visible parts, paths, and request counters are illustrative. It does not measure live traffic or latency. A cache hit bypasses the adapter and normalization stages; explicit expiry clears the local simulated cache.

Public product pages were used to confirm identity and store destinations. They do not establish individual authorship. Employment and contribution claims rely on the supplied CV and user statements.

The copied CV PDFs preserve the originals, including any older links. The [store audit](store-links.md) records their current destinations and availability separately.

## AI and native audio additions — October 23, 2026

Source reviewed: supplied `experience-bank.md` notes, entries 1, 2, 22 and 45, plus the existing MCP evidence. The CV files were not modified.

- **Thumbjive / Jiveworld, September–October 2018:** freelance Superpowered C++ integration with a shared JavaScript playback API, Java/JNI and Android NDK on Android, Objective-C on iOS. A standalone Java Android app and React Native demo exercised the same JNI layer for comparison. The work fed into Lupa, whose public launch followed in 2019; do not claim the exact binary shipped, invent measured gains, or replace the historical bridge with JSI/TurboModules.
- **Applied AI:** internal ContextForge MCP gateway at Luxury Presence; Datadog alerts becoming Linear tickets and PRs for straightforward fixes; an OpenAI-powered Notes chatbot for saved searches and new contacts. Do not infer automatic merging/deployment, a specific model, function-calling implementation or formal evaluations.
- **Academic NLP project:** FastAPI serves a trained NLP model over REST. Raw text enters and predictions return over HTTP. Dates, NLP task, architecture, dataset and ML library remain unconfirmed, so the site omits them.
- The Superpowered diagram's waveform and all sample paths are conceptual. The browser does not execute the SDK or run a playback benchmark.

## SteadyMD chat demo — October 24, 2026

Reviewed the supplied local `Rocket.Chat.ReactNative` fork at `6072595b`. Its authenticated route opens a role-aware rooms list (`app/_layout.tsx`); active Expo routes wrap `legacy/views/RoomsListView`. Patient channels display previews, timestamps and unread counts. `legacy/containers/message/Message.js` renders sender-labelled message rows, and `legacy/containers/MessageBox` provides a multiline composer.

The portfolio demo opens directly into a fictional Care team conversation so visitors can try messaging immediately. All chats opens the two-room patient example; drafts and messages remain room-specific only while the demo is mounted. Offline queuing is an explicit local simulation, not a production connection. Sending never generates a clinician response. The current reference header says Lemonaid; the portfolio retains SteadyMD as the historical contribution identity, not a pixel-perfect reconstruction of current branding. No private source or patient data was copied.
