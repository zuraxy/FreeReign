import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RouteDJApp } from "@/components/route-dj/RouteDJApp";
import { MockMusicEngine } from "@/lib/music-engine/MockMusicEngine";

const renderApp = () => {
  const engine = new MockMusicEngine({ delayScale: 0 });
  const user = userEvent.setup();
  render(<RouteDJApp engine={engine} />);
  return { engine, user };
};

const waitForInitialSession = () =>
  screen.findByRole("article", {
    name: /Centered current track: Golden Horizon by Solar Drift/i,
  });

describe("RouteDJApp behavior", () => {
  it("renders the initial session and all eight candidates", async () => {
    renderApp();
    await waitForInitialSession();

    expect(screen.getByText("Route DJ")).toBeInTheDocument();
    expect(screen.getByLabelText("Current music route")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Select /i })).toHaveLength(
      8,
    );
    expect(screen.getByRole("button", { name: /Wildcard/i })).toBeEnabled();
  });

  it("selects and queues a recommendation", async () => {
    const { engine, user } = renderApp();
    await waitForInitialSession();
    const session = await engine.getInitialSession();
    const candidate = session.candidates[0];

    await user.click(
      screen.getByRole("button", {
        name: new RegExp(`Select ${candidate.track.title}`, "i"),
      }),
    );
    await user.click(screen.getByRole("button", { name: "Queue next" }));

    expect(
      await screen.findByRole("article", {
        name: new RegExp(`queued track: ${candidate.track.title}`, "i"),
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Queued" })).toBeDisabled();
  });

  it("selects a deterministic wildcard without immediately advancing", async () => {
    const { user } = renderApp();
    await waitForInitialSession();

    await user.click(screen.getByRole("button", { name: /Wildcard/i }));

    expect(
      await screen.findByText(/Surprise route selected:/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("article", {
        name: /Centered current track: Golden Horizon by Solar Drift/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Queue next" })).toBeEnabled();
  });

  it("toggles play and pause", async () => {
    const { user } = renderApp();
    await waitForInitialSession();

    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(
      await screen.findByRole("button", { name: "Pause" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(await screen.findByRole("button", { name: "Play" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("advances the first queued track", async () => {
    const { user } = renderApp();
    await waitForInitialSession();

    await user.click(screen.getByRole("button", { name: "Next track" }));

    expect(
      await screen.findByRole("article", {
        name: /Centered current track: Nightfall by Azure Morn/i,
      }),
    ).toBeInTheDocument();
  });

  it("searches the mock library and adds a track", async () => {
    const { user } = renderApp();
    await waitForInitialSession();

    await user.click(screen.getByRole("button", { name: /Add next/i }));
    const dialog = await screen.findByRole("dialog", {
      name: /Add a track next/i,
    });
    const search = within(dialog).getByRole("searchbox");
    await user.type(search, "Kinetic Orchid");
    const addButton = await within(dialog).findByRole("button", {
      name: "Add Kinetic Orchid",
    });
    await user.click(addButton);

    await waitFor(() =>
      expect(
        within(dialog).getByRole("button", {
          name: "Already on route Kinetic Orchid",
        }),
      ).toBeDisabled(),
    );
  });

  it("shows an empty Add Next search state", async () => {
    const { user } = renderApp();
    await waitForInitialSession();
    await user.click(screen.getByRole("button", { name: /Add next/i }));
    const dialog = await screen.findByRole("dialog", {
      name: /Add a track next/i,
    });

    await user.type(within(dialog).getByRole("searchbox"), "zzzz-no-track");

    expect(await within(dialog).findByText("No tracks found")).toBeVisible();
  });

  it("resets the demo from the more menu", async () => {
    const { user } = renderApp();
    await waitForInitialSession();
    await user.click(screen.getByRole("button", { name: "Next track" }));
    await screen.findByRole("article", {
      name: /Centered current track: Nightfall by Azure Morn/i,
    });

    await user.click(
      screen.getByRole("button", { name: "More prototype actions" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Reset demo" }));

    expect(
      await screen.findByRole("article", {
        name: /Centered current track: Golden Horizon by Solar Drift/i,
      }),
    ).toBeInTheDocument();
  });
});
