import { useState } from "react";
import { useMoodEntries } from "./hooks/useMoodEntries.js";
import { useMoodDraft } from "./hooks/useMoodDraft.js";
import AppHeader from "./components/layout/AppHeader.jsx";
import Navigation from "./components/layout/Navigation.jsx";
import TrackPage from "./pages/TrackPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";

export default function App() {
  const [view, setView] = useState("track"); // "track" | "calendar"
  const [calendarDate, setCalendarDate] = useState(null); // day to open when the calendar mounts

  // One data source and one draft, shared by both pages.
  const { entriesByDate, addEntry, storageError } = useMoodEntries();
  const moodDraft = useMoodDraft();

  const openCalendar = (dateKey = null) => {
    setCalendarDate(dateKey);
    setView("calendar");
  };
  const navigate = (id) => (id === "calendar" ? openCalendar() : setView(id));

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <AppHeader view={view} onNavigate={navigate} />
      {storageError && (
        <p className="banner banner--error" role="alert">
          Your browser blocked saving, so new entries will be lost when you close this page. Check that private
          browsing is off and that storage is available.
        </p>
      )}
      <main id="main" className="app-main">
        {view === "track" ? (
          <TrackPage
            moodDraft={moodDraft}
            addEntry={addEntry}
            entriesByDate={entriesByDate}
            onViewInCalendar={openCalendar}
            onSelectDate={openCalendar}
          />
        ) : (
          <CalendarPage entriesByDate={entriesByDate} initialDate={calendarDate} onTrack={() => setView("track")} />
        )}
      </main>
      <Navigation view={view} onNavigate={navigate} className="nav nav--bottom" label="Main (mobile)" />
    </>
  );
}
