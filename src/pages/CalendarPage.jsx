import { useState } from "react";
import { parseDateKey, shiftMonth, todayKey } from "../utils/dateUtils.js";
import CalendarGrid from "../components/calendar/CalendarGrid.jsx";
import DayEntries from "../components/calendar/DayEntries.jsx";
import Dialog from "../components/ui/Dialog.jsx";
import EntryDetail from "../components/mood/EntryDetail.jsx";

const monthOf = (key) => {
  const d = parseDateKey(key) ?? new Date();
  return { year: d.getFullYear(), month: d.getMonth() };
};

export default function CalendarPage({ entriesByDate, initialDate, onTrack }) {
  const [selectedDate, setSelectedDate] = useState(initialDate ?? todayKey());
  const [visible, setVisible] = useState(() => monthOf(initialDate ?? todayKey()));
  const [openEntryId, setOpenEntryId] = useState(null);

  const dayEntries = entriesByDate.get(selectedDate) ?? [];
  const openEntry = dayEntries.find((e) => e.id === openEntryId) ?? null;

  const selectDate = (key) => {
    setSelectedDate(key);
    setVisible(monthOf(key)); // clicking a greyed-out day from a neighbouring month jumps there
  };

  return (
    <div className="page">
      <div className="page-title">
        <h1>Mood calendar</h1>
        <p>Pick a day to look back at how you felt.</p>
      </div>
      <div className="calendar-layout">
        <CalendarGrid
          year={visible.year}
          month={visible.month}
          selectedDate={selectedDate}
          entriesByDate={entriesByDate}
          onSelect={selectDate}
          onPrev={() => setVisible((v) => shiftMonth(v, -1))}
          onNext={() => setVisible((v) => shiftMonth(v, 1))}
          onToday={() => selectDate(todayKey())}
        />
        <DayEntries date={selectedDate} entries={dayEntries} onOpenEntry={setOpenEntryId} onTrack={onTrack} />
      </div>

      <Dialog open={Boolean(openEntry)} onClose={() => setOpenEntryId(null)} titleId="entry-dialog-title">
        {openEntry && <EntryDetail entry={openEntry} titleId="entry-dialog-title" onClose={() => setOpenEntryId(null)} />}
      </Dialog>
    </div>
  );
}
