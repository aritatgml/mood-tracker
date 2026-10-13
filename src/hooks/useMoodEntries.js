import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STORAGE_KEY, loadEntries, saveEntries } from "../utils/storage.js";
import { createEntry, groupByDate } from "../utils/entryUtils.js";

/**
 * The single source of truth for saved mood entries.
 * Call it ONCE (in App) and pass the result down, so the tracker and the
 * calendar always read the same data.
 */
export function useMoodEntries() {
  const [entries, setEntries] = useState(() => loadEntries());
  const [storageError, setStorageError] = useState(false);
  const isFirstRender = useRef(true);

  // Persist whenever entries change (skip the initial load).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setStorageError(!saveEntries(entries));
  }, [entries]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) setEntries(loadEntries());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addEntry = useCallback((draft) => {
    const entry = createEntry(draft);
    setEntries((prev) => [...prev, entry]); // always appends: never overwrites
    return entry;
  }, []);

  // Not used by the UI yet (edit/delete are out of scope for v1) but ready for later.
  const updateEntry = useCallback((id, changes) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...changes, id: e.id } : e)));
  }, []);
  const deleteEntry = useCallback((id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const entriesByDate = useMemo(() => groupByDate(entries), [entries]);

  return { entries, entriesByDate, addEntry, updateEntry, deleteEntry, storageError };
}
