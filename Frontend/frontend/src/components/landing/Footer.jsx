export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-muted px-8 py-10 text-center text-[13px] text-text-faint">
      © {new Date().getFullYear()} LucyChat. All rights reserved.
    </footer>
  );
}