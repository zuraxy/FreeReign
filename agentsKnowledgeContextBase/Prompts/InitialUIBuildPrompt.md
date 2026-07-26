# Initial Route DJ UI build prompt

Build and fully validate the first frontend-only Route DJ prototype from the supplied reference image. Route DJ places the current song at the center of a navigable recommendation space: north raises energy, south lowers it, west is safer/more similar, and east is more exploratory; diagonals combine these meanings.

## Experience requirements

- Recreate the reference hierarchy: upper-left branding, top route strip for past/current/queued/Add Next, central current-song card, eight labeled recommendations A–H, cardinal axes, radial guides and connectors, match indicators, routing legend, faded peripheral context, right-side Wildcard, and persistent bottom player.
- Use an airy premium editorial style with warm off-white surfaces, orange accent, thin borders, restrained shadows, whitespace, calm motion, and responsive adaptations.
- Desktop should preserve the constellation; tablet may pan/scroll; mobile should use a considered directional recommendation rail.

## Architecture and data

- Use Next.js App Router, strict TypeScript, Tailwind CSS, Framer Motion, Lucide React, ESLint, Prettier, Vitest, and React Testing Library.
- Preserve UI → centralized Route DJ state → `MusicEngine` interface → `MockMusicEngine`.
- Include typed tracks, candidates, metrics, route/queue items, playback, transition preparation, directions, and full app state.
- Provide at least 16 fictional local tracks with abstract local artwork and deterministic recommendation/match metadata.
- Mock all async behavior and controlled failures locally; make no network calls and require no secrets.

## Required behavior

- Candidate focus/hover explanations, keyboard navigation, selection, queue-next, duplicate prevention, and availability updates.
- Past/current/queued timeline with queue removal and lightweight reordering.
- Add Next searchable library overlay with empty state and Escape/focus handling.
- Deterministic exploratory Wildcard selection.
- Simulated play/pause, previous/next, seeking, volume, elapsed/total time, key, energy, route mode, automatic queue advancement, recentering, and recommendation reload.
- JSON route export and harmless overflow actions for reset, debug states, and keyboard controls.
- Meaningful Framer Motion transitions, constrained canvas panning, return-to-center, loading states, and reduced-motion behavior.
- Accessible semantic controls, visible focus, ARIA state, text-plus-color indicators, and no hover-only interaction.

## Documentation and validation

- Maintain `AGENTS.md`, `CLAUDE.md`, and the canonical `agentsKnowledgeContextBase/` catalog, north star, plan, project state, changelog, audits, and prompts.
- Implement in foundation, behavior, and refinement slices; update plan/status documents after each slice.
- Add focused tests for initial rendering, candidate selection, queueing and duplicate prevention, wildcard, playback, advancement, Add Next, reset, export, and reducer transitions.
- Pass install, lint, typecheck, tests, and production build; inspect desktop, laptop, tablet, and mobile layouts.
- Finish with an honest `InitialFrontendAudit.md`, current README, known limitations, and recommended next phase.

## Explicit exclusions

Do not implement or imply real AI recommendations, Spotify, a real catalog backend, audio playback or processing, beat detection, automatic transitions, stem separation, authentication, accounts, databases, or cloud persistence.
