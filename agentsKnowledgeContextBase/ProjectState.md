# Route DJ project state

## Current project phase

The first frontend-only behavioral prototype is complete and ready for product evaluation.

## Completed

- Required canonical agent documentation system and saved initial build prompt.
- Next.js 16 App Router, strict TypeScript, Tailwind CSS, ESLint, Prettier, Framer Motion, Lucide, Vitest, and React Testing Library setup.
- Reference-inspired desktop composition with route strip, spatial constellation, current/candidate cards A–H, cardinal axes, radial guides, match metrics, routing guide, peripheral context, wildcard, and persistent player.
- Responsive laptop/tablet refinements and a mobile current-track plus directional scroll-snap recommendation rail.
- Eighteen fictional tracks and original local CSS artwork.
- Typed `MusicEngine` contract, deterministic asynchronous `MockMusicEngine`, pure reducer, and selectors.
- Candidate focus/selection, duplicate-safe queueing, queue removal/reordering, wildcard, Add Next search, preparation states, player simulation, seek/volume/mode, automatic and manual route advancement, recentering, reset, debug view, keyboard help, and JSON export.
- Loading, empty, controlled failure, preparation, ready, selected, queued, and disabled states.
- Fifteen focused tests across engine, reducer, export, and component behavior.
- Initial frontend audit and multi-viewport browser inspection.

## In progress

- Nothing. The prototype is awaiting user evaluation.

## Not started

- Usability study with target listeners.
- API-backed engine or any backend/audio implementation.
- Automated accessibility and visual-regression tooling.

## Current architecture

Product UI components → `RouteDJApp` controller and pure reducer/selectors → `MusicEngine` interface → deterministic stateful `MockMusicEngine` → local fictional fixtures.

## Important implementation decisions

- The attached desktop image is the primary visual hierarchy reference.
- Mobile adapts the constellation to a scroll-snap candidate rail instead of shrinking the desktop layout.
- Visual components do not import fixture data.
- Artwork uses local CSS geometry and color palettes.
- Mock operations use centralized, configurable delays and deterministic state.
- Framer Motion owns stateful/spatial motion; CSS variables own design tokens and responsive composition.
- TypeScript 6.0.3 and ESLint 9.x are pinned because TypeScript 7 and ESLint 10 are not yet supported by the current Next.js lint stack.

## Known limitations

- Playback is timer simulation only and emits no audio.
- Recommendations and match scores are illustrative deterministic logic.
- Session state resets on refresh.
- Queue sorting uses earlier/later buttons rather than drag-and-drop.
- Overlay focus enters and returns correctly but is not fully trapped.
- Mobile route and recommendation surfaces intentionally scroll horizontally.
- Latest Next.js currently includes vulnerable transitive PostCSS and Sharp releases with no non-breaking npm audit remediation.

## Technical debt

- Add automated axe checks and a manual screen-reader validation pass.
- Serialize or identify overlapping async commands before a real network engine is introduced.
- Add visual regression coverage after the composition stabilizes.
- Monitor Next.js releases for patched PostCSS and Sharp transitives.

## Validation status

- `npm install`: passed; stable compatible package versions pinned.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test`: passed, 15 tests across 4 files.
- `npm run build`: passed; `/` statically prerendered.
- Production browser console: no warnings or errors on cold load.
- Responsive inspection: 1440, 1024, 768, and 390 pixel widths reviewed; desktop/mobile page overflow resolved.
- `npm audit --omit=dev`: reports three high-severity upstream transitive advisories; documented in the initial audit.

## Recommended next step

Run a focused usability study on directional comprehension, recommendation comparison, selection-to-queue behavior, and route advancement. Use the findings to finalize a first API-backed `MusicEngine` contract before beginning catalog or recommendation backend work.

## Intentionally unimplemented backend features

Real recommendation models, catalog services, Spotify integration, audio playback/rendering/analysis, beat detection, automatic transitions, stem separation, authentication, user accounts, databases, cloud persistence, uploads, and licensed catalog support remain explicitly out of scope.
