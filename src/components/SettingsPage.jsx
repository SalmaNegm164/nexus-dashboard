
import { useState } from "react";
import {
  UserRound,
  Palette,
  Bell,
  Globe,
  ShieldCheck,
  Save,
  RotateCcw,
  Mail,
  LockKeyhole,
  Monitor,
  Moon,
  Sun,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";

const initialSettings = {
  fullName: "Salma Ahmed",
  email: "salma@example.com",
  role: "Administrator",
  language: "English",
  currency: "USD",
  timezone: "Africa/Cairo",
  theme: "dark",
  emailNotifications: true,
  orderNotifications: true,
  salesNotifications: false,
  weeklyReports: true,
  twoFactor: false,
};

const sections = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "regional", label: "Regional", icon: Globe },
  { id: "security", label: "Security", icon: ShieldCheck },
];

function SettingsPage({ theme, onThemeChange }) {
  const [settings, setSettings] = useState(() => ({
    ...initialSettings,
    theme: theme || initialSettings.theme,
  }));

  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);

    if (key === "theme") {
      onThemeChange(value);
    }
  };

  const resetSettings = () => {
    setSettings({ ...initialSettings });
    onThemeChange(initialSettings.theme);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setSaved(false);
    setActiveSection("profile");
  };

  const saveSettings = () => {
    if (password && password !== confirmPassword) {
      window.alert("Passwords do not match.");
      return;
    }

    if (password) {
      window.alert(
        "Settings are saved for this session, but changing your real account password requires a connected authentication service."
      );
    }

    setSaved(true);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);

    document.getElementById(`settings-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="settings-page">
      <header className="settings-header">
        <div>
          <div className="settings-eyebrow">
            <span className="settings-eyebrow-dot" />
            WORKSPACE PREFERENCES
          </div>

          <h1>Settings</h1>

          <p>
            Manage your account, customize your workspace, and control
            your preferences.
          </p>
        </div>

        <div className="settings-header-badge">
          <ShieldCheck size={17} />
          <span>Account preferences</span>
        </div>
      </header>

      <section className="settings-profile-banner">
        <div className="settings-profile-avatar">
          {settings.fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "SA"}
          <span className="settings-avatar-status" />
        </div>

        <div className="settings-profile-summary">
          <h2>{settings.fullName || "Your name"}</h2>
          <p>{settings.email || "Add your email address"}</p>
          <span className="settings-role-badge">
            <ShieldCheck size={13} />
            {settings.role}
          </span>
        </div>

        <div className="settings-profile-meta">
          <span>ACCOUNT STATUS</span>
          <strong>
            <i />
            Active
          </strong>
        </div>
      </section>

      <div className="settings-layout">
        <aside className="settings-navigation">
          <div className="settings-nav-heading">GENERAL SETTINGS</div>

          {sections.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={`settings-nav-item ${
                activeSection === id ? "settings-nav-active" : ""
              }`}
              onClick={() => scrollToSection(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight
                size={15}
                className="settings-nav-chevron"
              />
            </button>
          ))}

          <div className="settings-nav-tip">
            <div className="settings-tip-icon">
              <ShieldCheck size={18} />
            </div>
            <strong>Your workspace, your way.</strong>
            <p>
              Personalize your dashboard to fit your workflow.
            </p>
          </div>
        </aside>

        <div className="settings-content">
          {/* Profile */}
          <section
            className="settings-card"
            id="settings-profile"
          >
            <div className="settings-card-heading">
              <div className="settings-section-icon settings-blue">
                <UserRound size={19} />
              </div>

              <div>
                <h3>Profile Information</h3>
                <p>
                  Update your personal details and account information.
                </p>
              </div>
            </div>

            <div className="settings-form-grid">
              <label className="settings-field settings-field-full">
                <span>Full name</span>
                <div className="settings-input-wrap">
                  <UserRound size={17} />
                  <input
                    value={settings.fullName}
                    onChange={(e) =>
                      updateSetting("fullName", e.target.value)
                    }
                    placeholder="Enter your full name"
                  />
                </div>
              </label>

              <label className="settings-field settings-field-full">
                <span>Email address</span>
                <div className="settings-input-wrap">
                  <Mail size={17} />
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      updateSetting("email", e.target.value)
                    }
                    placeholder="Enter your email"
                  />
                </div>
              </label>
            </div>

            <div className="settings-inline-note">
              <ShieldCheck size={16} />
              Your profile information is used to personalize your dashboard.
            </div>
          </section>

          {/* Appearance */}
          <section
            className="settings-card"
            id="settings-appearance"
          >
            <div className="settings-card-heading">
              <div className="settings-section-icon settings-purple">
                <Palette size={19} />
              </div>

              <div>
                <h3>Appearance</h3>
                <p>Choose how your dashboard looks and feels.</p>
              </div>
            </div>

            <div className="settings-subheading">
              <strong>Interface theme</strong>
              <span>Select your preferred appearance</span>
            </div>

            <div className="settings-theme-options">
              <button
                type="button"
                className={`settings-theme-option ${
                  settings.theme === "dark"
                    ? "settings-theme-selected"
                    : ""
                }`}
                onClick={() => updateSetting("theme", "dark")}
                aria-pressed={settings.theme === "dark"}
              >
                <div className="settings-theme-preview settings-preview-dark">
                  <div className="settings-preview-sidebar" />
                  <div className="settings-preview-content">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>

                <div className="settings-theme-label">
                  <Moon size={16} />
                  <span>Dark mode</span>
                  {settings.theme === "dark" && <Check size={16} />}
                </div>
              </button>

              <button
                type="button"
                className={`settings-theme-option ${
                  settings.theme === "light"
                    ? "settings-theme-selected"
                    : ""
                }`}
                onClick={() => updateSetting("theme", "light")}
                aria-pressed={settings.theme === "light"}
              >
                <div className="settings-theme-preview settings-preview-light">
                  <div className="settings-preview-sidebar" />
                  <div className="settings-preview-content">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>

                <div className="settings-theme-label">
                  <Sun size={16} />
                  <span>Light mode</span>
                  {settings.theme === "light" && <Check size={16} />}
                </div>
              </button>
            </div>

            <div className="settings-inline-note">
              <Monitor size={16} />
              Your selected theme is applied across the dashboard instantly.
            </div>
          </section>

          {/* Notifications */}
          <section
            className="settings-card"
            id="settings-notifications"
          >
            <div className="settings-card-heading">
              <div className="settings-section-icon settings-orange">
                <Bell size={19} />
              </div>

              <div>
                <h3>Notifications</h3>
                <p>Choose which updates you want to receive.</p>
              </div>
            </div>

            <div className="settings-toggle-list">
              <ToggleRow
                title="Email notifications"
                description="Receive important account updates by email."
                checked={settings.emailNotifications}
                onChange={(value) =>
                  updateSetting("emailNotifications", value)
                }
              />

              <ToggleRow
                title="Order updates"
                description="Get notified when an order is created or updated."
                checked={settings.orderNotifications}
                onChange={(value) =>
                  updateSetting("orderNotifications", value)
                }
              />

              <ToggleRow
                title="Sales alerts"
                description="Stay informed about important sales activity."
                checked={settings.salesNotifications}
                onChange={(value) =>
                  updateSetting("salesNotifications", value)
                }
              />

              <ToggleRow
                title="Weekly reports"
                description="Receive a weekly summary of your performance."
                checked={settings.weeklyReports}
                onChange={(value) =>
                  updateSetting("weeklyReports", value)
                }
              />
            </div>
          </section>

          {/* Regional Preferences */}
          <section
            className="settings-card"
            id="settings-regional"
          >
            <div className="settings-card-heading">
              <div className="settings-section-icon settings-green">
                <Globe size={19} />
              </div>

              <div>
                <h3>Regional Preferences</h3>
                <p>Configure the language, currency, and timezone.</p>
              </div>
            </div>

            <div className="settings-form-grid">
              <label className="settings-field">
                <span>Language</span>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    updateSetting("language", e.target.value)
                  }
                >
                  <option value="English">English</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </label>

              <label className="settings-field">
                <span>Display currency</span>
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    updateSetting("currency", e.target.value)
                  }
                >
                  <option value="USD">USD — US Dollar</option>
                  <option value="EGP">EGP — Egyptian Pound</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="SAR">SAR — Saudi Riyal</option>
                  <option value="AED">AED — UAE Dirham</option>
                </select>
              </label>

              <label className="settings-field settings-field-full">
                <span>Timezone</span>
                <select
                  value={settings.timezone}
                  onChange={(e) =>
                    updateSetting("timezone", e.target.value)
                  }
                >
                  <option value="Africa/Cairo">
                    Africa/Cairo (Cairo)
                  </option>
                  <option value="Asia/Riyadh">
                    Asia/Riyadh (Riyadh)
                  </option>
                  <option value="Asia/Dubai">
                    Asia/Dubai (Dubai)
                  </option>
                  <option value="Europe/London">
                    Europe/London (London)
                  </option>
                  <option value="America/New_York">
                    America/New_York (New York)
                  </option>
                </select>
              </label>
            </div>
          </section>

          {/* Security */}
          <section
            className="settings-card"
            id="settings-security"
          >
            <div className="settings-card-heading">
              <div className="settings-section-icon settings-red">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h3>Security</h3>
                <p>Manage your password and account protection.</p>
              </div>
            </div>

            <div className="settings-security-heading">
              <div className="settings-security-symbol">
                <LockKeyhole size={20} />
              </div>

              <div>
                <strong>Change password</strong>
                <p>Enter a new password below.</p>
              </div>
            </div>

            <div className="settings-form-grid">
              <label className="settings-field">
                <span>New password</span>
                <div className="settings-input-wrap">
                  <LockKeyhole size={17} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="settings-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </label>

              <label className="settings-field">
                <span>Confirm password</span>
                <div className="settings-input-wrap">
                  <LockKeyhole size={17} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                </div>
              </label>
            </div>

            <div className="settings-inline-note">
              <ShieldCheck size={16} />
              Changing a real account password requires a connected backend
              authentication service.
            </div>

            <div className="settings-toggle-list settings-security-toggle">
              <ToggleRow
                title="Two-factor authentication"
                description="Enable an additional verification step when signing in."
                checked={settings.twoFactor}
                onChange={(value) => updateSetting("twoFactor", value)}
              />
            </div>
          </section>

          {/* Save Actions */}
          <div className="settings-save-bar">
            <div className="settings-save-message" aria-live="polite">
              {saved ? (
                <>
                  <Check size={17} />
                  <span>Changes saved in this session</span>
                </>
              ) : (
                <span>Your changes have not been saved yet.</span>
              )}
            </div>

            <div className="settings-save-actions">
              <button
                type="button"
                className="settings-reset-button"
                onClick={resetSettings}
              >
                <RotateCcw size={16} />
                Reset
              </button>

              <button
                type="button"
                className="settings-save-button"
                onClick={saveSettings}
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="settings-toggle-row">
      <div className="settings-toggle-copy">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className={`settings-switch ${
          checked ? "settings-switch-on" : ""
        }`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

export default SettingsPage;
