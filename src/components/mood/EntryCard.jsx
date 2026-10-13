import { formatTime } from "../../utils/dateUtils.js";
import { reflectionQuestions } from "../../data/reflectionQuestions.js";
import { getTheme } from "../../data/emotionThemes.js";
import { primaryIdFromLabel } from "./EmotionPath.jsx";
import Cloud from "../ui/Cloud.jsx";
import { Tag } from "../ui/Chip.jsx";

/** One saved entry in the day list. The whole card is a button that opens the detail dialog. */
export default function EntryCard({ entry, onOpen }) {
  const id = primaryIdFromLabel(entry.emotions.primary);
  const preview = reflectionQuestions.map((q) => entry.answers[q.key]).find(Boolean);
  return (
    <button
      type="button"
      className="entry-card"
      style={{ "--entry-edge": getTheme(id).edge }}
      onClick={() => onOpen(entry.id)}
    >
      <Cloud emotionId={id} className="entry-card__cloud" />
      <span className="entry-card__main">
        <span className="entry-card__time">{formatTime(entry.createdAt)}</span>
        <span className="entry-card__tags">
          <Tag label={entry.emotions.primary} emotionId={id} strong />
          <Tag label={entry.emotions.secondary} emotionId={id} />
          <Tag label={entry.emotions.tertiary} emotionId={id} />
        </span>
        <span className="entry-card__preview">{preview ?? "No reflections written"}</span>
      </span>
      <span className="entry-card__cue" aria-hidden="true">View ›</span>
    </button>
  );
}
