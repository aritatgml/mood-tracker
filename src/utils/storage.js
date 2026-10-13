import { isValidEntry } from "./entryUtils.js";

export const STORAGE_KEY = "mood.entries.v1";

/** Read entries. Never throws: bad or missing data gives an empty list. */
export function loadEntries(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

/** Write entries. Returns true on success, false if storage is unavailable/full. */
export function saveEntries(entries, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}
