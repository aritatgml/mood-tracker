import { getMonthGrid, formatMonthYear, formatLongDate, todayKey, weekdayLabels } from "../../utils/dateUtils.js";
import { getTheme } from "../../data/emotionThemes.js";
import { primaryIdFromLabel } from "../mood/EmotionPath.jsx";

const MAX_DOTS = 3;

export default function CalendarGrid({ year, month, selectedDate, entriesByDate, onSelect, onPrev, onNext, onToday }) {
  const cells = getMonthGrid(year, month);
  const today = todayKey();
  const weekdays = weekdayLabels();
  const title = formatMonthYear(year, month);

  return (
    <section className="card calendar" aria-labelledby="calendar-title">
      <div className="calendar__header">
        <button type="button" className="icon-button" onClick={onPrev} aria-label="Previous month">
          <span aria-hidden="true">‹</span>
        </button>
        <h2 id="calendar-title" className="calendar__title" aria-live="polite">{title}</h2>
        <button type="button" className="icon-button" onClick={onNext} aria-label="Next month">
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <ul className="calendar__weekdays" aria-hidden="true">
        {weekdays.map((w, i) => (
          <li key={i}><span className="calendar__wd-long">{w.short}</span><span className="calendar__wd-short">{w.initial}</span></li>
        ))}
      </ul>

      <ol className="calendar__grid">
        {cells.map((cell) => {
          const dayEntries = entriesByDate.get(cell.key) ?? [];
          const count = dayEntries.length;
          const isSelected = cell.key === selectedDate;
          const isToday = cell.key === today;
          const label =
            `${formatLongDate(cell.key)}, ` +
            (count === 0 ? "no entries" : count === 1 ? "1 entry" : `${count} entries`) +
            (isToday ? ", today" : "");
          return (
            <li key={cell.key}>
              <button
                type="button"
                className={[
                  "day",
                  !cell.inMonth && "day--outside",
                  isToday && "day--today",
                  isSelected && "day--selected",
                  count > 0 && "day--has-entries",
                ].filter(Boolean).join(" ")}
                aria-label={label}
                aria-pressed={isSelected}
                onClick={() => onSelect(cell.key)}
              >
                <span className="day__number">{cell.day}</span>
                {count > 1 && <span className="day__count" aria-hidden="true">{count}</span>}
                <span className="day__dots" aria-hidden="true">
                  {dayEntries.slice(0, MAX_DOTS).map((e) => (
                    <span
                      key={e.id}
                      className="day__dot"
                      style={{ background: getTheme(primaryIdFromLabel(e.emotions.primary)).ink }}
                    />
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="calendar__footer">
        <button type="button" className="link-button" onClick={onToday}>Go to today</button>
        {/* <p className="calendar__legend">A dot is one entry, colored by its main feeling. A number shows several entries on one day.</p> */}
      </div>
    </section>
  );
}
