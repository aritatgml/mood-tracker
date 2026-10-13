import { getWeekKeys, todayKey, parseDateKey, formatLongDate } from "../../utils/dateUtils.js";
import { getTheme } from "../../data/emotionThemes.js";
import { primaryIdFromLabel } from "../mood/EmotionPath.jsx";

export default function WeekStrip({ entriesByDate, onSelectDate }) {
  const today = todayKey();
  const keys = Array.from({ length: 7 }, (_, i) => {
  const date = parseDateKey(today);
  date.setDate(date.getDate() - (6 - i));

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
});
  return (
    <nav className="week-strip" aria-label="This week">
      <ul>
        {keys.map((key) => {
          const d = parseDateKey(key);
          const dayEntries = entriesByDate.get(key) ?? [];
          const n = dayEntries.length;
          return (
            <li key={key}>
              <button
                type="button"
                className={`week-strip__day ${key === today ? "week-strip__day--today" : ""}`}
                aria-current={key === today ? "date" : undefined}
                aria-label={`${formatLongDate(key)}, ${n === 0 ? "no entries" : n === 1 ? "1 entry" : `${n} entries`}`}
                onClick={() => onSelectDate(key)}
              >
                <span className="week-strip__wd" aria-hidden="true">
                  {d.toLocaleDateString(undefined, { weekday: "narrow" })}
                </span>
                <span className="week-strip__num" aria-hidden="true">{d.getDate()}</span>
                <span className="week-strip__dots" aria-hidden="true">
                  {dayEntries.slice(0, 3).map((e) => (
                    <span key={e.id} className="day__dot" style={{ background: getTheme(primaryIdFromLabel(e.emotions.primary)).ink }} />
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
