import React from 'react';
import { MagicBento } from './MagicBento';

export const BentoArchitecture = () => {
  return (
    <section id="features" className="py-12 md:py-24 px-4 md:px-10 max-w-[1440px] mx-auto text-center scroll-mt-20">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto mb-10 md:mb-14 space-y-4">
        {/* <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#08101d] border border-[#38bdf8]/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <span className="font-mono text-xs font-bold text-[#38bdf8] tracking-wider uppercase">
            POWERFUL ARCHITECTURE
          </span>
        </div> */}

        <h2
          className="text-3xl sm:text-4xl md:text-5xl text-[#f4f4f5] font-extrabold tracking-tight leading-tight"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Chat with Intelligence.
        </h2>

        <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed font-sans">
          Seamlessly extract knowledge from you context and reason for your need.
        </p>
      </div>

      {/* Magic Bento Interactive Grid */}
      <div className="w-full flex justify-center">
        <MagicBento
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={320}
          particleCount={10}
          glowColor="56, 189, 248"
        />
      </div>
    </section>
  );
};

export default BentoArchitecture;
