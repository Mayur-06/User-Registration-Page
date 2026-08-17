import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import logoImg from "@/assets/logo.png";

const links = [
  { label: "Features", id: "features" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollTo(id) {
  setMenuOpen(false);
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  });
}

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg-panel/80 backdrop-blur-md">
      <div className="grid grid-cols-2 items-center px-4 py-4 sm:px-8 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="Logo" className="h-8 w-8" />
          <span className="font-display text-lg font-bold text-text-primary">LucyChat</span>
        </div>

        <div className="hidden items-center justify-center gap-8 md:flex">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-sm font-medium text-text-muted hover:text-text-primary"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center justify-end gap-3 md:flex">
          <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg text-text-faint hover:bg-bg-muted hover:text-text-primary">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button onClick={() => navigate("/login")} className="rounded-lg px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-muted">
            Log in
          </button>
          <button onClick={() => navigate("/signup")} className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
            Sign up
          </button>
        </div>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center justify-self-end rounded-lg text-text-primary md:hidden"
        >
          {menuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-border px-4 py-4 md:hidden">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-text-muted hover:bg-bg-muted"
            >
              {l.label}
            </button>
          ))}
          <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
            <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-lg text-text-faint hover:bg-bg-muted">
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => navigate("/login")} className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-muted">
              Log in
            </button>
            <button onClick={() => navigate("/signup")} className="flex-1 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
              Sign up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function SunIcon() { return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function MoonIcon() { return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M17 11.5A7 7 0 118.5 3a5.5 5.5 0 108.5 8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>; }
function MenuIcon() { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }
function XIcon() { return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }