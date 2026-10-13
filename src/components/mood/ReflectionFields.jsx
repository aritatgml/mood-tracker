import { reflectionQuestions } from "../../data/reflectionQuestions.js";
import TextAreaField from "../ui/TextAreaField.jsx";

/**
 * The three reflection questions.
 * `onlyIndex`: show just that question (mobile step-by-step flow).
 * `null`: show all three (desktop).
 */
export default function ReflectionFields({ answers, onChange, onlyIndex = null }) {
  const visible = onlyIndex === null ? reflectionQuestions : [reflectionQuestions[onlyIndex]];
  return (
    <>
      {visible.map((q) => (
        <TextAreaField
          key={q.key}
          icon={q.icon}
          title={q.title}
          hint={q.hint}
          value={answers[q.key]}
          onChange={(value) => onChange(q.key, value)}
        />
      ))}
    </>
  );
}
