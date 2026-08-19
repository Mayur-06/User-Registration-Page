import React from 'react';
import { Cpu, Shield, Sparkles, Database, Layers } from 'lucide-react';

export const SocialProofBar = () => {
  const partners = [
    { name: 'NEXUS RESEARCH', icon: Sparkles },
    { name: 'APEX LEGAL CORP', icon: Shield },
    { name: 'CYBER SCALE', icon: Cpu },
    { name: 'SYNAPSE LABS', icon: Database },
    { name: 'VECTOR DYNAMICS', icon: Layers },
  ];

  return (
    <section className="py-12 px-4 md:px-10 max-w-[1440px] mx-auto text-center border-t border-b border-outline-variant my-8">
      <p className="font-mono text-xs tracking-[0.2em] text-on-surface-variant uppercase mb-8">
        EMPOWERING WORKFLOWS ACROSS RESEARCH, LAW, AND ENGINEERING
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-80 hover:opacity-100 transition-opacity">
        {partners.map((partner, idx) => {
          const Icon = partner.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-surface border border-outline-variant hover:border-primary-container/50 hover:bg-surface-variant transition-all group"
            >
              <Icon className="w-4 h-4 text-primary-container group-hover:scale-110 transition-transform" />
              <span className="font-mono text-xs font-semibold text-on-background tracking-wider">
                {partner.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SocialProofBar;
