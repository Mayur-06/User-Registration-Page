import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

export default function AppShell({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="min-h-screen bg-bg-panel font-body">
      <div className="flex h-screen w-full overflow-hidden">
        {/* Icon sidebar */}
        <aside className="flex w-16 shrink-0 flex-col items-center justify-between border-r border-border py-6">
            <div className="flex flex-col items-center gap-6">
                <div className="mb-2 h-9 w-9 rounded-lg bg-brand" />
                <SidebarIcon
                active={location.pathname === "/profile"}
                label="Profile"
                onClick={() => navigate("/profile")}
                >
                <GridIcon />
                </SidebarIcon>
                <SidebarIcon
                active={location.pathname === "/chat"}
                label="Chat"
                onClick={() => navigate("/chat")}
                >
                <ChatIcon />
                </SidebarIcon>
            </div>
              <button
    onClick={toggleTheme}
    title="Toggle theme"
    className="flex h-10 w-10 items-center justify-center rounded-lg text-text-faint transition-colors hover:bg-bg-muted hover:text-text-primary"
  >
    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
  </button>
</aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex shrink-0 items-center justify-between border-b border-border px-8 py-4">
            <div>
              <h1 className="font-display text-lg font-semibold text-text-primary">{title}</h1>
              {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-4">
              {/* <div className="rounded-lg border border-border bg-bg-page px-3 py-1.5 text-sm text-text-faint">
                Search
              </div> */}
              {/* <div className="h-9 w-9 rounded-full bg-brand/10" /> */}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarIcon({ children, active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
        active ? "bg-brand/10 text-brand" : "text-text-faint hover:bg-bg-muted hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 4h14v9H7l-4 4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M17 11.5A7 7 0 118.5 3a5.5 5.5 0 108.5 8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}