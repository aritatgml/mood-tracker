import { useId } from "react";

/** Labelled textarea. The hint is linked with aria-describedby. */
export default function TextAreaField({ icon, title, hint, value, onChange, maxLength = 1000, className = "" }) {
  const id = useId();
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className="field__label">
        <span aria-hidden="true">{icon}</span> {title}
      </label>
      <p id={`${id}-hint`} className="field__hint">{hint}</p>
      <textarea
        id={id}
        className="field__input"
        rows={4}
        value={value}
        maxLength={maxLength}
        aria-describedby={`${id}-hint`}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
