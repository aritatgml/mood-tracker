import { formatLongDate, todayKey } from "../../utils/dateUtils.js";
import Button from "../ui/Button.jsx";
import EntryCard from "../mood/EntryCard.jsx";

export default function DayEntries({ date, entries, onOpenEntry, onTrack }) {
  const today = todayKey();
  const isToday = date === today;
  const isFuture = date > today; // "YYYY-MM-DD" strings compare correctly

  return (
    <section className="card day-entries" aria-labelledby="day-heading">
      <h2 id="day-heading" className="card__title">
        {formatLongDate(date)}{" "}
        <span className="card__subtitle">
          {entries.length === 0 ? "No entries" : entries.length === 1 ? "1 entry" : `${entries.length} entries`}
        </span>
      </h2>

      {entries.length > 0 ? (
        <ul className="entry-list">
          {entries.map((entry) => (
            <li key={entry.id}><EntryCard entry={entry} onOpen={onOpenEntry} /></li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p className="empty-state__title">
            {isFuture ? "This day hasn’t happened yet" : isToday ? "Nothing logged yet today" : "No moods logged on this day"}
          </p>
          <p className="empty-state__text">
            {isFuture
              ? "Come back then to see how you felt."
              : isToday
                ? "Take a moment to check in with how you feel."
                : "Pick another date, or check in with how you feel right now."}
          </p>
          {!isFuture && <Button onClick={onTrack}>Track a mood</Button>}
        </div>
      )}
    </section>
  );
}
