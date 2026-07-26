import { describe, expect, it } from "vitest";
import { MockMusicEngine } from "@/lib/music-engine/MockMusicEngine";
import { createLoadingState, routeDJReducer } from "@/lib/route-dj/reducer";
import { serializeRoute } from "@/lib/route-dj/selectors";

describe("route export serialization", () => {
  it("serializes past, current, queued, timestamp, and route mode", async () => {
    const engine = new MockMusicEngine({ delayScale: 0 });
    const session = await engine.getInitialSession();
    const state = routeDJReducer(createLoadingState(), {
      type: "sessionLoaded",
      session,
    });

    const exported = serializeRoute(state, "2026-07-26T12:00:00.000Z");

    expect(exported.pastTracks.map((track) => track.title)).toEqual([
      "2 Choes in Mind",
      "Into The Light",
    ]);
    expect(exported.currentTrack.title).toBe("Golden Horizon");
    expect(exported.queuedTracks).toHaveLength(2);
    expect(exported.exportedAt).toBe("2026-07-26T12:00:00.000Z");
    expect(exported.routeMode).toBe("Focus");
  });
});
