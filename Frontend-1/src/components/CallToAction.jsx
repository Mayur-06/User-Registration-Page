import React from 'react';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

export const CallToAction = ({ onGetStarted }) => {
  return (
    <section className="py-20 px-4 md:px-10 max-w-[1440px] mx-auto">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-[#081322] via-surface-variant to-background border border-outline-variant hover:border-primary-container/40 p-10 sm:p-16 text-center relative overflow-hidden shadow-[0_0_50px_rgba(56,189,248,0.1)] transition-all">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-36 bg-primary-container/15 blur-[90px] pointer-events-none" />

        {/* Decorative Grid Lines Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

        <div className="relative z-10 space-y-6 max-w-3xl mx-auto flex flex-col items-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-primary-container/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-primary-container" />
            <span className="font-mono text-xs font-bold text-primary-container tracking-wider uppercase">
              INSTANT KNOWLEDGE EXTRACTION
            </span>
          </div>

          {/* Heading */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl text-on-background font-extrabold tracking-tight leading-tight"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Start analyzing documents in seconds.
          </h2>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-sans">
            Join thousands of analysts, researchers, and engineering teams using LucyChat for deep multi-modal reasoning and verifiable answers.
          </p>

          {/* CTA Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-primary-container hover:bg-primary-container/90 text-slate-950 text-sm font-bold transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.65)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer group"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust Micro-Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-xs text-on-surface-variant font-mono">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary-container" />
              <span>No credit card required</span>
            </div>
            <span className="text-[#1e293b] hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-primary-container" />
              <span>SOC-2 Type II Certified</span>
            </div>
            <span className="text-[#1e293b] hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary-container" />
              <span>Free tier forever</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
