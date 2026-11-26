# Route DJ frontend implementation plan

## Plan purpose

This plan turns the reference composition and Route DJ north star into a frontend-only, behaviorally complete Next.js prototype. The UI consumes application state through a `MusicEngine` contract; only the mock implementation knows fixture details. All delays and failures remain local, deterministic, and configurable.

Status values: `Not started`, `In progress`, `Complete`, `Blocked`.

## Slice 1 — Foundation and visual shell

### UI-001 — Establish repository and quality tooling

- **Objective:** Configure Next.js App Router, strict TypeScript, Tailwind CSS, ESLint, Prettier, Vitest, and React Testing Library with npm scripts.
- **Files expected to change:** `package.json`, lockfile, `tsconfig.json`, Next/PostCSS/ESLint/Prettier/Vitest configuration, test setup.
- **Dependencies:** None.
- **Implementation notes:** Use stable compatible packages; keep scripts explicit for dev, build, lint, typecheck, test, and formatting.
- **Acceptance criteria:** The app boots; strict TypeScript is enabled; every required command exists.
- **Validation method:** Install dependencies, inspect resolved versions, run all scripts.
- **Status:** Complete.

### UI-002 — Establish the agent knowledge base

- **Objective:** Create the required canonical documentation structure before application code.
- **Files expected to change:** `AGENTS.md`, `CLAUDE.md`, all files under `agentsKnowledgeContextBase/`.
- **Dependencies:** Repository inspection and reference-image review.
- **Implementation notes:** Preserve the supplied north star; keep entry points concise; record the prompt and audit conventions.
- **Acceptance criteria:** All required files exist at the exact paths and the catalog links resolve.
- **Validation method:** File-tree and link review.
- **Status:** Complete.

### UI-003 — Define design system, domain model, and mock fixtures

- **Objective:** Establish visual tokens, typography, domain types, at least 16 fictional tracks, recommendation metadata, and centralized positions/delays.
- **Files expected to change:** `app/globals.css`, `lib/music-engine/types.ts`, `lib/route-dj/constants.ts`, `lib/route-dj/positioning.ts`, `data/mockTracks.ts`, `data/mockSession.ts`.
- **Dependencies:** UI-001, UI-002.
- **Implementation notes:** Use CSS/SVG artwork rather than copyrighted assets; expose no fixture internals to UI components.
- **Acceptance criteria:** Types cover every required domain entity; fixtures are deterministic and visually distinct; all magic layout/delay values are named.
- **Validation method:** Typecheck and fixture-focused tests.
- **Status:** Complete.

### UI-004 — Build the static reference-inspired shell

- **Objective:** Recreate branding, route strip, central constellation, center/candidate cards A–H, axes, connectors, guide, wildcard, add-next affordance, and player shell.
- **Files expected to change:** `app/layout.tsx`, `app/page.tsx`, components under `components/route-dj/`.
- **Dependencies:** UI-003.
- **Implementation notes:** Match the reference hierarchy and whitespace; use responsive card sizes and local abstract artwork.
- **Acceptance criteria:** Desktop closely resembles the reference hierarchy; no prominent control is visually dead; the constellation remains legible.
- **Validation method:** Browser inspection at desktop and laptop widths.
- **Status:** Complete.

### UI-005 — Add responsive layout foundation

- **Objective:** Provide desktop constellation, laptop compression, tablet scrolling/panning, and considered mobile recommendation browsing.
- **Files expected to change:** Route DJ components and `app/globals.css`.
- **Dependencies:** UI-004.
- **Implementation notes:** Mobile uses a scroll-snap candidate rail with persistent directional meaning rather than shrinking the full constellation.
- **Acceptance criteria:** No accidental viewport overflow; current song, queue, recommendations, and player remain reachable at all target widths.
- **Validation method:** Inspect 1440, 1024, 768, and 390 pixel viewports.
- **Status:** Complete.

## Slice 2 — Product behavior

### UI-006 — Implement the engine boundary and centralized state

- **Objective:** Add the `MusicEngine` interface, deterministic `MockMusicEngine`, reducer, selectors, provider/controller, async status handling, and controlled failures.
- **Files expected to change:** `lib/music-engine/MusicEngine.ts`, `lib/music-engine/MockMusicEngine.ts`, `lib/route-dj/reducer.ts`, `lib/route-dj/selectors.ts`, `components/route-dj/RouteDJApp.tsx`.
- **Dependencies:** UI-003.
- **Implementation notes:** UI imports the contract/controller, never fixture internals; reducer transitions stay pure and testable.
- **Acceptance criteria:** Initial session loads asynchronously; all required engine methods exist; loading, preparation, error, disabled, and empty states are representable.
- **Validation method:** Unit tests, typecheck, simulated failure review.
- **Status:** Complete.

### UI-007 — Implement recommendation selection, queueing, wildcard, and route management

- **Objective:** Support hover/focus emphasis, keyboard navigation, candidate selection, queue-next, duplicate prevention, deterministic wildcard, queue removal/reordering, and route advancement/recentering.
- **Files expected to change:** Recommendation, route-strip, wildcard, toast, state, engine, and selector files.
- **Dependencies:** UI-006.
- **Implementation notes:** Selection never advances immediately; queue insertion and promotion use calm motion; unavailable candidates remain understandable.
- **Acceptance criteria:** All actions produce predictable state, feedback, and accessible focus/selection semantics.
- **Validation method:** Interaction tests and browser keyboard pass.
- **Status:** Complete.

### UI-008 — Implement Add Next search

- **Objective:** Add a lightweight overlay/drawer for searching mock tracks, selecting one, adding it to the queue, closing it, and showing empty results.
- **Files expected to change:** `AddNextPanel.tsx`, engine search, app controller, tests.
- **Dependencies:** UI-006.
- **Implementation notes:** Escape closes; focus enters and returns from the overlay; queued/current tracks are disabled.
- **Acceptance criteria:** Search is deterministic, empty state is explicit, queue insertion works, and duplicates are prevented.
- **Validation method:** React Testing Library interaction tests and keyboard inspection.
- **Status:** Complete.

### UI-009 — Implement simulated player and route controls

- **Objective:** Add play/pause, previous/next, progress timer, seeking, volume, time labels, key, energy, route mode, automatic advancement, export, reset, debug states, and keyboard-help menu.
- **Files expected to change:** `PlayerBar.tsx`, header/menu components, engine, app controller, export utility, tests.
- **Dependencies:** UI-006, UI-007.
- **Implementation notes:** No audio files; timer is UI simulation; export is local JSON; previous returns to recent history without external persistence.
- **Acceptance criteria:** Primary controls work; end-of-track promotes queue head and loads a new recommendation set; JSON export has the specified shape.
- **Validation method:** Fake-timer tests, export serialization test, browser interaction pass.
- **Status:** Complete.

### UI-010 — Add meaningful spatial motion

- **Objective:** Add staged entrance, hover lift, connector emphasis, queue insertion, current-track promotion, recentering, constrained canvas drag/pan, return-to-center, and loading transitions.
- **Files expected to change:** canvas, card, route-strip, and app components plus global reduced-motion styles.
- **Dependencies:** UI-004, UI-007.
- **Implementation notes:** Framer Motion handles stateful movement; panning is constrained and resettable; reduced motion removes nonessential transitions.
- **Acceptance criteria:** Motion clarifies hierarchy and state without blocking controls or causing nausea.
- **Validation method:** Browser motion and reduced-motion inspection.
- **Status:** Complete.

## Slice 3 — Refinement and validation

### UI-011 — Accessibility and responsive refinement

- **Objective:** Complete semantics, focus management, visible focus, ARIA state, color-plus-text indicators, keyboard shortcuts, reduced-motion support, and responsive detail.
- **Files expected to change:** all interactive components, global styles, README.
- **Dependencies:** Slice 2 complete.
- **Implementation notes:** Arrow keys navigate candidates; Space toggles playback outside inputs; Q queues selection; Escape closes overlays; `?` reveals help.
- **Acceptance criteria:** Every action works without hover; overlays manage focus; contrast is legible; no unintended overflow at target widths.
- **Validation method:** Keyboard-only pass, accessibility-role tests, multi-viewport inspection.
- **Status:** Complete.

### UI-012 — Add focused behavior and state tests

- **Objective:** Cover initial render, selection, queueing, duplicate prevention, wildcard, playback, advancement, Add Next, reset, export, and reducer transitions.
- **Files expected to change:** files under `tests/`, Vitest setup/configuration.
- **Dependencies:** Slice 2 complete.
- **Implementation notes:** Test meaningful behavior and pure transitions; avoid brittle pixel assertions.
- **Acceptance criteria:** Required flows are covered and deterministic.
- **Validation method:** `npm run test`.
- **Status:** Complete.

### UI-013 — Validate and correct production quality

- **Objective:** Resolve lint, type, test, build, console, hydration, overflow, and interaction defects.
- **Files expected to change:** Any affected source/configuration files.
- **Dependencies:** UI-011, UI-012.
- **Implementation notes:** Validate in production mode where relevant and inspect at 1440, 1024, 768, and 390 widths.
- **Acceptance criteria:** All required commands pass; no obvious runtime, hydration, overflow, or dead-control issues remain.
- **Validation method:** `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, browser console and screenshots.
- **Status:** Complete.

### UI-014 — Complete documentation and initial audit

- **Objective:** Bring README, state, changelog, plan, and formal frontend audit in line with the completed implementation.
- **Files expected to change:** `README.md`, `ProjectState.md`, `Changelog.md`, `ImplementationPlan.md`, `Audits/InitialFrontendAudit.md`.
- **Dependencies:** UI-013.
- **Implementation notes:** Report limitations honestly and retain intentionally deferred backend work.
- **Acceptance criteria:** Statuses are factual, validation is recorded, and audit findings have severity and disposition.
- **Validation method:** Documentation review and relative-link check.
- **Status:** Complete.

---

# Phase 2 — Engine (planned 2026-11-26)

Architecture is fixed by [ArchitectureDecisions.md](./ArchitectureDecisions.md) (D1–D12). Task IDs use the `ENG-` prefix. Ordering follows D12: ingest, then a thin audible tracer bullet, then the reel benchmark, then clever moves.

## M0 — Engine foundation and light analysis

### ENG-001 — Scaffold `engine/`

- **Objective:** Create a `uv` project (Python 3.11, lockfile) runnable in WSL2, with a CLI entry point (`rdj`), config for the library and store roots, lint/format/test tooling, and a README for WSL setup (ffmpeg, rubberband).
- **Dependencies:** None.
- **Acceptance criteria:** `uv run rdj --help` works in WSL2; tests run; the store root is configurable and gitignored.
- **Status:** Not started.

### ENG-002 — Ingest and track identity

- **Objective:** Read `songs/manifest.csv` plus ID3 `WOAS` tags, dedupe by Spotify ID, register audio sources, compute content hashes, and tag MVP membership (D8).
- **Dependencies:** ENG-001.
- **Acceptance criteria:** 2,384 unique track IDs; MVP set flagged; music-video sources flagged; rerunning is idempotent.
- **Status:** Not started.

### ENG-003 — Analyzer framework and store

- **Objective:** Implement the per-track folder store, the versioned analyzer stamp, stale detection and refresh, the `overrides.json` precedence rule, and a rebuildable SQLite + sqlite-vec index (D10).
- **Dependencies:** ENG-002.
- **Acceptance criteria:** Bumping an analyzer version re-runs only that analyzer; overrides survive re-analysis; the index rebuilds from JSON alone.
- **Status:** Not started.

### ENG-004 — Light-tier analyzers

- **Objective:** Beats/downbeats (beat_this or equivalent), BPM, key (essentia), loudness (LUFS), structure segmentation, energy features, and style embeddings (Essentia Discogs-EffNet).
- **Dependencies:** ENG-003.
- **Acceptance criteria:** Runs on the MVP set locally; a spot check of 20 tracks shows plausible BPM, key, and downbeats.
- **Status:** Not started.

## M1 — Tracer bullet (D12)

### ENG-005 — Plan schema, primitives, and `echo_out` / `cut`

- **Objective:** Define the plan JSON schema (moves expanding into primitive automation, D6), implement the `echo_out` and `cut` templates, and build a phrase-aligned exit/entry point enumerator with rule scoring.
- **Dependencies:** ENG-004.
- **Acceptance criteria:** `rdj plan A B` emits valid ranked plans with templated explanations.
- **Status:** Not started.

### ENG-006 — Segment renderer

- **Objective:** Render the transition segment from a plan (pedalboard FX, Rubber Band stretch with a ramp back to native tempo, loudness matching), and emit the stitch points for A and B.
- **Dependencies:** ENG-005.
- **Acceptance criteria:** `rdj mix A B` writes a segment plus a preview WAV of the full A tail → segment → B head with no clicks or level jumps.
- **Status:** Not started.

### ENG-007 — Minimal API and `ApiMusicEngine`

- **Objective:** Build a FastAPI service exposing just enough of the `MusicEngine` contract to load a session, plan the next track, and serve the audio and segment. Add a frontend `ApiMusicEngine` and real Web Audio gapless playback behind a flag.
- **Dependencies:** ENG-006, the existing UI-006 contract.
- **Acceptance criteria:** One real pair plays end-to-end in the existing UI with an audible `echo_out` transition; mock mode still works.
- **Status:** Not started.

## M2 — Reel benchmark (D3, D7)

### ENG-008 — Reel identification and review

- **Objective:** Caption parsing plus stem-based tempo-invariant matching proposes reel → track matches, a small review UI captures confirmations, and the missing-songs list is exported.
- **Dependencies:** ENG-004, plus stems for the reels (short enough to separate locally).
- **Status:** Not started.

### ENG-009 — Recipe extraction and benchmark harness

- **Objective:** Align confirmed reels against library tracks, emit recipes in the plan schema, and build a recreation benchmark (planner vs. recipe) plus the per-stem residual coverage metric (D6).
- **Dependencies:** ENG-008, ENG-006.
- **Status:** Not started.

## M3 — Heavy tier and signature moves

### ENG-010 — Portable heavy-tier batch job

- **Objective:** Make the heavy tier a resumable batch command (`rdj analyze --tier heavy`) that runs on the collaborator's RTX 4060 laptop under WSL2 + CUDA (cloud container as fallback). It produces Demucs stems and WhisperX word-timestamped lyrics for the MVP set as separate sequential passes, then exports `library/` artifacts that merge back into the main store.
- **Acceptance criteria:** A 10-track benchmark run reports per-track time and VRAM peak; the job resumes after interruption; merged outputs pass stale checks on the main machine.
- **Status:** Not started.

### ENG-011 — Lyric/phoneme index and `wordplay_cut` / `toneplay_cut`

- **Objective:** Build a word and rhyme index plus vocal pitch analysis; implement both templates; measure them on the benchmark.
- **Status:** Not started.

## M4 — Product wiring

### ENG-012 — Lenses, presets, and the plan-gated compass

- **Objective:** Implement the lens interface, the Move-first and Time Machine presets, retrieval, light-tier plan estimates, octant placement, diversity rules, and the mashability pair table (D11).
- **Status:** Not started.

### ENG-013 — Feedback capture

- **Objective:** Persist thumbs up/down, skips, and selections against the plans that produced them, as the long-term reward signal.
- **Status:** Not started.

## M5 — Mashups and learning

### ENG-014 — `blend` + `loop_extend`, then `vocal_over`

- **Status:** Not started.

### ENG-015 — Ranker v1

- **Objective:** Train a small ranker on recipe positives, near-miss negatives, and feedback; it must beat the rule scorer on the benchmark to replace it.
- **Status:** Not started.

### ENG-016 — LLM judge experiment (D4)

- **Objective:** Local Qwen/Llama or the Groq free tier reranks the top-K plans; it ships only if it beats ENG-015 on the benchmark.
- **Status:** Not started.
