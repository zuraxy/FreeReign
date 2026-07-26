import type { MatchMetric } from "@/lib/music-engine/types";

interface MatchIndicatorProps {
  metric: MatchMetric;
  compact?: boolean;
}

export function MatchIndicator({
  metric,
  compact = false,
}: MatchIndicatorProps) {
  return (
    <div
      className={`match-indicator match-indicator--${metric.tone}`}
      title={`${metric.label}: ${metric.value}% — ${metric.detail}`}
    >
      <span className="match-indicator__label">{metric.label}</span>
      {!compact && (
        <span className="sr-only">
          {metric.value}% compatibility, {metric.detail}
        </span>
      )}
      <span className="match-indicator__bar" aria-hidden="true">
        <span style={{ width: `${metric.value}%` }} />
      </span>
    </div>
  );
}
