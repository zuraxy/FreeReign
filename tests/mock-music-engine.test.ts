import { describe, expect, it } from "vitest";
import {
  buildMockRecommendations,
  MockMusicEngine,
} from "@/lib/music-engine/MockMusicEngine";

describe("MockMusicEngine", () => {
  it("returns a deterministic initial session with eight directions", async () => {
    const engine = new MockMusicEngine({ delayScale: 0 });
    const session = await engine.getInitialSession();

    expect(session.currentTrack.title).toBe("Golden Horizon");
    expect(session.history).toHaveLength(2);
    expect(session.queue).toHaveLength(2);
    expect(session.candidates.map((candidate) => candidate.label)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
    ]);
  });

  it("prevents duplicate queue entries", async () => {
    const engine = new MockMusicEngine({ delayScale: 0 });
    const session = await engine.getInitialSession();
    const candidate = session.candidates[0];

    const first = await engine.queueTrack(candidate.track.id);
    const second = await engine.queueTrack(candidate.track.id);

    expect(first.added).toBe(true);
    expect(second.added).toBe(false);
    expect(
      second.queue.filter((item) => item.track.id === candidate.track.id),
    ).toHaveLength(1);
  });

  it("advances the first queued track and recenters recommendations", async () => {
    const engine = new MockMusicEngine({ delayScale: 0 });
    await engine.getInitialSession();

    const advanced = await engine.advanceToNextTrack();

    expect(advanced.currentTrack.title).toBe("Nightfall");
    expect(advanced.history.at(-1)?.track.title).toBe("Golden Horizon");
    expect(advanced.queue[0]?.track.title).toBe("Floating Point");
    expect(advanced.candidates).toEqual(buildMockRecommendations("nightfall"));
  });

  it("selects the same high-exploration wildcard deterministically", async () => {
    const firstEngine = new MockMusicEngine({ delayScale: 0 });
    const secondEngine = new MockMusicEngine({ delayScale: 0 });
    await firstEngine.getInitialSession();
    await secondEngine.getInitialSession();

    const first = await firstEngine.selectWildcard();
    const second = await secondEngine.selectWildcard();

    expect(first.track.id).toBe(second.track.id);
    expect(first.direction).toContain("exploratory");
  });
});
