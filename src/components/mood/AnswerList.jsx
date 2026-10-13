import { reflectionQuestions } from "../../data/reflectionQuestions.js";

/** Read-only list of question + answer, used by the review step and the entry dialog. */
export default function AnswerList({ answers }) {
  return (
    <dl className="answer-list">
      {reflectionQuestions.map((q) => (
        <div key={q.key} className="answer-list__item">
          <dt>
            <span aria-hidden="true">{q.icon}</span> {q.title}
            <span className="answer-list__hint">{q.hint}</span>
          </dt>
          <dd className={answers[q.key] ? "" : "answer-list__empty"}>
            {answers[q.key] || "Not answered"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
