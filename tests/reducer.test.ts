import { describe, expect, it } from "vitest";
import { MockMusicEngine } from "@/lib/music-engine/MockMusicEngine";
import { createLoadingState, routeDJReducer } from "@/lib/route-dj/reducer";

describe("routeDJReducer", () => {
  it("loads a session and tracks candidate selection", async () => {
    const engine = new MockMusicEngine({ delayScale: 0 });
    const session = await engine.getInitialSession();
    const loaded = routeDJReducer(createLoadingState(), {
      type: "sessionLoaded",
      session,
    });
    const selected = routeDJReducer(loaded, {
      type: "selectCandidate",
      trackId: session.candidates[2].track.id,
    });

    expect(loaded.sessionStatus).toBe("ready");
    expect(selected.selectedCandidateId).toBe(session.candidates[2].track.id);
  });

  it("increments the canvas revision when the route advances", async () => {
    const engine = new MockMusicEngine({ delayScale: 0 });
    const initial = await engine.getInitialSession();
    const loaded = routeDJReducer(createLoadingState(), {
      type: "sessionLoaded",
      session: initial,
    });
    const advancedSession = await engine.advanceToNextTrack();
    const advanced = routeDJReducer(loaded, {
      type: "routeAdvanced",
      session: advancedSession,
      message: "Advanced",
    });

    expect(advanced.currentTrack.title).toBe("Nightfall");
    expect(advanced.canvasRevision).toBe(1);
    expect(advanced.selectedCandidateId).toBeNull();
  });
});
