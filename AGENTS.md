# Route DJ agent instructions

1. Read `agentsKnowledgeContextBase/!Catalog.md` first.
2. Then read `agentsKnowledgeContextBase/AboutProject.md`.
3. Then read `agentsKnowledgeContextBase/ProjectState.md`.
4. Read `agentsKnowledgeContextBase/ImplementationPlan.md` before architectural or implementation changes.
5. Update `ProjectState.md` and `Changelog.md` after meaningful changes.
6. Place formal reviews in `agentsKnowledgeContextBase/Audits/`.
7. Preserve the boundary between UI, Route DJ application state, the `MusicEngine` contract, and engine implementations.
8. Do not implement backend, catalog, authentication, persistence, recommendation, or audio features unless explicitly planned.
9. Before declaring work complete, run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
