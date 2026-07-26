"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

const directionRows = [
  { icon: ArrowUp, key: "N", label: "Higher energy", tone: "north" },
  { icon: ArrowDown, key: "S", label: "Lower energy", tone: "south" },
  { icon: ArrowLeft, key: "W", label: "Safer / more similar", tone: "west" },
  { icon: ArrowRight, key: "E", label: "More exploratory", tone: "east" },
] as const;

export function RoutingGuide() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setOpen(!media.matches);
    void Promise.resolve().then(update);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <details
      className="routing-guide"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>Routing guide</summary>
      <div className="routing-guide__content">
        {directionRows.map(({ icon: Icon, key, label, tone }) => (
          <div key={key} className={`routing-guide__row tone-${tone}`}>
            <Icon size={14} />
            <strong>{key}</strong>
            <span>{label}</span>
          </div>
        ))}
        <p>Match guide · close → far</p>
        <div className="routing-guide__scale" aria-label="Compatibility scale">
          <span className="tone-close" />
          <span className="tone-moderate" />
          <span className="tone-noticeable" />
          <span className="tone-far" />
        </div>
      </div>
    </details>
  );
}
