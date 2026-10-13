import { toDateKey } from "./dateUtils.js";
import { reflectionQuestions } from "../data/reflectionQuestions.js";

/*
 * Shape of a saved mood entry:
 * {
 *   id:        "uuid",
 *   createdAt: "2026-10-11T08:30:00.000Z",   // exact moment (ISO string)
 *   date:      "2026-10-11",                 // LOCAL calendar day
 *   emotions:  { primary: "Angry", secondary: "Frustrated", tertiary: "Annoyed" },
 *   answers:   { thoughts: "...", needs: "...", body: "..." }
 * }
 * Emotions are stored as the labels shown to the user, so old entries still
 * read correctly if emotions.js is edited later.
 */

export function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEntry({ emotions, answers }, now = new Date()) {
  return {
    id: generateId(),
    createdAt: now.toISOString(),
    date: toDateKey(now),
    emotions: {
      primary: emotions.primary,
      secondary: emotions.secondary,
      tertiary: emotions.tertiary,
    },
    answers: Object.fromEntries(
      reflectionQuestions.map((q) => [q.key, (answers?.[q.key] ?? "").trim()]),
    ),
  };
}

const isText = (v) => typeof v === "string";

/** True when a value read from storage has the shape we expect. */
export function isValidEntry(e) {
  return (
    !!e &&
    isText(e.id) &&
    isText(e.createdAt) &&
    !Number.isNaN(Date.parse(e.createdAt)) &&
    /^\d{4}-\d{2}-\d{2}$/.test(e.date ?? "") &&
    !!e.emotions &&
    isText(e.emotions.primary) &&
    isText(e.emotions.secondary) &&
    isText(e.emotions.tertiary) &&
    !!e.answers &&
    reflectionQuestions.every((q) => isText(e.answers[q.key]))
  );
}

/** Map of "YYYY-MM-DD" -> entries for that day, oldest first. */
export function groupByDate(entries) {
  const map = new Map();
  const sorted = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  for (const entry of sorted) {
    if (!map.has(entry.date)) map.set(entry.date, []);
    map.get(entry.date).push(entry);
  }
  return map;
}
