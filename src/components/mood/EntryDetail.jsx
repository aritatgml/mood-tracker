import { formatLongDate, formatTime } from "../../utils/dateUtils.js";
import Button from "../ui/Button.jsx";
import EmotionPath from "./EmotionPath.jsx";
import AnswerList from "./AnswerList.jsx";

export default function EntryDetail({ entry, titleId, onClose }) {
  return (
    <>
      <h2 id={titleId} className="dialog__title">
        {formatLongDate(entry.date)}{" "}
        <span className="dialog__subtitle">Saved at {formatTime(entry.createdAt)}</span>
      </h2>
      <EmotionPath
        primary={entry.emotions.primary}
        secondary={entry.emotions.secondary}
        tertiary={entry.emotions.tertiary}
        withCloud
        center
      />
      <AnswerList answers={entry.answers} />
      <div className="actions">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </>
  );
}
