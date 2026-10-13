import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery.js";
import { reflectionQuestions } from "../data/reflectionQuestions.js";
import { getTheme } from "../data/emotionThemes.js";
import { formatLongDate, formatTime, formatShortMonthDay, todayKey } from "../utils/dateUtils.js";
import Button from "../components/ui/Button.jsx";
import Cloud from "../components/ui/Cloud.jsx";
import EmotionPicker from "../components/mood/EmotionPicker.jsx";
import EmotionPath, { primaryIdFromLabel } from "../components/mood/EmotionPath.jsx";
import ReflectionFields from "../components/mood/ReflectionFields.jsx";
import EntryReview from "../components/mood/EntryReview.jsx";
import WeekStrip from "../components/calendar/WeekStrip.jsx";

const REFLECTION_COUNT = reflectionQuestions.length;

/** Which emotion is still missing? Used for the validation message. */
function missingEmotionMessage({ primary, secondary, tertiary }) {
  if (!primary) return "Choose how you’re feeling to continue.";
  if (!secondary) return `Choose the kind of ${getTheme(primary.id).noun} you’re feeling to continue.`;
  if (!tertiary) return "Choose which one feels more like you to continue.";
  return null;
}

export default function TrackPage({ moodDraft, addEntry, entriesByDate, onViewInCalendar, onSelectDate }) {
  const { draft, primary, secondary, tertiary, isComplete } = moodDraft;
  // Wide screens show the Figma desktop layout (everything on one screen);
  // narrow screens use the step-by-step mobile layout.
  const isWide = useMediaQuery("(min-width: 900px)");

  const [stage, setStage] = useState("compose"); // compose | review | saved
  const [mobileStep, setMobileStep] = useState(0); // 0 = emotions, 1..3 = reflection questions
  const [attempted, setAttempted] = useState(false);
  const [savedEntry, setSavedEntry] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const headingRef = useRef(null);
  const firstRender = useRef(true);

  const error = attempted && !isComplete ? missingEmotionMessage(moodDraft) : null;

  // Move keyboard/screen-reader focus to the heading of the review and success screens.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (stage !== "compose") headingRef.current?.focus();
  }, [stage]);

  // Tell screen readers which step they are on (without stealing focus).
  useEffect(() => {
    if (stage !== "compose") return;
    if (isWide) { setAnnouncement(""); return; }
    setAnnouncement(
      mobileStep === 0
        ? "Step 1: choose your emotion"
        : `Reflection ${mobileStep} of ${REFLECTION_COUNT}: ${reflectionQuestions[mobileStep - 1].title}`,
    );
  }, [stage, mobileStep, isWide]);

  const goToReview = () => {
    if (!isComplete) { setAttempted(true); setMobileStep(0); return; }
    setAttempted(false);
    setStage("review");
  };

  const next = () => {
    if (mobileStep === 0 && !isComplete) { setAttempted(true); return; }
    setAttempted(false);
    setMobileStep((s) => s + 1);
  };

  const save = () => {
    const entry = addEntry({
      emotions: { primary: primary.label, secondary: secondary.label, tertiary },
      answers: draft.answers,
    });
    setSavedEntry(entry);
    moodDraft.reset();
    setMobileStep(0);
    setAttempted(false);
    setStage("saved");
  };

  const startAnother = () => {
    setSavedEntry(null);
    setStage("compose");
  };

  /* ---------- Saved ---------- */
  if (stage === "saved" && savedEntry) {
    return (
      <div className="page page--narrow">
        <section className="card success" aria-labelledby="saved-heading">
          <Cloud emotionId={primaryIdOf(savedEntry)} className="cloud--large" />
          <h1 id="saved-heading" className="card__title card__title--center" ref={headingRef} tabIndex={-1}>
            Entry saved
          </h1>
          <p className="success__text" role="status">
            Your {savedEntry.emotions.primary.toLowerCase()} entry for {formatShortMonthDay(savedEntry.date)} at{" "}
            {formatTime(savedEntry.createdAt)} was added to your calendar.
          </p>
          <div className="actions">
            <Button onClick={startAnother}>Add another entry</Button>
            <Button variant="secondary" onClick={() => onViewInCalendar(savedEntry.date)}>View in calendar</Button>
          </div>
        </section>
      </div>
    );
  }

  /* ---------- Review ---------- */
  if (stage === "review" && isComplete) {
    return (
      <div className="page page--narrow">
        <PageTitle />
        <EntryReview
          primary={primary}
          secondary={secondary}
          tertiary={tertiary}
          answers={draft.answers}
          headingRef={headingRef}
          onBack={() => setStage("compose")}
          onSave={save}
        />
      </div>
    );
  }

  /* ---------- Compose: wide screens ---------- */
  if (isWide) {
    return (
      <div className="page">
        <PageTitle />
        <WeekStrip entriesByDate={entriesByDate} onSelectDate={onSelectDate} />
        <div className="track-layout">
          <EmotionPicker {...pickerProps(moodDraft)} error={error} />
          <section className="card reflection-card" aria-label="Reflection questions">
            <ReflectionFields answers={draft.answers} onChange={moodDraft.setAnswer} />
            <div className="actions">
              <Button onClick={goToReview}>Review entry</Button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  /* ---------- Compose: narrow screens, one step at a time ---------- */
  const isLastStep = mobileStep === REFLECTION_COUNT;
  return (
    <div className="page page--narrow">
      <PageTitle />
      <p className="visually-hidden" role="status">{announcement}</p>

      {mobileStep === 0 ? (
        <>
          {!primary && <WeekStrip entriesByDate={entriesByDate} onSelectDate={onSelectDate} />}
          <EmotionPicker {...pickerProps(moodDraft)} error={error} />
        </>
      ) : (
        <>
          <div className="stepper">
            <button type="button" className="link-button" onClick={() => setMobileStep((s) => s - 1)}>‹ Back</button>
            <p className="stepper__label">Reflection {mobileStep} of {REFLECTION_COUNT}</p>
            <div className="stepper__bar" aria-hidden="true">
              {reflectionQuestions.map((q, i) => (
                <span key={q.key} className={i < mobileStep ? "is-done" : ""} />
              ))}
            </div>
          </div>
          <EmotionPath
            primary={primary.label}
            secondary={secondary.label}
            tertiary={tertiary}
            primaryId={primary.id}
            withCloud
            center
          />
          <section className="card reflection-card" aria-label="Reflection question">
            <ReflectionFields answers={draft.answers} onChange={moodDraft.setAnswer} onlyIndex={mobileStep - 1} />
          </section>
        </>
      )}

      <div className="actions actions--sticky">
        {!isLastStep && <Button onClick={next}>Next</Button>}
        <Button variant={isLastStep ? "primary" : "secondary"} onClick={goToReview}>Review &amp; save</Button>
      </div>
    </div>
  );
}

// Saved entries store the label; map it back to the id used for colors.
const primaryIdOf = (entry) => primaryIdFromLabel(entry.emotions.primary);

function pickerProps(m) {
  return {
    primary: m.primary,
    secondary: m.secondary,
    tertiary: m.tertiary,
    onChoosePrimary: m.choosePrimary,
    onClearPrimary: m.clearPrimary,
    onChooseSecondary: m.chooseSecondary,
    onChooseTertiary: m.chooseTertiary,
  };
}

function PageTitle() {
  return (
    <div className="page-title">
      <h1>Mood tracking</h1>
      <p>{formatLongDate(todayKey())}</p>
    </div>
  );
}
