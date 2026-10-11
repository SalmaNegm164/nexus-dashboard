
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Users,
  ShoppingCart,
  Settings,
  ArrowUpRight,
  X,
} from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Analytics", icon: ChartNoAxesCombined },
  { label: "Customers", icon: Users },
  { label: "Orders", icon: ShoppingCart },
];

function Sidebar({
  activePage,
  setActivePage,
  menuOpen,
  setMenuOpen,
  transactionCount,
}) {
  return (
    <>
      {menuOpen && (
        <button
          type="button"
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">N</div>

          <div>
            <h2>Nexus</h2>
            <span>ANALYTICS PLATFORM</span>
          </div>

          <button
            type="button"
            className="icon-button close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className={`nav-item ${
                activePage === label ? "nav-active" : ""
              }`}
              onClick={() => {
                setActivePage(label);
                setMenuOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>

              {label === "Orders" && (
                <span className="nav-count">{transactionCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <h3>Unlock your insights</h3>

            <p>
              Explore your business performance with advanced analytics.
            </p>

            <button
              type="button"
              onClick={() => {
                setActivePage("Analytics");
                setMenuOpen(false);
              }}
            >
              Explore Analytics <ArrowUpRight size={15} />
            </button>
          </div>

          <button
            type="button"
            className={`nav-item ${
              activePage === "Settings" ? "nav-active" : ""
            }`}
            onClick={() => {
              setActivePage("Settings");
              setMenuOpen(false);
            }}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">SA</div>

            <div className="profile-info">
              <strong>Salma Ahmed</strong>
              <span>Administrator</span>
            </div>

            <button
              type="button"
              className="icon-button profile-menu"
              aria-label="Profile options"
              onClick={() => setActivePage("Settings")}
            >
              <Settings size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
