import { useCallback, useState } from "react";
import { emotions } from "../data/emotions.js";
import { emptyAnswers } from "../data/reflectionQuestions.js";

const emptyDraft = () => ({ primaryId: null, secondaryId: null, tertiary: null, answers: emptyAnswers() });

/**
 * The entry being written. Lives in App so it survives switching between the
 * Track and Calendar pages. Handles the "changing an earlier choice resets
 * later choices" rule in one place.
 */
export function useMoodDraft() {
  const [draft, setDraft] = useState(emptyDraft);

  const choosePrimary = useCallback((id) => {
    setDraft((d) => (d.primaryId === id ? d : { ...d, primaryId: id, secondaryId: null, tertiary: null }));
  }, []);
  const clearPrimary = useCallback(() => {
    setDraft((d) => ({ ...d, primaryId: null, secondaryId: null, tertiary: null }));
  }, []);
  const chooseSecondary = useCallback((id) => {
    setDraft((d) => (d.secondaryId === id ? d : { ...d, secondaryId: id, tertiary: null }));
  }, []);
  const chooseTertiary = useCallback((label) => setDraft((d) => ({ ...d, tertiary: label })), []);
  const setAnswer = useCallback((key, value) => {
    setDraft((d) => ({ ...d, answers: { ...d.answers, [key]: value } }));
  }, []);
  const reset = useCallback(() => setDraft(emptyDraft()), []);

  // Resolve ids to the emotion objects (null while not chosen).
  const primary = emotions.find((e) => e.id === draft.primaryId) ?? null;
  const secondary = primary?.secondary.find((s) => s.id === draft.secondaryId) ?? null;
  const tertiary = secondary?.tertiary.find((t) => t === draft.tertiary) ?? null;
  const isComplete = Boolean(primary && secondary && tertiary);

  return {
    draft, primary, secondary, tertiary, isComplete,
    choosePrimary, clearPrimary, chooseSecondary, chooseTertiary, setAnswer, reset,
  };
}
