import React, { useState } from 'react';
import { FileText, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export const AbsoluteContextGrounding = () => {
  const [activeHighlight, setActiveHighlight] = useState('growth');

  return (
    <section id="docs" className="py-24 px-4 md:px-10 max-w-[1440px] mx-auto text-center scroll-mt-20">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#08101d] border border-[#38bdf8]/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <span className="font-mono text-xs font-bold text-[#38bdf8] tracking-wider uppercase">
            SPLIT-VIEW VERIFICATION
          </span>
        </div>

        <h2
          className="text-3xl sm:text-4xl md:text-5xl text-[#f4f4f5] tracking-tight font-extrabold"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Absolute Context Grounding
        </h2>
        <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed font-sans">
          Verify every claim. Our split-view inspector links AI synthesis directly to source material highlights.
        </p>
      </div>

      {/* Split-View Inspector Container */}
      <div className="max-w-5xl mx-auto bg-[#08101d] border border-[#1e293b] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.1)] text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#1e293b]">
          {/* Left Panel: LucyChat Analysis */}
          <div className="p-7 sm:p-9 flex flex-col justify-between bg-[#08101d] space-y-6">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1e293b]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#38bdf8] text-slate-950 flex items-center justify-center font-bold font-mono text-xs shadow-[0_0_10px_rgba(56,189,248,0.4)]">
                    L
                  </div>
                  <span className="text-sm font-bold text-[#f4f4f5]" style={{ fontFamily: 'Sora, sans-serif' }}>
                    LucyChat Synthesis
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/30">
                  Confidence 99.8%
                </span>
              </div>

              {/* Chat Message Text */}
              <div className="text-xs sm:text-sm text-[#f4f4f5] leading-relaxed space-y-4">
                <p>
                  Based on the Q3 fiscal report, the company experienced a{' '}
                  <span
                    onMouseEnter={() => setActiveHighlight('growth')}
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer inline-block ${
                      activeHighlight === 'growth'
                        ? 'bg-[#38bdf8]/30 text-[#38bdf8] border border-[#38bdf8] font-bold shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                        : 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold'
                    }`}
                  >
                    14% year-over-year growth in enterprise subscriptions
                  </span>
                  , driven primarily by the new security features.
                </p>

                <p>
                  However,{' '}
                  <span
                    onMouseEnter={() => setActiveHighlight('cost')}
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer inline-block ${
                      activeHighlight === 'cost'
                        ? 'bg-[#818cf8]/30 text-[#818cf8] border border-[#818cf8] font-bold shadow-[0_0_12px_rgba(129,140,248,0.35)]'
                        : 'bg-[#818cf8]/15 text-[#818cf8] border border-[#818cf8]/30 font-semibold'
                    }`}
                  >
                    operational costs increased by 8%
                  </span>{' '}
                  due to infrastructure scaling.
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-[#94a3b8] flex items-center gap-2 pt-4 border-t border-[#1e293b]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Hover highlights to inspect verified vector spans</span>
            </div>
          </div>

          {/* Right Panel: Source Material PDF Preview */}
          <div className="p-7 sm:p-9 flex flex-col justify-between bg-[#050b14] space-y-6">
            <div>
              {/* Document Header */}
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1e293b]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#818cf8]" />
                  <span className="text-xs sm:text-sm font-semibold text-[#f4f4f5]">
                    Q3_Fiscal_Report.pdf
                  </span>
                </div>
                <span className="text-xs font-mono text-[#94a3b8] bg-[#091424] px-2.5 py-0.5 rounded border border-[#1e293b]">
                  Page 12
                </span>
              </div>

              {/* Source Text Box */}
              <div className="bg-[#08101d] border border-[#1e293b] rounded-xl p-5 text-xs sm:text-sm leading-relaxed text-[#94a3b8] space-y-4">
                <p>
                  ...management noted that the strategic shift towards enterprise solutions yielded positive results. Specifically, we observed a{' '}
                  <span
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      activeHighlight === 'growth'
                        ? 'bg-[#38bdf8]/35 text-[#38bdf8] border border-[#38bdf8] font-bold shadow-[0_0_12px_rgba(56,189,248,0.35)] scale-[1.02]'
                        : 'bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30'
                    }`}
                  >
                    14% year-over-year growth in enterprise subscriptions
                  </span>{' '}
                  during the quarter.
                </p>

                <p>
                  To support this growth, significant investments were made in server architecture, resulting in{' '}
                  <span
                    className={`px-1.5 py-0.5 rounded transition-all ${
                      activeHighlight === 'cost'
                        ? 'bg-[#818cf8]/35 text-[#818cf8] border border-[#818cf8] font-bold shadow-[0_0_12px_rgba(129,140,248,0.35)] scale-[1.02]'
                        : 'bg-[#818cf8]/15 text-[#818cf8] border border-[#818cf8]/30'
                    }`}
                  >
                    operational costs increasing by 8%
                  </span>{' '}
                  compared to the previous period...
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-[#38bdf8] flex items-center justify-between pt-2 border-t border-[#1e293b]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Grounding: 100% Verified</span>
              </span>
              <span className="text-[#64748b]">Chunk: [pg12_c8]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AbsoluteContextGrounding;
