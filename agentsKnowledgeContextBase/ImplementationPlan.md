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
