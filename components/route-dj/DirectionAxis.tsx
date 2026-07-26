import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

export function DirectionAxis() {
  return (
    <>
      <div className="direction-label direction-label--north">
        <strong>N</strong>
        <span>Higher energy</span>
        <ArrowUp size={16} />
      </div>
      <div className="direction-label direction-label--south">
        <strong>S</strong>
        <span>Lower energy</span>
        <ArrowDown size={16} />
      </div>
      <div className="direction-label direction-label--west">
        <strong>W</strong>
        <span>Safer / more similar</span>
        <ArrowLeft size={16} />
      </div>
      <div className="direction-label direction-label--east">
        <strong>E</strong>
        <span>More exploratory</span>
        <ArrowRight size={16} />
      </div>
    </>
  );
}
