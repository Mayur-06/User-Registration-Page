import React from 'react';
import { FileText, Eye, Code, Cpu, Sparkles, ArrowRight } from 'lucide-react';

export const FeaturesSection = ({ onTryCanvas }) => {
  const features = [
    {
      icon: FileText,
      color: '#ffb4ab',
      badge: 'Multi-Modal RAG',
      title: 'Deep Document Q&A & Citation Grounding',
      description:
        'Upload lengthy multi-hundred-page PDFs, technical manuals, and legal contracts. LucyChat extracts precise liability clauses, SLA definitions, and financial terms with pinpoint page-level citations.',
      codePreview: 'Pg. 12, Sec 4.2 • Liability Uncapped for PII breach',
    },
    {
      icon: Eye,
      color: '#818cf8',
      badge: 'Spatial Grounding',
      title: 'Visual Chart & Diagram Inspection',
      description:
        'Reason across financial charts, system schematics, and UI mocks. LucyChat pinpoints exact pixel bounding boxes to highlight trends, detect outliers, and quantify metrics with mathematical rigor.',
      codePreview: 'Bounding Box [x: 210, y: 25, w: 40, h: 75] • 15% MoM ARR',
    },
    {
      icon: Code,
      color: '#2fd9f4',
      badge: 'Code Engine',
      title: 'Polyglot Code Synthesis & Live Sandboxing',
      description:
        'Generate production-grade Python, TypeScript, SQL, and Rust. LucyChat executes data transformation pipelines directly in virtual sandboxes to verify outputs before deployment.',
      codePreview: 'def csv_to_json(csv_path): return list(csv.DictReader(f))',
    },
    {
      icon: Cpu,
      color: '#bdc2ff',
      badge: 'Sub-40ms Vector Lane',
      title: 'High-Precision Vector Reasoning Architecture',
      description:
        'Engineered on low-latency transformer inference with dynamic token pruning. Reason over 2,000,000+ context tokens with unprecedented speed and zero factual drift.',
      codePreview: '2M+ Token Window • 99.8% Needle-in-a-Haystack Recall',
    },
  ];

  return (
    <section id="features" className="py-24 px-4 md:px-10 max-w-[1440px] mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#818cf8]/10 text-[#818cf8] text-xs font-mono border border-[#818cf8]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#2fd9f4]" />
          <span>Core Capabilities</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#d4e4fa] tracking-tight"
          style={{ fontFamily: 'Sora' }}
        >
          Engineered for analytical precision.
        </h2>
        <p className="text-[#c6c5d5] text-base sm:text-lg leading-relaxed">
          From complex 100-page enterprise Master Service Agreements to multi-variate financial bar charts, LucyChat delivers verifiable intelligence.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <div
              key={index}
              className="glass-panel p-8 rounded-2xl border border-[#273647] hover:border-[#818cf8]/50 transition-all group relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Row */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{
                      backgroundColor: `${feat.color}15`,
                      borderColor: `${feat.color}40`,
                      color: feat.color,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className="text-xs font-mono px-3 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${feat.color}10`,
                      borderColor: `${feat.color}30`,
                      color: feat.color,
                    }}
                  >
                    {feat.badge}
                  </span>
                </div>

                <h3
                  className="text-xl sm:text-2xl font-bold text-[#d4e4fa] mb-3 group-hover:text-[#818cf8] transition-colors"
                  style={{ fontFamily: 'Sora' }}
                >
                  {feat.title}
                </h3>
                <p className="text-sm sm:text-base text-[#c6c5d5] leading-relaxed mb-6">
                  {feat.description}
                </p>
              </div>

              {/* Code / Visual Pill preview */}
              <div className="bg-[#051424] p-3 rounded-lg border border-[#273647] font-mono text-xs text-[#2fd9f4] flex items-center justify-between">
                <span className="truncate">{feat.codePreview}</span>
                <span className="text-[10px] text-[#818cf8] ml-2 shrink-0">VERIFIED</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Bottom Banner */}
      <div className="mt-16 glass-panel-elevated p-8 sm:p-12 rounded-2xl border border-[#454653] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#d4e4fa]" style={{ fontFamily: 'Sora' }}>
            Ready to experience the AI Canvas?
          </h3>
          <p className="text-sm sm:text-base text-[#c6c5d5]">
            Attach your own PDF contracts, financial charts, or code repositories in seconds.
          </p>
        </div>
        <button
          onClick={onTryCanvas}
          className="px-8 py-3.5 rounded-xl bg-[#818cf8] text-[#101b8a] font-bold font-mono text-sm hover:bg-[#818cf8]/90 hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(129,140,248,0.4)] shrink-0 cursor-pointer flex items-center gap-2"
        >
          <span>Launch AI Canvas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default FeaturesSection;
