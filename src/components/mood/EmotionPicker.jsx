import { emotions } from "../../data/emotions.js";
import { getTheme } from "../../data/emotionThemes.js";
import Cloud from "../ui/Cloud.jsx";
import Chip, { Tag } from "../ui/Chip.jsx";

/**
 * Three-level emotion selection. It only renders the options that belong to
 * what was chosen above them; the reset rules live in useMoodDraft.
 */
export default function EmotionPicker({
  primary, secondary, tertiary,
  onChoosePrimary, onClearPrimary, onChooseSecondary, onChooseTertiary,
  error,
}) {
  const theme = primary ? getTheme(primary.id) : null;

  return (
    <section className="card emotion-picker" aria-labelledby="emotion-heading">
      {!primary ? (
        <>
          <h2 id="emotion-heading" className="card__title card__title--center">What are you feeling?</h2>
          <div className="cloud-grid" role="group" aria-label="Primary emotions">
            {emotions.map((e) => {
              const t = getTheme(e.id);
              return (
                <button
                  key={e.id}
                  type="button"
                  className="cloud-pick"
                  style={{ left: `${t.pos[0]}%`, top: `${t.pos[1]}%`, "--chip-ink": t.ink }}
                  onClick={() => onChoosePrimary(e.id)}
                >
                  <Cloud emotionId={e.id} />
                  <span className="cloud-pick__label">{e.label}</span>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <h2 id="emotion-heading" className="visually-hidden">Choose how you feel</h2>
          <Cloud emotionId={primary.id} className="cloud--large" />
          <div className="emotion-picker__primary">
            <Tag label={primary.label} emotionId={primary.id} strong />
            <button type="button" className="link-button" onClick={onClearPrimary}>
              Change feeling
            </button>
          </div>

          <h3 className="emotion-picker__question">What kind of {theme.noun} are you feeling?</h3>
          <div className="chip-row" role="group" aria-label={`Kinds of ${primary.label.toLowerCase()}`}>
            {primary.secondary.map((s) => (
              <Chip
                key={s.id}
                label={s.label}
                emotionId={primary.id}
                selected={secondary?.id === s.id}
                onClick={() => onChooseSecondary(s.id)}
              />
            ))}
          </div>

          {secondary && (
            <>
              <h3 className="emotion-picker__question">Which feels more like you?</h3>
              <div className="chip-row" role="group" aria-label={`Kinds of ${secondary.label.toLowerCase()}`}>
                {secondary.tertiary.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    emotionId={primary.id}
                    selected={tertiary === t}
                    onClick={() => onChooseTertiary(t)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
  );
}
