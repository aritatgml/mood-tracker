// Date helpers. Everything works with LOCAL calendar dates, stored as
// "YYYY-MM-DD" keys. We never call toISOString() to build a date key, because
// that converts to UTC and can shift the date by one day.

const pad = (n) => String(n).padStart(2, "0");

/** Date -> "YYYY-MM-DD" using the local time zone. */
export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "YYYY-MM-DD" -> Date at local midnight. Returns null when invalid. */
export function parseDateKey(key) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key ?? "");
  if (!match) return null;
  const [y, m, d] = match.slice(1).map(Number);
  const date = new Date(y, m - 1, d);
  const valid = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
  return valid ? date : null;
}

export const todayKey = () => toDateKey(new Date());

/** Month navigation: month is 0-11, returns a new { year, month }. */
export function shiftMonth({ year, month }, delta) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

/**
 * Cells for a month grid starting on Monday. Always whole weeks, so the
 * array length is a multiple of 7. Days outside the month have inMonth=false.
 */
export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const leading = (first.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const total = Math.ceil((leading + daysInMonth) / 7) * 7;
  const cells = [];
  for (let i = 0; i < total; i++) {
    const date = new Date(year, month, 1 - leading + i);
    cells.push({
      key: toDateKey(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month,
    });
  }
  return cells;
}

/** The 7 date keys (Mon-Sun) of the week containing `key`. */
export function getWeekKeys(key) {
  const base = parseDateKey(key) ?? new Date();
  const offset = (base.getDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, i) =>
    toDateKey(new Date(base.getFullYear(), base.getMonth(), base.getDate() - offset + i)),
  );
}

export const formatMonthYear = (year, month) =>
  new Date(year, month, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });

export function formatLongDate(key) {
  const d = parseDateKey(key);
  return d
    ? d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";
}

export const formatShortMonthDay = (key) => {
  const d = parseDateKey(key);
  return d ? d.toLocaleDateString(undefined, { month: "long", day: "numeric" }) : "";
};

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export const weekdayLabels = () => {
  // 2024-01-01 was a Monday.
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2024, 0, 1 + i);
    return {
      short: d.toLocaleDateString(undefined, { weekday: "short" }),
      initial: d.toLocaleDateString(undefined, { weekday: "narrow" }),
    };
  });
};
