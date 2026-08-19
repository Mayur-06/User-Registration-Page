import React, { useState } from 'react';
import { Logo } from './Logo';
import { Mail, MessageSquare, Send, CheckCircle2, ArrowUp, Github, Disc as Discord, Twitter } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background border-t border-outline-variant pt-12 pb-10 px-4 md:px-10 mt-10 relative overflow-hidden">
      {/* Subtle ambient bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-primary-container/5 blur-[80px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Main Focused Row: Subscribe & Direct Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-surface border border-outline-variant rounded-2xl p-6 sm:p-8 text-left shadow-lg">
          {/* Left Column: Subscribe */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Logo
                size="sm"
                onClick={() => onNavigate && onNavigate('home')}
                className="cursor-pointer"
              />
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm">
              Subscribe to model releases, benchmark updates, and multi-modal engine changelogs.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2 pt-1 max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (subscribed) setSubscribed(false);
                }}
                placeholder="engineer@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-outline-variant focus:border-primary-container text-xs text-on-background placeholder-[#64748b] outline-none transition-colors font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Contact & Quick Channels */}
          <div className="md:border-l md:border-[#1e293b] md:pl-8 space-y-3">
            <h4 className="font-mono text-xs font-bold text-[#f4f4f5] tracking-wider uppercase">
              Get in Touch
            </h4>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Have questions or need a custom enterprise SLA? Reach out directly.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {/* Direct Mail */}
              <a
                href="mailto:contact@lucychat.ai"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background border border-outline-variant hover:border-primary-container/50 text-xs text-on-background font-medium transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-primary-container" />
                <span>contact@lucychat.ai</span>
              </a>

              {/* Discord */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#050b14] border border-[#1e293b] hover:border-[#38bdf8]/50 text-xs text-[#f4f4f5] font-medium transition-all"
              >
                <Discord className="w-3.5 h-3.5 text-[#818cf8]" />
                <span>Discord</span>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#050b14] border border-[#1e293b] hover:border-[#38bdf8]/50 text-xs text-[#f4f4f5] font-medium transition-all"
              >
                <Github className="w-3.5 h-3.5 text-[#94a3b8]" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748b] pt-2">
          <div className="flex items-center gap-3">
            <span>© 2024 LucyChat AI. All rights reserved.</span>
            <span className="text-[#1e293b]">•</span>
            <span className="text-emerald-400">All Systems Operational</span>
          </div>

          <button
            onClick={scrollToTop}
            className="px-3 py-1.5 rounded-lg bg-[#08101d] border border-[#1e293b] hover:border-[#38bdf8]/50 text-[#94a3b8] hover:text-[#38bdf8] transition-all cursor-pointer flex items-center gap-1.5 text-[11px]"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
