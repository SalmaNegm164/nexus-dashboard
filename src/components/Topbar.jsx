
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
} from "lucide-react";

function Topbar({
  activePage,
  setMenuOpen,
  theme,
  toggleTheme,
  search,
  setSearch,
}) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-button mobile-menu"
        aria-label="Open menu"
        onClick={() => setMenuOpen(true)}
      >
        <Menu size={22} />
      </button>

      <div className="breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-divider">/</span>
        <strong>{activePage}</strong>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="icon-button theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          title={theme === "dark" ? "Light Mode" : "Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>

        <label className="search-box">
          <Search size={17} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search metrics..."
          />

          <kbd>⌘ K</kbd>
        </label>

        <button
          type="button"
          className="icon-button notification-button"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <div className="topbar-avatar">SA</div>
      </div>
    </header>
  );
}

export default Topbar;
