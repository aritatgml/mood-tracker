import test from "node:test";
import assert from "node:assert/strict";
import { toDateKey, parseDateKey, getMonthGrid, shiftMonth, getWeekKeys } from "./dateUtils.js";
import { createEntry, isValidEntry, groupByDate } from "./entryUtils.js";
import { loadEntries, saveEntries, STORAGE_KEY } from "./storage.js";
import { emotions } from "../data/emotions.js";

const fakeStorage = (initial) => {
  const data = new Map(initial ? [[STORAGE_KEY, initial]] : []);
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
};
const sample = { emotions: { primary: "Angry", secondary: "Frustrated", tertiary: "Annoyed" }, answers: { thoughts: " a ", needs: "b", body: "c" } };

test("date key uses local date (late-evening local time does not roll over)", () => {
  const d = new Date(2026, 9, 11, 23, 59, 59);
  assert.equal(toDateKey(d), "2026-10-11");
  const e = new Date(2026, 9, 12, 0, 0, 1);
  assert.equal(toDateKey(e), "2026-10-12");
});

test("parseDateKey round-trips and rejects invalid", () => {
  assert.equal(toDateKey(parseDateKey("2026-02-28")), "2026-02-28");
  assert.equal(parseDateKey("2026-02-30"), null);
  assert.equal(parseDateKey("nope"), null);
});

test("month grid starts on Monday and is whole weeks", () => {
  const grid = getMonthGrid(2026, 9); // October 2026 starts on Thursday
  assert.equal(grid.length % 7, 0);
  assert.equal(grid[0].key, "2026-09-28"); // Monday
  assert.equal(grid.find((c) => c.inMonth).key, "2026-10-01");
  assert.equal(grid.filter((c) => c.inMonth).length, 31);
});

test("month grid handles a month starting on Monday (June 2026) and leap February", () => {
  assert.equal(getMonthGrid(2026, 5)[0].key, "2026-06-01");
  assert.equal(getMonthGrid(2028, 1).filter((c) => c.inMonth).length, 29);
});

test("shiftMonth wraps across years", () => {
  assert.deepEqual(shiftMonth({ year: 2026, month: 0 }, -1), { year: 2025, month: 11 });
  assert.deepEqual(shiftMonth({ year: 2026, month: 11 }, 1), { year: 2027, month: 0 });
});

test("week keys are Monday to Sunday", () => {
  const w = getWeekKeys("2026-10-11"); // Sunday
  assert.equal(w[0], "2026-10-05");
  assert.equal(w[6], "2026-10-11");
});

test("createEntry builds a valid entry and trims answers", () => {
  const e = createEntry(sample, new Date(2026, 9, 11, 8, 30));
  assert.ok(isValidEntry(e));
  assert.equal(e.date, "2026-10-11");
  assert.equal(e.answers.thoughts, "a");
});

test("two entries on one day get different ids and stay separate", () => {
  const a = createEntry(sample, new Date(2026, 9, 11, 8, 0));
  const b = createEntry(sample, new Date(2026, 9, 11, 9, 0));
  assert.notEqual(a.id, b.id);
  const grouped = groupByDate([b, a]);
  assert.equal(grouped.get("2026-10-11").length, 2);
  assert.equal(grouped.get("2026-10-11")[0].id, a.id); // oldest first
});

test("storage: round trip, corrupt JSON, wrong shape, invalid items", () => {
  const e = createEntry(sample);
  const s = fakeStorage();
  assert.equal(saveEntries([e], s), true);
  assert.deepEqual(loadEntries(s), [e]);
  assert.deepEqual(loadEntries(fakeStorage("{not json")), []);
  assert.deepEqual(loadEntries(fakeStorage('{"a":1}')), []);
  assert.deepEqual(loadEntries(fakeStorage(JSON.stringify([e, { id: 1 }, null]))), [e]);
});

test("storage: write failure returns false instead of throwing", () => {
  const full = { getItem: () => null, setItem: () => { throw new Error("QuotaExceeded"); } };
  assert.equal(saveEntries([], full), false);
});

test("emotion data: every primary has secondaries and each secondary has tertiaries", () => {
  for (const p of emotions) {
    assert.ok(p.secondary.length > 0, p.id);
    for (const s of p.secondary) assert.ok(s.tertiary.length > 0, s.id);
  }
});
