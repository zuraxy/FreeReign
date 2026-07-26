# Initial frontend audit

- **Date:** 2026-07-26
- **Scope:** First frontend-only Route DJ prototype
- **Reviewer:** Codex
- **Validation evidence:** ESLint, strict TypeScript, 15 Vitest tests, Next.js production build, production browser console, interaction checks, and 1440/1024/768/390 viewport review

## Executive summary

The prototype meets its main product goal: it feels like a spatial music journey rather than a list or dashboard. The central track remains dominant, directional meaning is visible, and selection, queueing, search, wildcard, playback simulation, route advancement, and export are functional through a replaceable engine contract.

No critical or high-severity implementation defects were found. The main follow-up risks are upstream dependency advisories, limited automated accessibility tooling, and concurrency hardening for rapid repeated commands.

## Findings

### [Severity: Medium] Upstream production dependency advisories

- **Category:** Maintainability / Security
- **Evidence:** `npm audit --omit=dev` reports three high-severity transitive advisories in Next.js 16.2.12’s pinned PostCSS 8.4.31 and Sharp 0.34.5 dependencies. npm proposes only a breaking downgrade to Next.js 9.3.3.
- **Impact:** The affected packages are primarily used during build/image processing, and this prototype accepts no untrusted CSS or image input, but the dependency tree is not advisory-clean.
- **Recommendation:** Monitor the next stable Next.js release and upgrade as soon as it carries patched transitive versions. Do not apply npm’s suggested forced downgrade.
- **Disposition:** Open; upstream fix required.

### [Severity: Medium] Accessibility validation is primarily manual

- **Category:** Accessibility / Test coverage
- **Evidence:** Keyboard interaction, visible focus, semantic controls, modal focus entry/return, ARIA state, text labels, and reduced-motion rules are implemented and manually reviewed. No automated axe-core or screen-reader pass is included.
- **Impact:** Subtle naming, landmark, contrast, or focus-containment issues could remain.
- **Recommendation:** Add axe integration and perform VoiceOver/NVDA passes during the next refinement cycle.
- **Disposition:** Open.

### [Severity: Medium] Rapid async commands are not globally serialized

- **Category:** State management / Maintainability
- **Evidence:** Wildcard has an explicit loading lock and queue duplicates are engine-protected, but repeated next/remove/reorder commands can still overlap during mock delays.
- **Impact:** Aggressive repeated input could produce feedback ordering that differs from user intent. A real network-backed engine would make this more important.
- **Recommendation:** Add operation IDs or an application command queue when introducing the API-backed engine; disable only the controls affected by an in-flight operation.
- **Disposition:** Accepted for prototype scope.

### [Severity: Low] Overlay focus is guided but not trapped

- **Category:** Accessibility
- **Evidence:** Add Next focuses its search input and returns to its trigger; keyboard help focuses its close control and returns to the more-menu trigger. Focus is not constrained within either modal.
- **Impact:** Keyboard users can tab into background controls while a modal is open.
- **Recommendation:** Add a small shared focus-trap primitive before shipping beyond prototype evaluation.
- **Disposition:** Open.

### [Severity: Low] Queue ordering uses buttons rather than drag sorting

- **Category:** UI consistency
- **Evidence:** Every queued track has accessible earlier/later actions; no drag handle is present.
- **Impact:** The interaction is less direct for pointer users but remains clear, lightweight, and keyboard accessible.
- **Recommendation:** Validate whether drag ordering is important in usability testing before adding complexity.
- **Disposition:** Accepted.

### [Severity: Low] Visual regression coverage is manual

- **Category:** Test coverage / UI consistency
- **Evidence:** Four target widths were inspected and overflow was measured, but no baseline screenshot suite is checked into CI.
- **Impact:** Future CSS changes could regress the constellation or mobile player without a behavioral test failing.
- **Recommendation:** Add a small Playwright screenshot matrix after the visual language stabilizes.
- **Disposition:** Open.

## Strengths

- The UI, state layer, contract, mock engine, and fixtures have clear boundaries.
- Fixture and recommendation behavior is deterministic and network-free.
- Route advancement updates history, current track, queue, recommendations, playback position, and canvas motion coherently.
- Primary controls are functional and keyboard reachable; no prominent action is dead.
- Desktop, tablet, and mobile adaptations retain the product’s directional mental model.
- Tests cover all requested core behaviors without brittle pixel assertions.
- Production rendering is static, has no hydration warnings on a cold load, and showed no console errors.

## Recommended priorities

1. Conduct usability testing of the spatial model and selection-to-queue flow.
2. Add automated accessibility checks and a manual screen-reader pass.
3. Freeze an API-backed `MusicEngine` contract with operation identifiers and cancellation semantics.
4. Upgrade Next.js when patched PostCSS and Sharp transitives are available.
5. Add visual regression snapshots after product feedback stabilizes the composition.
