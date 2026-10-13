# Mood tracker

React + Vite + plain CSS. No backend; entries live in `localStorage`.

## Run it
```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build into dist/
npm run test:utils   # unit tests for date/entry/storage helpers (no browser needed)
```

## Where things live
```
src/
  data/        emotions.js (emotion names) · emotionThemes.js (emotion colors)
               reflectionQuestions.js
  utils/       dateUtils.js (local-date helpers) · entryUtils.js (entry shape, validation)
               storage.js (safe localStorage read/write) · *.test.js
  hooks/       useMoodEntries.js (single source of truth: add/update/delete + persistence)
               useMoodDraft.js (the entry being written; reset rules) · useMediaQuery.js
  components/  ui/ (Button, Chip, Cloud, Dialog, TextAreaField, Logo)
               mood/ (EmotionPicker, ReflectionFields, EntryReview, EntryCard, EntryDetail …)
               calendar/ (CalendarGrid, DayEntries, WeekStrip) · layout/ (AppHeader, Navigation)
  pages/       TrackPage.jsx · CalendarPage.jsx
  styles/      tokens.css (colors + type scale from the style guide) · fonts.css (@font-face)
               base.css · layout.css · components.css
```

## Entry shape
```js
{ id, createdAt: "ISO timestamp", date: "YYYY-MM-DD" /* local day */,
  emotions: { primary, secondary, tertiary }, answers: { thoughts, needs, body } }
```
Stored under the key `mood.entries.v1`.

## Changing the style
Colors and text styles live in `src/styles/tokens.css`. Use a text style with `font: var(--type-title-1);`
and a color with `color: var(--color-link);`.
