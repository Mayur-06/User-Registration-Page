import React, { useState } from 'react';
import { Menu, X, HelpCircle, MessageSquare, User, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({
  currentView = 'home',
  onNavigate,
  onOpenAuth,
  user: propUser,
  onLogout,
}) => {
  const { user: authUser, logout: authLogout } = useAuth();
  const user = authUser || propUser;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    if (onNavigate) {
      onNavigate(view);
    }
    if (view === 'faq' || view === 'features' || view === 'pricing' || view === 'docs') {
      const el = document.getElementById(view);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleAuthClick = (mode) => {
    if (onOpenAuth) {
      onOpenAuth(mode);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await authLogout();
    if (onLogout) onLogout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[color:var(--color-header)] backdrop-blur-md border-b border-[color:var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* 1. Left Section (Brand Logo) */}
        <div className="flex items-center">
          <button
            onClick={() => handleNavClick('home')}
            className="cursor-pointer"
            aria-label="LucyChat Home"
          >
            <Logo size="md" />
          </button>
        </div>

        {/* 2. Center Section (Navigation Links) */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            onClick={() => handleNavClick('features')}
            className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
              currentView === 'features'
                ? 'text-primary-container font-semibold'
                : 'text-on-surface-variant hover:text-on-background'
            }`}
          >
            Features
          </button>

          <button
            onClick={() => handleNavClick('pricing')}
            className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
              currentView === 'pricing'
                ? 'text-primary-container font-semibold'
                : 'text-on-surface-variant hover:text-on-background'
            }`}
          >
            Pricing
          </button>

          <button
            onClick={() => handleNavClick('docs')}
            className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
              currentView === 'docs'
                ? 'text-primary-container font-semibold'
                : 'text-on-surface-variant hover:text-on-background'
            }`}
          >
            Docs
          </button>

          <button
            onClick={() => handleNavClick('faq')}
            className={`text-sm font-medium transition-colors duration-200 cursor-pointer flex items-center gap-1.5 ${
              currentView === 'faq'
                ? 'text-primary-container font-semibold'
                : 'text-on-surface-variant hover:text-primary-container'
            }`}
            title="Everything you need to know"
          >
            <HelpCircle className="w-4 h-4 text-tertiary" />
            <span>FAQ</span>
            {/* <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#2fd9f4]/10 text-[#2fd9f4] border border-[#2fd9f4]/30 hidden lg:inline">
              Guide
            </span> */}
          </button>
        </nav>

        {/* 3. Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleNavClick('chat')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0e1726] border border-[#1e293b] hover:border-[#38bdf8]/50 text-xs font-semibold text-[#38bdf8] transition-all cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Chat</span>
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-full bg-[#08101d] border border-[#1e293b] hover:border-[#38bdf8]/60 transition-all cursor-pointer"
                title="Profile & Settings"
              >
                <img
                  src={
                    user.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={user.name || 'User'}
                  className="w-6 h-6 rounded-full object-cover border border-[#38bdf8]/40"
                />
                <span className="text-xs font-medium text-[#f4f4f5] max-w-[100px] truncate">
                  {user.name?.split(' ')[0] || 'Profile'}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-[#94a3b8] hover:text-rose-400 hover:bg-[#1a0e14] border border-transparent hover:border-rose-900/40 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleAuthClick('login')}
                className="text-[#94a3b8] hover:text-[#f4f4f5] px-4 py-2 text-sm font-medium rounded-xl border border-transparent hover:border-[#38bdf8]/40 active:border-[#38bdf8] hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] active:shadow-[0_0_20px_rgba(56,189,248,0.35)] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => handleAuthClick('signup')}
                className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-slate-950 font-bold px-4.5 py-2 rounded-xl text-sm border border-[#38bdf8]/50 shadow-[0_0_18px_rgba(56,189,248,0.35)] hover:shadow-[0_0_28px_rgba(56,189,248,0.6)] active:shadow-[0_0_35px_rgba(56,189,248,0.8)] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-[#f4f4f5] hover:bg-[#1e293b]/50 focus:outline-none transition-colors"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1e293b] bg-[#09090b]/95 backdrop-blur-xl px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleNavClick('features')}
              className="text-left text-base font-medium text-[#94a3b8] hover:text-[#f4f4f5] py-2 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className="text-left text-base font-medium text-[#94a3b8] hover:text-[#f4f4f5] py-2 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavClick('docs')}
              className="text-left text-base font-medium text-[#94a3b8] hover:text-[#f4f4f5] py-2 transition-colors"
            >
              Docs
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left text-base font-medium text-[#2fd9f4] py-2 transition-colors flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQ: Everything You Need to Know</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#1e293b] flex flex-col gap-2.5">
            {user ? (
              <>
                <button
                  onClick={() => handleNavClick('chat')}
                  className="w-full text-center bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-slate-950 font-bold py-2.5 rounded-xl text-sm"
                >
                  Open Chat
                </button>
                <button
                  onClick={() => handleNavClick('profile')}
                  className="w-full text-center text-slate-300 hover:text-white py-2.5 text-sm font-medium rounded-xl border border-[#1e293b]"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-center text-rose-400 hover:text-rose-300 py-2 text-xs"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAuthClick('login')}
                  className="w-full text-center text-slate-300 hover:text-white py-2.5 text-sm font-medium rounded-xl border border-[#1e293b] hover:border-[#38bdf8]/50 active:border-[#38bdf8] hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] active:scale-95 transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleAuthClick('signup')}
                  className="w-full text-center bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-slate-950 font-bold py-2.5 rounded-xl text-sm border border-[#38bdf8]/50 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.65)] active:scale-95 transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
