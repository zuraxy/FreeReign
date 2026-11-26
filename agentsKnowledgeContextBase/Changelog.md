# Changelog

All notable changes are recorded by milestone and logical implementation slice. Commit hashes are intentionally omitted.

## 0.1.0-foundation — 2026-07-26

### Logical commit: chore: establish project foundation and agent knowledge base

#### Added

- Canonical agent knowledge-base structure and operational root entry points.
- Stable Route DJ product north star in the required location.
- Three-slice implementation plan with task-level acceptance criteria.
- Audit and prompt-retention conventions.

#### Changed

- Project status now identifies the frontend-only prototype as the active phase.

#### Fixed

- Corrected the knowledge-base directory name to the required `agentsKnowledgeContextBase`.

#### Validation performed

- Verified repository contents and reviewed the supplied visual reference.
- Confirmed required knowledge files and reading-order links.

## 0.2.0-interface — 2026-07-26

### Logical commit: feat: implement Route DJ visual interface

#### Added

- Responsive Next.js App Router experience with branding, route strip, spatial recommendation constellation, current/candidate cards, axes, guide, wildcard, and persistent player.
- CSS design tokens for warm surfaces, borders, type, directional colors, compatibility scale, shadows, spacing, radii, and motion.
- Eighteen fictional tracks with locally rendered abstract artwork.
- Desktop, laptop, tablet, and mobile layout foundations.

#### Changed

- Replaced the empty repository shell with a product-specific music-navigation interface.

#### Fixed

- Pinned TypeScript 6.0.3 and ESLint 9.x after identifying incompatibility in the newest major releases.

#### Validation performed

- Strict typecheck passed.
- ESLint passed.

## 0.3.0-behavior — 2026-07-26

### Logical commit: feat: add interactive mock music journey

#### Added

- Typed `MusicEngine` interface and replaceable deterministic `MockMusicEngine`.
- Centralized reducer state for sessions, candidates, queue, playback, transition preparation, feedback, errors, and debug state.
- Candidate selection and relationship explanation, duplicate-safe queueing, route removal/reordering, wildcard selection, Add Next search, player simulation, advancement/recentering, reset, keyboard help, and JSON export.
- Loading, empty, controlled failure, preparation, ready, disabled, and confirmation states.
- Calm Framer Motion entrance, selection, queue, promotion, connector, and pan/recenter behavior with reduced-motion support.

#### Changed

- Route updates now flow through the engine boundary rather than fixture imports in UI components.

#### Fixed

- Distinguished the centered current-track accessible name from the route-strip current item.

#### Validation performed

- Strict typecheck passed.
- ESLint passed.
- Vitest passed: 15 tests across 4 files.

## 0.4.0-validation — 2026-07-26

### Logical commit: test: validate and refine Route DJ prototype

#### Added

- Focused tests for initial session, candidate selection, queueing, duplicate prevention, wildcard selection, play/pause, route advancement, Add Next search and empty state, reset, export, and reducer transitions.
- Initial formal frontend audit with categorized severity and disposition.
- Complete README with scope, setup, commands, architecture, keyboard controls, documentation system, limitations, deferred work, and next phase.

#### Changed

- Refined candidate prominence so the initial canvas preserves the reference’s cardinal/diagonal hierarchy.
- Tightened laptop/tablet axis placement, player density, and route-strip scrolling.
- Adapted mobile header placement, default-collapsed routing guide, player grid, scroll padding, and overflow behavior.
- Improved modal focus entry/return, keyboard queueing, mock failure feedback, search race handling, and no-queue playback completion.

#### Fixed

- Removed desktop route-strip scrollbar chrome while retaining horizontal access.
- Removed accidental mobile page overflow.
- Prevented the mobile guide from covering the central artwork on initial load.
- Prevented a completed unqueued track from repeatedly attempting advancement.

#### Validation performed

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test`: passed, 15 tests across 4 files.
- `npm run build`: passed with static prerendering.
- Production browser console: no warnings or errors on cold load.
- Rendered inspection completed at 1440, 1024, 768, and 390 pixel widths.
- Candidate selection, queue insertion, transition preparation, and route promotion verified in the browser.

## 0.5.0-engine-architecture — 2026-11-26

### Logical commit: docs: record engine architecture decisions

#### Added

- `ArchitectureDecisions.md` with twelve engine decisions: two-tier analysis, reels as recipes, algorithmic planner with a benchmark-gated optional LLM, Python segment renderer, primitive and move vocabulary, hybrid reel ID, the ~900-track MVP scope, WSL2 runtime, track store, lens-based Move-first compass, and tracer-bullet-first ordering.
- Phase 2 engine milestones (ENG-001 to ENG-016) in `ImplementationPlan.md`.

#### Changed

- `ProjectState.md` next step now points to engine milestone M0.
- Catalog reading order includes the decision log.
- `.gitignore` excludes `songs/` and the future `library/` store.

#### Validation performed

- Documentation review only; no code changed.
