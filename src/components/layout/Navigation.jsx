import calendarIcon from "../../assets/icons/Calendar.svg";
import goodIcon from "../../assets/icons/Good.svg";

const items = [
  {
    id: "track",
    label: "Track mood",
    icon: goodIcon,
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: calendarIcon,
  },
];

/** One list of links, styled as a top nav on wide screens and a bottom tab bar on phones. */
export default function Navigation({ view, onNavigate, className, label }) {
  return (
    <nav className={className} aria-label={label}>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="nav-link"
              aria-current={view === item.id ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
            >
              <img src={item.icon} alt="" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}