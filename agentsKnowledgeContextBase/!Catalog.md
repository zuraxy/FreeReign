# Route DJ knowledge catalog

This directory is the canonical context source for Route DJ. Root agent files are entry points only.

## Recommended reading order

1. [AboutProject.md](./AboutProject.md) — stable product north star, experience principles, scope, and long-term direction.
2. [ProjectState.md](./ProjectState.md) — factual snapshot of the current implementation, validation, limitations, and next step.
3. [ArchitectureDecisions.md](./ArchitectureDecisions.md) — engine decision log (D1–D12): analysis, reels as recipes, planner, renderer, move vocabulary, store, and the compass.
4. [ImplementationPlan.md](./ImplementationPlan.md) — implementation sequence, architecture decisions, acceptance criteria, and task status.
5. [Changelog.md](./Changelog.md) — dated record of meaningful project changes and validation.

## File responsibilities

- [AboutProject.md](./AboutProject.md) is canonical stable product context. Update only when the product direction or scope deliberately changes.
- [ProjectState.md](./ProjectState.md) is canonical current-state context. Update after every meaningful implementation change and never describe planned work as completed.
- [ArchitectureDecisions.md](./ArchitectureDecisions.md) is the canonical engine decision log. Amend it with dated entries; never silently rewrite a decision.
- [ImplementationPlan.md](./ImplementationPlan.md) is canonical delivery planning. Update task statuses as work progresses and revise implementation details when decisions change.
- [Changelog.md](./Changelog.md) records completed work by version or milestone and logical implementation slice.
- [Audits/README.md](./Audits/README.md) defines formal review format. Store named architecture, accessibility, UI, performance, state, test, maintainability, and backend-readiness audits in `Audits/`.
- [Prompts/README.md](./Prompts/README.md) explains prompt retention. Store reusable build, review, planning, and migration prompts in `Prompts/`.

## Update rules

- After meaningful code changes: update `ProjectState.md` and `Changelog.md`.
- After a deliberate architectural change: update `ImplementationPlan.md` before implementation and reflect the outcome in `ProjectState.md`.
- After a formal review: add a dated audit file under `Audits/` and summarize material findings in `ProjectState.md`.
- When a prompt has lasting project value: save a cleaned version under `Prompts/` and link it from the prompts index.
