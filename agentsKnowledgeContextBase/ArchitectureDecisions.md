# Route DJ engine architecture decisions

Decisions from the 2026-11-26 architecture grilling session. Each entry records the decision, the reason, and what it rules out. Change an entry only by adding a dated amendment beneath it.

## Context at decision time

- **Library (`songs/`)**: 2,688 MP3 rows / **2,384 unique tracks** (dedupe by `spotify_url`), ~152 hours, 128 kbps / 48 kHz, from spotdl. 453 unique tracks are music-video rips (`source = youtube`) with possible extra intros/outros. No BPM/key/energy tags. `manifest.csv` is the canonical inventory; each MP3 carries its Spotify URL in the ID3 `WOAS` tag.
- **Reference reels (`reels/`)**: 141 Instagram DJ reels (mp4 + mp3, median ~40 s) with `collection.json` and `metadata.csv`. Content is predominantly mashups and short transitions (wordplay, toneplay, "X x Y"). Roughly half of the captions name songs that exist in the library.
- **Dev machine**: Windows 11, Intel Core 7 150U, 16 GB RAM, no NVIDIA GPU, ~14 GB free on C:, WSL2 Ubuntu installed, `uv` installed, no ffmpeg/Docker.

## D1 — Ambition order: mashups → transitions → selection

The aspirational goal is reel-quality mashups. Transitions are the core. Selection is the base layer. Everything must run from local **FLAC or MP3** files. There are no streaming-service APIs for audio.

## D2 — Two-tier analysis; heavy tier on rented or borrowed GPU

- **Light tier** runs locally on all tracks: beats/downbeats, BPM, key, loudness, energy features, structure, embeddings. Output is small JSON.
- **Heavy tier** (Demucs stems + WhisperX word-timestamped lyrics) runs as a cloud GPU burst (RunPod/Modal-class, est. $5–10 for the MVP set) or on a collaborator's hardware.
- Stems are stored compressed (Opus/MP3), off the system drive. Vocals + instrumental are mandatory; 4-stem output is optional.

**Amendment (2026-11-26):** The primary heavy-tier machine is now a collaborator's laptop: i7-13700HX, **RTX 4060 8 GB**, 16 GB RAM, 512 GB SSD. Cloud GPU is only the fallback. Constraints:
- Run Demucs and WhisperX as separate sequential passes, because 8 GB VRAM won't hold both models at once.
- Use WhisperX large-v3 in fp16/int8 with a modest batch size.
- Use WSL2 + CUDA built from the same lockfile.
- The job must be portable: copy the MVP audio over, run it, copy `library/` back. Merging is safe because the store is keyed by track ID + `source_hash` (D10).
- Benchmark a 10-track run before the full batch.

## D3 — Reels are recipes, not an audio reward

- Reels are **reverse-engineered into structured mix plans** (sections, cut points, technique, stretch, shift, and the reason it works). They serve as (1) the recreation benchmark, (2) few-shot exemplars, and (3) seed positives for a learned ranker.
- **The user's 👍/👎 and skips on generated transitions are the long-term, scalable reward.**
- Rejected: training any model to generate audio that "sounds like the reels". There is too little data, and different songs give no comparable target.
- Consequence: **no model ever generates audio.** Models output plans. A deterministic renderer executes them.

## D4 — Planner: algorithmic funnel; LLM optional and benchmark-gated

- MVP pipeline: **retrieve → enumerate + score → render**. It is fully deterministic and costs $0 in inference.
- "Why" explanations are **templated from score components** (shared word, keys, stretch %, energy delta).
- An LLM judge/refiner is a pluggable stage that is **off by default**. It may only pick among enumerated plans and never invents timestamps. It ships only if it beats the pure algorithmic planner on the reel benchmark. Allowed backends for experiments: local Qwen/Llama via Ollama, or the Groq free tier. Paid inference is deferred.

## D5 — Offline segment rendering in Python; Next.js stays the UI

- A Python FastAPI service owns analysis, planning, and rendering, and implements the existing `MusicEngine` contract. The frontend swaps `MockMusicEngine` for an `ApiMusicEngine`.
- Only the **transition segment** (the overlap/mashup region) is rendered: Rubber Band R3 for stretch/shift, pedalboard for EQ/filter/FX, and loudness matching. Tempo ramps back to B's native BPM inside the segment.
- The browser plays `A original → rendered segment → B original` gaplessly with sample-accurate Web Audio scheduling.
- One renderer serves the app, the benchmark, and route export.

## D6 — Two-layer mix vocabulary: primitives + closed move templates

- **Primitives** (the renderer executes only these, as automation curves): per deck/stem gain, 3-band EQ, HPF/LPF, echo/delay, reverb, loop (incl. rolls), tempo stretch/ramp, pitch shift, playhead jump, stem mute, brake/spinback.
- **Moves** (what the planner searches over and recipes are labeled with) are named templates that expand into primitives. A plan chains 1–3 moves.
- Build order: `echo_out` + `cut` (beats only; universal fallback) → `wordplay_cut` + `toneplay_cut` → `blend` (always with bass swap) + `loop_extend` → `vocal_over` (mashup) → `stem_swap`.
- Known future templates: `loop_roll`, `double_drop`, `teaser`, `halftime_switch`, `energy_key_jump`, `filter_fade`.
- **Coverage is measured**, not assumed. The **reel recreation residual** (beat-synced spectral distance between a rendered recipe and the reel, per stem) flags reels the vocabulary cannot explain. A high residual is the trigger to add a template. Ranker failure on feedback flags missing scoring features. Occasional expert listening fills the gaps.
- Initial scoring features: phrase alignment, Camelot distance (incl. ±1 energy jumps), BPM ratio (incl. half/double), vocal-on-vocal clash, low-end collision, LUFS match, energy delta vs. requested direction.

## D7 — Hybrid reel identification

Caption parsing + stem-based, tempo-invariant matching (beat-synced chroma/MFCC, subsequence DTW) proposes `(reel → library tracks)` with confidence. The user confirms or corrects these in a small review UI. Auto-alignment then extracts timestamps, stretch, and shift. The pipeline also outputs a **missing-songs list** for reel tracks not in the library, which the user downloads with the existing spotdl flow.

## D8 — MVP library scope: ~900 tracks

- MVP set = Bar/Club Party (both lists) ∪ Night Drive ∪ reel-referenced songs. The heavy tier runs on this set first.
- The light tier runs on all tracks. Tracks outside the MVP set still appear but are limited to `echo_out`/`cut` and labeled "basic transition only".
- **OPM is a deliberate phase-2 genre**. Rubato/live tempo, Tagalog lyric ASR quality, and the karaoke listening context may need different moves.

## D9 — Engine runtime: WSL2 + uv + Python 3.11, in this repo

- The engine lives in `engine/` in this repository as a `uv` project pinned to Python 3.11 with a lockfile. It runs in WSL2 Ubuntu because the MIR stack (essentia, madmom, allin1/NATTEN) is Linux-first.
- It reads audio in place via `/mnt/c/...`. FastAPI is reachable from Windows on `localhost`.
- Cloud jobs build a container from the same lockfile. Rejected: native Windows (build pain, divergent environments) and Docker-only locally (RAM overhead).

## D10 — Track identity and analysis store

- **Track ID = Spotify track ID**, with an audio content hash as fallback. One track ID may have multiple audio sources (MP3 now, FLAC later), and analysis records which source it came from.
- Per-track folder `library/<track_id>/` holds one JSON per analyzer plus `stems/`. Each output is stamped `{analyzer, version, model_checksum, source_hash}`. A refresh command re-runs only stale outputs.
- A **SQLite + sqlite-vec index** handles retrieval and is fully rebuildable from the JSON.
- `overrides.json` holds manual corrections (beat grid, downbeat, BPM, key). It always wins and is never overwritten. Overrides double as analyzer-error labels.
- The store root is configurable and gitignored, so it can live on an external drive or cloud storage.

## D11 — Compass axes are pluggable lenses; Move-first by default

- Each compass axis is a **lens**: a scoring function over `(current, candidate, plan)`. A **preset** maps lenses to N/S/E/W, and the UI's "AI Route Mode" dropdown selects the preset.
- **Default preset: Move-first.** N = mashup (`vocal_over`), E = wordplay/toneplay, W = smooth `blend`, S = `cut`/`echo_out`. Each slot shows the best song *for that move*.
- **Second preset: Time Machine.** Throwback ↔ current × anthem ↔ deep cut, from release year and familiarity.
- Other lenses considered for later: mood circumplex (valence × arousal), story/theme (lyric semantics), prompt-steered (CLAP text directions), learned axes.
- **Every compass slot is plan-gated**: a candidate appears only if at least one viable plan exists.
- Move-first requires precomputed stems/lyrics for the MVP set, plus two indexes: a **lyric/phoneme index** (word → track, timestamp) and a **mashability pair table** (BPM/key-filtered pairs, pre-scored).

## D12 — Build order: tracer bullet first

After M0, build a thin end-to-end slice (one pair → light analysis → `echo_out` plan → render → plays in the existing UI via a minimal API) before the reel benchmark. The benchmark follows immediately and must land before any "clever" move ships. Milestones are in [ImplementationPlan.md](./ImplementationPlan.md).

## Standing constraints

- Library and reel audio are copyrighted recordings for **personal use only**. Public playback, streaming, or redistribution of renders, or of models trained on the audio, requires licenses.
- Audio media (`songs/`, `reels/`, `library/`) is never committed.
