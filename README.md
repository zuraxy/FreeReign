# Route DJ

Route DJ is a frontend-only prototype for navigating a continuous musical journey. The current song sits at the center of a recommendation space: move north for higher energy, south for lower energy, west for safer similarity, or east for more exploration.

This build validates the interface and interaction model. It does **not** perform real AI recommendations, play audio, mix tracks, or connect to a music service.

## The experience

The interface is inspired by the supplied Route DJ composition:

- A route strip keeps recently played, current, and queued tracks in view.
- Eight recommendations form a navigable constellation around the current track.
- Key, BPM, and genre indicators explain the relationship of each option.
- Wildcard chooses a deterministic exploratory direction.
- Add Next searches a local fictional library without leaving the journey.
- A persistent player simulates playback, seeking, volume, route mode, and route advancement.
- Desktop uses the full constellation; mobile keeps the current track prominent and turns candidates into a directional scroll-snap rail.

All artwork is original CSS geometry rendered from local color palettes.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

| Command                | Purpose                              |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start the development server         |
| `npm run build`        | Create the production build          |
| `npm start`            | Serve the production build           |
| `npm run lint`         | Run ESLint                           |
| `npm run typecheck`    | Run strict TypeScript checking       |
| `npm run test`         | Run focused Vitest tests once        |
| `npm run test:watch`   | Run tests in watch mode              |
| `npm run format`       | Format the repository with Prettier  |
| `npm run format:check` | Check formatting without changing it |

## Architecture

```text
Product-specific UI components
          ↓
RouteDJApp controller + pure reducer/selectors
          ↓
MusicEngine interface
          ↓
MockMusicEngine
          ↓
Deterministic local fixtures
```

Visual components do not import mock fixtures. They receive typed state and actions from the Route DJ controller. The `MusicEngine` contract owns session loading, recommendations, search, queue changes, route advancement, and playback commands, allowing an API-backed engine to replace the mock later without rebuilding the component tree.

The mock engine:

- Uses 18 fictional tracks and deterministic scoring
- Simulates configurable asynchronous delays
- Supports controlled one-shot failures in tests
- Keeps state in memory only
- Never makes network requests
- Emits no audio

## Keyboard controls

| Key     | Action                            |
| ------- | --------------------------------- |
| `←`/`→` | Move between recommendations      |
| `Enter` | Select the focused recommendation |
| `Q`     | Queue the selected recommendation |
| `Space` | Play or pause                     |
| `Esc`   | Close an open panel               |
| `?`     | Show keyboard controls            |

All primary actions also use semantic buttons and visible focus styles. Recommendation explanations and queue actions are available on keyboard focus as well as hover.

## Documentation system

Project context lives in [`agentsKnowledgeContextBase/`](./agentsKnowledgeContextBase/). New coding agents should begin with [`!Catalog.md`](./agentsKnowledgeContextBase/!Catalog.md), then read the stable product north star, current state, and implementation plan in the catalog’s order.

- `AGENTS.md` and `CLAUDE.md` are concise root entry points.
- `AboutProject.md` is stable product context.
- `ImplementationPlan.md` records task decisions and acceptance status.
- `ProjectState.md` is the factual current-state snapshot.
- `Changelog.md` records logical implementation slices.
- `Audits/` stores formal reviews.
- `Prompts/` stores reusable project prompts.

## Current limitations

- Playback is a timer simulation with no sound.
- Recommendations and wildcard behavior are deterministic mock logic, not AI.
- Refreshing resets the in-memory route.
- Queue reordering uses earlier/later controls rather than drag sorting.
- The mobile route strip and recommendation rail intentionally scroll horizontally.
- The test suite targets important state and interaction behavior rather than exhaustive visual regression.
- The current latest Next.js dependency tree has three high-severity transitive npm advisories in its bundled PostCSS and Sharp versions. npm offers no non-breaking upgrade path yet; see the initial frontend audit.

## Explicitly deferred

The prototype intentionally excludes real recommendation models, Spotify or other streaming integrations, a catalog backend, real audio playback, audio analysis, beat detection, automatic transitions, audio rendering, stem separation, uploads, authentication, user accounts, databases, cloud persistence, and music licensing.

## Recommended next phase

Run a short usability study focused on whether listeners understand the spatial directions, selection-to-queue step, and route advancement. Use those findings to freeze a first API contract for an API-backed `MusicEngine`, then build a read-only catalog/recommendation adapter behind the existing boundary before attempting audio transition technology.
