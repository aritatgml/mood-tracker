import Logo from "../ui/Logo.jsx";
import Navigation from "./Navigation.jsx";

export default function AppHeader({ view, onNavigate }) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Logo />
        <Navigation view={view} onNavigate={onNavigate} className="nav nav--top" label="Main" />
      </div>
    </header>
  );
}
