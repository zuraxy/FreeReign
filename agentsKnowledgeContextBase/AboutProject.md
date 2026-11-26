# About Route DJ

## Project identity

**Route DJ** is an AI-assisted music journey and automatic-DJ concept.

Instead of presenting music discovery as a conventional list, grid, playlist, or search result, Route DJ represents the current song as the center of a navigable musical space.

The listener chooses where the session should go next:

- Higher or lower energy
- Safer or more exploratory
- More harmonically compatible
- More rhythmically compatible
- More similar or deliberately different

The system handles the complexity of finding suitable options and, eventually, preparing musical transitions between them.

Route DJ should feel like navigating a route through music rather than operating professional DJ software.

---

## North star

The north star of Route DJ is:

> Let a listener guide the emotional and musical direction of a continuous session without requiring them to understand professional DJ tools.

The user should retain meaningful creative control while the system handles repetitive or technical work.

The desired balance is:

- The human chooses direction and intent.
- The system recommends viable paths.
- The human chooses the next destination.
- The system eventually handles the technical transition.
- The interface explains enough for the result to feel intentional rather than random.

Route DJ is AI-assisted, not AI-controlled.

---

## Core problem

Traditional playlists are linear and passive.

Traditional music recommendation interfaces often provide many options but do not clearly explain how each option changes the direction of the listening session.

Professional DJ applications provide extensive control, but they assume knowledge of:

- Beat matching
- Musical keys
- Phrasing
- EQ
- Cue points
- Track structure
- Transition timing
- Energy management

Route DJ aims to create a middle ground.

It should provide more authorship than a normal playlist while demanding substantially less expertise than professional DJ software.

---

## Core product loop

The essential Route DJ experience is:

1. A song is currently playing.
2. The current song appears at the center of the interface.
3. The system displays several recommended musical directions around it.
4. Each recommendation communicates how it differs from the current song.
5. The user chooses a direction or specific song.
6. The selected song is added to the route.
7. The system prepares the next stage of playback.
8. The next song becomes the new center.
9. A fresh recommendation space forms around it.
10. The session continues as a visible musical journey.

Every major feature should strengthen this loop.

---

## Direction model

The initial spatial model uses four primary directions.

### North — Higher energy

Recommendations above the current track should generally increase:

- Energy
- Intensity
- Momentum
- Rhythmic activity
- Perceived lift

### South — Lower energy

Recommendations below the current track should generally move toward:

- Lower intensity
- More space
- Softer rhythm
- Reduced momentum
- A calmer mood

### West — Safer and more similar

Recommendations to the left should prioritize:

- Similar genre
- Compatible BPM
- Compatible key
- Familiar mood
- Low transition risk

### East — More exploratory

Recommendations to the right should allow:

- Greater genre distance
- More noticeable mood changes
- Less obvious musical relationships
- Higher novelty
- More adventurous route changes

Diagonal recommendations combine the meanings of their nearest axes.

The exact recommendation algorithms may change later, but this directional mental model is central to the product.

**Amendment (2026-11-26):** The directional metaphor stays, but what each axis means is now a pluggable "lens" selected by the route mode (see [ArchitectureDecisions.md](./ArchitectureDecisions.md), D11). The default engine preset is **Move-first**: N = mashup, E = wordplay/toneplay, W = smooth blend, S = cut/echo-out. The energy/exploration model above remains a valid alternative preset. A candidate appears only if a viable transition plan into it exists.

---

## Intended user experience

The user should be able to understand the interface quickly, even without DJ experience.

Within a few seconds, they should understand:

- What song is playing
- What has already played
- What is queued
- Which recommendations are safer
- Which recommendations are more adventurous
- Which options raise or lower energy
- How compatible each candidate is
- What action will add a song to the route

The interface should reduce decision fatigue rather than creating another dense music library.

---

## Product personality

Route DJ should feel:

- Calm
- Premium
- Intelligent
- Exploratory
- Musical
- Editorial
- Precise
- Approachable

It should not feel:

- Like a professional aircraft cockpit
- Like a generic analytics dashboard
- Like a gaming interface
- Like a neon nightclub poster
- Like a complicated digital audio workstation
- Like an autonomous system taking control away from the listener

The visual language should use space, hierarchy, motion, and restraint.

---

## Design principles

### 1. Direction before detail

The user should first understand where a recommendation takes the session.

Detailed metrics should support that decision rather than dominate it.

### 2. Continuous context

The current song, previous songs, and queued songs should remain understandable as one route.

The user should never lose track of where the session came from or where it is going.

### 3. Explainable recommendations

The application should communicate why a recommendation is present through information such as:

- Energy difference
- BPM compatibility
- Harmonic compatibility
- Genre relationship
- Exploration level

The interface should not imply that an unexplained score is objective truth.

### 4. Human direction, machine assistance

The system proposes and prepares.

The user decides.

Automation should remove mechanical effort without removing authorship.

### 5. Calm motion

Motion should clarify:

- Selection
- Queueing
- Route advancement
- Recentring
- Playback state
- Preparation state

Motion should not exist merely for spectacle.

### 6. Honest system states

Future transition preparation may take time or fail.

The interface must support:

- Loading
- Analysis
- Preparation
- Ready
- Low-confidence result
- Failure
- Safe fallback

The product should not pretend that every song pair can receive an equally sophisticated transition.

### 7. Progressive complexity

A new listener should be able to use Route DJ without knowing Camelot notation, phrasing, or beat grids.

More advanced information may be available without becoming mandatory.

---

## Current project phase

The current phase is a **frontend-only behavioral prototype**.

The goal is to validate:

- The spatial recommendation metaphor
- The route timeline
- Candidate selection
- Queueing
- Playback-state presentation
- Route advancement
- Recentring around a new current song
- The visual hierarchy
- Interaction pacing
- Responsive behavior
- Future backend requirements

The present prototype uses fictional tracks, deterministic mock recommendations, and simulated playback.

It must not claim to perform real AI recommendation or automatic mixing.

---

## Current technical boundary

The frontend should interact with an abstract music-engine interface.

The initial implementation uses:

- A `MusicEngine` contract
- A deterministic `MockMusicEngine`
- Local track fixtures
- Simulated asynchronous operations
- Simulated playback state
- Simulated transition-preparation states

The visual components should not depend directly on the internal structure of the mock implementation.

A future backend should be replaceable behind the same application boundary.

---

## Future system direction

The future Route DJ system may contain several independent capabilities.

### Track analysis

Potential responsibilities:

- BPM estimation
- Beat tracking
- Downbeat detection
- Musical-key detection
- Energy analysis
- Vocal activity detection
- Structural segmentation
- Intro and outro detection
- Phrase detection
- Loudness analysis
- Genre and mood embeddings

### Recommendation engine

Potential responsibilities:

- Candidate retrieval
- Directional placement
- Similarity scoring
- Exploration scoring
- Energy-path planning
- Harmonic compatibility
- BPM compatibility
- User preference adaptation
- Session-level variety

### Transition planner

Potential responsibilities:

- Choosing suitable transition regions
- Evaluating phrase alignment
- Detecting vocal overlap
- Selecting a transition strategy
- Estimating transition risk
- Producing multiple candidate plans
- Choosing a safe fallback

### Audio engine

Potential responsibilities:

- Time stretching
- Beat alignment
- Gain automation
- EQ automation
- Filter automation
- Echo or delay effects
- Stem-aware transitions
- Loudness normalization
- Transition rendering
- Cached or real-time playback

### Catalog layer

Potential responsibilities:

- Licensed audio
- User-owned files
- Uploaded tracks
- Track metadata
- Analysis caching
- Search
- Playlist import where legally and technically permitted

These systems are future work and are intentionally outside the current frontend phase.

---

## Product scope boundaries

Route DJ is not currently intended to become:

- A complete digital audio workstation
- A replacement for advanced professional DJ decks
- A music-production application
- A social network
- A general-purpose music streaming service
- A marketplace
- A full catalog-management suite

Those directions should not be introduced unless the core route experience has first been validated.

---

## Success criteria for the frontend prototype

The frontend prototype is successful when:

1. A new user can identify the current track immediately.
2. The four directional meanings are understandable without lengthy instructions.
3. The user can compare recommendations without feeling overwhelmed.
4. The user can select and queue a song confidently.
5. The top route clearly communicates past, current, and queued tracks.
6. Advancing to the next song feels spatially and visually coherent.
7. The interface remains usable across desktop, laptop, tablet, and mobile.
8. Important interactions work with a keyboard.
9. Loading and failure states exist even though they are simulated.
10. The frontend can later consume a real backend without a complete component rewrite.

---

## Success criteria for the eventual product

The eventual product succeeds when a listener can:

- Start from a song they enjoy
- Communicate where they want the session to go
- Receive understandable recommendations
- Build a coherent route with minimal friction
- Hear consistently clean transitions
- Intervene whenever they want
- Trust the system to use safe fallbacks when needed
- Finish a session that feels intentionally shaped rather than randomly generated

---

## Primary risk

The largest long-term technical risk is not the visual interface.

It is producing transitions that remain musically convincing across varied tracks and genres.

For that reason, Route DJ should initially prioritize:

- Narrow genre support
- Reliable phrase-aligned transitions
- Clean EQ and filter transitions
- Honest confidence estimates
- Safe fallback behavior
- Ahead-of-time preparation where useful

The product should prefer a simple transition executed immaculately over a complex transition executed unreliably.

---

## Current exclusions

The following are explicitly not implemented in the current phase:

- Real audio playback
- Automatic DJ transitions
- Beat matching
- Spotify playback
- Spotify audio processing
- Track uploads
- Backend APIs
- Databases
- Authentication
- User accounts
- Persistent playlists
- Cloud deployment requirements
- Real recommendation models
- Real transition confidence
- Commercial music licensing

These exclusions are intentional.

They should remain visible in `ProjectState.md` until their corresponding implementation phases begin.

---

## Architectural principle

The application should be built around this boundary:

    Interface components
            ↓
    Route DJ application state
            ↓
    MusicEngine contract
            ↓
    Mock implementation today
    Real backend implementation later

The interface should describe the intended product experience.

The backend should later fulfill that experience without defining the product solely around its earliest technical limitations.

---

## Guiding statement

When a product or engineering decision is unclear, prefer the option that best supports this statement:

> Route DJ lets people shape the direction of a continuous musical journey while intelligent systems quietly handle the technical complexity underneath.
