import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InteractiveSandbox } from './components/InteractiveSandbox';
import { SocialProofBar } from './components/SocialProofBar';
import { BentoArchitecture } from './components/BentoArchitecture';
import { AbsoluteContextGrounding } from './components/AbsoluteContextGrounding';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { CallToAction } from './components/CallToAction';
import { ChatPage } from './components/ChatPage';
import { ProfilePage } from './components/ProfilePage';
import { WatchDemoModal } from './components/Modals/WatchDemoModal';
import { AddContextModal } from './components/Modals/AddContextModal';
import { DocumentViewerModal } from './components/Modals/DocumentViewerModal';
import { AuthModal } from './components/Modals/AuthModal';
import { Footer } from './components/Footer';
import { INITIAL_CONTEXT_FILES } from './data/mockData';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, setUser, logout, loading } = useAuth();
  const [currentView, setCurrentViewState] = useState(() => {
    // Restore view from localStorage on mount, default to 'home'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastView') || 'home';
    }
    return 'home';
  });

  // Sync currentView to localStorage whenever it changes
  const setCurrentView = (view) => {
    setCurrentViewState(view);
    if (typeof window !== 'undefined') {
      if (view === 'home') {
        localStorage.removeItem('lastView');
      } else {
        localStorage.setItem('lastView', view);
      }
    }
  };

  const [contextFiles, setContextFiles] = useState(INITIAL_CONTEXT_FILES);

  // Modals state
  const [isWatchDemoOpen, setIsWatchDemoOpen] = useState(false);
  const [isAddContextOpen, setIsAddContextOpen] = useState(false);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050b14] text-[#f4f4f5]">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#1e293b] bg-[#08101d]/90 px-8 py-6 shadow-[0_0_30px_rgba(56,189,248,0.12)]">
          <Loader2 className="w-8 h-8 animate-spin text-[#38bdf8]" />
          <p className="text-sm font-medium text-[#e2e8f0]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleAddFile = (file) => {
    setContextFiles((prev) => [file, ...prev]);
  };

  const handleSelectCitation = (citation) => {
    setSelectedCitation(citation);
    setSelectedDocument(null);
    setIsDocViewerOpen(true);
  };

  const handleSelectDocument = (doc) => {
    setSelectedDocument(doc);
    setSelectedCitation(null);
    setIsDocViewerOpen(true);
  };

  const handleSelectPricingTier = (tierId) => {
    if (!user) {
      handleOpenAuth('signup');
    } else {
      setUser({ ...user, plan: tierId === 'enterprise' ? 'Enterprise' : 'Pro Canvas' });
    }
  };

  const handleOpenPricing = () => {
    setCurrentView('home');
    setTimeout(() => {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  // If in Chat Page mode
  if (currentView === 'chat') {
    return (
      <div className="min-h-screen bg-[#050b14] text-[#f4f4f5]">
        <ChatPage
          user={user}
          onNavigate={(view) => setCurrentView(view)}
          onOpenUpgradeModal={handleOpenPricing}
          onOpenAddContextModal={() => setIsAddContextOpen(true)}
          onSelectCitation={handleSelectCitation}
          onOpenAuth={handleOpenAuth}
        />

        <AddContextModal
          isOpen={isAddContextOpen}
          onClose={() => setIsAddContextOpen(false)}
          onAddFile={handleAddFile}
        />

        <DocumentViewerModal
          isOpen={isDocViewerOpen}
          onClose={() => setIsDocViewerOpen(false)}
          document={selectedDocument}
          citation={selectedCitation}
        />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          initialMode={authMode}
          onAuthSuccess={(u) => {
            setUser(u);
            setCurrentView('chat');
          }}
        />
      </div>
    );
  }

  // If in Profile Page mode
  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-[#050b14] text-[#f4f4f5]">
        <ProfilePage
          user={user}
          onUpdateUser={(updated) => setUser(updated)}
          onNavigate={(view) => setCurrentView(view)}
          onOpenUpgradeModal={handleOpenPricing}
        />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container/30 selection:text-primary-container">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view !== 'home') {
            const el = document.getElementById(view);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenAuth={handleOpenAuth}
        user={user}
        onLogout={logout}
      />

      <main className="flex-grow flex flex-col relative z-0">
        {/* 1. Hero Section */}
        <HeroSection
          onTryFree={() => {
            if (!user) {
              handleOpenAuth('signup');
            } else {
              setCurrentView('chat');
            }
          }}
          onWatchDemo={() => setIsWatchDemoOpen(true)}
        />

        {/* 2. Sandbox Interface Preview */}
        <InteractiveSandbox
          onOpenAddContext={() => setIsAddContextOpen(true)}
          onSelectCitation={handleSelectCitation}
          onSelectDocument={handleSelectDocument}
        />

        {/* 3. Empowering Workflows (Social Proof / Logo Bar) */}
        <SocialProofBar />

        {/* 4. Powerful Architecture Bento Grid */}
        <div id="features">
          <BentoArchitecture />
        </div>

        {/* 5. Absolute Context Grounding Split Inspector */}
        <AbsoluteContextGrounding />

        {/* 6. Transparent Pricing Matrix */}
        <PricingSection onSelectTier={handleSelectPricingTier} />

        {/* 7. Frequently Asked Questions */}
        <FAQSection />

        {/* 8. Call To Action Box */}
        <CallToAction
          onGetStarted={() => {
            if (!user) {
              handleOpenAuth('signup');
            } else {
              setCurrentView('chat');
            }
          }}
        />
      </main>

      {/* Footer */}
      <Footer onNavigate={(view) => setCurrentView(view)} />

      {/* Modals */}
      <WatchDemoModal
        isOpen={isWatchDemoOpen}
        onClose={() => setIsWatchDemoOpen(false)}
        onLaunchApp={() => setCurrentView('chat')}
      />

      <AddContextModal
        isOpen={isAddContextOpen}
        onClose={() => setIsAddContextOpen(false)}
        onAddFile={handleAddFile}
      />

      <DocumentViewerModal
        isOpen={isDocViewerOpen}
        onClose={() => setIsDocViewerOpen(false)}
        document={selectedDocument}
        citation={selectedCitation}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onAuthSuccess={(u) => {
          setUser(u);
          setCurrentView('chat');
        }}
      />
    </div>
  );
}
