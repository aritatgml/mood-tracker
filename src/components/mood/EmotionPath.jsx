import Cloud from "../ui/Cloud.jsx";
import { Tag } from "../ui/Chip.jsx";
import { emotions } from "../../data/emotions.js";

/** Primary id from a label (used when showing saved entries). */
export const primaryIdFromLabel = (label) =>
  emotions.find((e) => e.label === label)?.id ?? null;

/** "Angry › Frustrated › Annoyed" as pills, optionally with the cloud above. */
export default function EmotionPath({ primary, secondary, tertiary, primaryId, withCloud = false, center = false }) {
  const id = primaryId ?? primaryIdFromLabel(primary);
  return (
    <div className={`emotion-path ${center ? "emotion-path--center" : ""}`}>
      {withCloud && <Cloud emotionId={id} className="cloud--medium" />}
      <ol className="emotion-path__list" aria-label="Selected emotions">
        {[primary, secondary, tertiary].map((label, i) => (
          <li key={i}>
            <Tag label={label} emotionId={id} strong={i === 0} />
          </li>
        ))}
      </ol>
    </div>
  );
}
