import { getTheme } from "../../data/emotionThemes.js";

/* Selectable option (secondary / tertiary emotion). Selected state is shown with a fill. */
export default function Chip({ label, emotionId, selected = false, onClick }) {
  const theme = getTheme(emotionId);
  return (
    <button
      type="button"
      className={`chip ${selected ? "chip--selected" : ""}`}
      style={{ "--chip-ink": theme.ink }}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/** Non-interactive pill used to show a chosen emotion (path, cards, review). */
export function Tag({ label, emotionId, strong = false }) {
  const theme = getTheme(emotionId);
  return (
    <span className={`tag ${strong ? "tag--strong" : ""}`} style={{ "--chip-ink": theme.ink }}>
      {label}
    </span>
  );
}
