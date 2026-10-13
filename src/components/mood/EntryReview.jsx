import Button from "../ui/Button.jsx";
import EmotionPath from "./EmotionPath.jsx";
import AnswerList from "./AnswerList.jsx";

export default function EntryReview({ primary, secondary, tertiary, answers, headingRef, onBack, onSave }) {
  return (
    <section className="card review" aria-labelledby="review-heading">
      <h2 id="review-heading" className="card__title card__title--center" ref={headingRef} tabIndex={-1}>
        Review your entry
      </h2>
      <EmotionPath
        primary={primary.label}
        secondary={secondary.label}
        tertiary={tertiary}
        primaryId={primary.id}
        withCloud
        center
      />
      <AnswerList answers={answers} />
      <div className="actions">
        <Button onClick={onSave}>Save entry</Button>
        <Button variant="secondary" onClick={onBack}>Back to edit</Button>
      </div>
    </section>
  );
}
