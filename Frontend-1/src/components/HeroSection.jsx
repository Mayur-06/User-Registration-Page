import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import LiquidEther from './LiquidEther';

export const HeroSection = ({ onTryFree, onWatchDemo }) => {
  return (
    <section className="relative pt-24 sm:pt-32 pb-16 px-4 md:px-10 overflow-hidden flex flex-col items-center text-center">
      {/* 1. LiquidEther Fluid Background (Interactive Deep Sea Cyber Flow) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-75" style={{ right: '-30%' }}>
        <LiquidEther
          colors={['#38bdf8', '#0284c7', '#818cf8', '#0ea5e9']}
          mouseForce={22}
          cursorSize={90}
          isViscous={false}
          viscous={25}
          resolution={0.55}
          autoDemo={true}
          autoSpeed={0.45}
          autoIntensity={2.0}
          takeoverDuration={0.25}
          autoResumeDelay={1500}
        />
        {/* Soft Radial Fade & Gradient Vignette Overlay to ensure perfect text contrast */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050b14]/50 to-[#050b14] pointer-events-none" />
        
        {/* Fade gradient extending to the right into the tab area */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050b14] pointer-events-none opacity-60" />
      </div>

      {/* 2. Content Container */}
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-6">
        {/* Top Live Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[color:var(--color-surface-variant)]/90 border border-[color:var(--color-primary)]/40 shadow-[0_0_20px_rgba(56,189,248,0.25)] backdrop-blur-md transition-all hover:border-[color:var(--color-primary)]/70 hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38bdf8]" />
          </span>
          <span className="font-mono text-xs font-semibold text-primary-container tracking-wide">
            LucyChat Engine v1.0 Live
          </span>
        </div>

        {/* Primary Headline */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-on-background leading-[1.1] tracking-tight max-w-4xl drop-shadow-sm"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Chat with anything.{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary-container via-[#2fd9f4] to-secondary bg-clip-text text-transparent">
            Text, Docs, Images.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-sans drop-shadow-sm">
          The premium AI canvas engineered for complex tasks. Seamlessly integrate your files, visualize data, and reason through vast information landscapes with unparalleled precision.
        </p>

        {/* Calls-to-Action (CTAs) */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-3 w-full sm:w-auto">
          {/* Primary CTA Button */}
          <button
            onClick={onTryFree}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Try for Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Secondary Ghost CTA Button */}
          <button
            onClick={onWatchDemo}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#09090b]/80 hover:bg-[#1e293b]/60 text-[#f4f4f5] border border-[#1e293b] hover:border-[#38bdf8]/40 backdrop-blur-md font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Play className="w-4 h-4 text-[#38bdf8] fill-[#38bdf8]/20" />
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Micro-copy beneath CTAs */}
        <p className="text-xs font-mono text-[#a1a1aa]/80 tracking-wide mt-1">
          No credit card required. Free tier available forever.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
