import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const links = [
  { label: "Features", id: "features" },
  { label: "Pricing", id: "pricing" },
  { label: "FAQ", id: "faq" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
    return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-bg-panel/80 px-8 py-4 backdrop-blur-md">
      <div className="font-display text-lg font-bold text-text-primary">LucyChat</div>

      <div className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => scrollTo(l.id)}
            className="text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-faint hover:bg-bg-muted hover:text-text-primary"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
        <button
          onClick={() => navigate("/login")}
          className="rounded-lg px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-muted"
        >
          Log in
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Sign up
        </button>
      </div>
    </nav>
  );
}

