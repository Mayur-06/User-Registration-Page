import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Eye,
  Code2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Logo } from '../Logo';

export const WatchDemoModal = ({ isOpen, onClose, onLaunchApp }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const demoScenarios = [
    {
      id: 'doc-qa',
      title: '1. Document Reasoning & Section Citations',
      shortLabel: 'Document Q&A',
      tag: 'Legal & Compliance RAG',
      icon: FileText,
      color: '#38bdf8',
      userPrompt: 'Can you extract the key liabilities from Contract_v3.pdf?',
      aiResponse: 'Based on **Contract_v3.pdf**, here are the primary liabilities outlined in Section 4:',
      bullets: [
        { label: 'Indemnification:', text: 'Party A holds liability for third-party IP claims up to $1M.' },
        { label: 'Data Breach:', text: 'Liability is uncapped for gross negligence regarding PII data handling.' },
      ],
      citation: {
        label: 'Pg. 12, Sec 4.2',
        source: 'Contract_v3.pdf',
        detail: 'Section 4.2: In the event of a Security Incident or data breach of PII, liability is uncapped.',
      },
      badgeText: '99.8% Grounding Precision',
    },
    {
      id: 'vision-grounding',
      title: '2. Multi-Modal Vision & OCR Spatial Grounding',
      shortLabel: 'Visual Analysis',
      tag: 'BioTech & Financial Charts',
      icon: Eye,
      color: '#818cf8',
      userPrompt: 'Inspect Q3_Chart.png: Identify peak revenue acceleration and highlight outlier coordinates.',
      aiResponse: 'Analyzing **Q3_Chart.png** with multi-modal visual OCR coordinates:',
      boundingBoxData: {
        label: 'Peak Revenue: $450k ARR (September)',
        metric: '+15.4% MoM Acceleration',
        accuracy: 'Coordinates: [x: 420, y: 110, w: 220, h: 90]',
      },
      badgeText: 'Sub-Pixel OCR Precision',
    },
    {
      id: 'code-exec',
      title: '3. Python Code Execution & Data Synthesis',
      shortLabel: 'Code Sandbox',
      tag: 'Developer Workflows',
      icon: Code2,
      color: '#2fd9f4',
      userPrompt: 'Write a Python script to parse a CSV into JSON with clean formatting.',
      aiResponse: 'Here is a clean Python script using standard modules for high throughput:',
      codeSnippet: `import csv, json

def parse_csv_stream(csv_path, json_path):
    with open(csv_path, 'r', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(rows, f, indent=2)
    return len(rows)`,
      codeFooter: 'Validated: In-memory streaming benchmark completed in 12ms.',
      badgeText: 'Verified Code Execution',
    },
    {
      id: 'zero-retention',
      title: '4. Enterprise Zero-Retention Security',
      shortLabel: 'Zero Retention',
      tag: 'SOC-2 / HIPAA Ready',
      icon: ShieldCheck,
      color: '#34d399',
      userPrompt: 'Is my proprietary financial data stored or used for foundation model training?',
      aiResponse: 'Zero data retention is mathematically enforced at the infrastructure gateway:',
      bullets: [
        { label: 'Volatile RAM Only:', text: 'Documents and embeddings exist strictly in encrypted memory during reasoning.' },
        { label: 'Zero Model Training:', text: 'Your proprietary data is never used to train or fine-tune public foundation weights.' },
      ],
      badgeText: 'Zero-Data-Retention Enforced',
    },
  ];

  // Auto-play timer
  useEffect(() => {
    let interval;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % demoScenarios.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, demoScenarios.length]);

  if (!isOpen) return null;

  const current = demoScenarios[activeStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#08101d] border border-[#1e293b] rounded-2xl w-full max-w-4xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(56,189,248,0.15)] flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-[#050b14] px-5 sm:px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-[#f4f4f5]" style={{ fontFamily: 'Sora, sans-serif' }}>
                  LucyChat Interactive Product Demo
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 hidden sm:inline">
                  Live v2.4
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">
                Explore how LucyChat analyzes documents, images, and code in real time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f4f4f5] hover:bg-[#1e293b] transition-colors cursor-pointer"
            aria-label="Close demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Selector Pills */}
        <div className="bg-[#060c16] px-4 py-2.5 border-b border-[#1e293b] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {demoScenarios.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = idx === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStep(idx);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#15273e] text-[#38bdf8] border border-[#38bdf8]/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                    : 'text-[#94a3b8] hover:text-[#f4f4f5] hover:bg-[#0e1928] border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Main Simulated Interactive Sandbox Screen */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#050b14]">
          <div className="rounded-xl bg-[#091424] border border-[#1a2b40] overflow-hidden shadow-xl flex flex-col">
            {/* macOS Chrome Header inside Demo */}
            <div className="bg-[#050b14] px-4 py-2.5 border-b border-[#1a2b40] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <span className="text-[11px] font-mono text-[#64748b] ml-2">{current.tag}</span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/20">
                <Sparkles className="w-3 h-3" />
                <span>{current.badgeText}</span>
              </div>
            </div>

            {/* Content Display */}
            <div className="p-4 sm:p-5 space-y-4">
              {/* User Query Box */}
              <div className="flex justify-end">
                <div className="max-w-[90%] bg-[#152336] border border-[#253952] rounded-2xl rounded-tr-sm p-3 sm:p-4 text-xs sm:text-sm text-[#f4f4f5] shadow-md">
                  <p className="font-sans font-medium">{current.userPrompt}</p>
                </div>
              </div>

              {/* AI Response Box */}
              <div className="flex gap-3 justify-start items-start">
                <div className="shrink-0 mt-1">
                  <Logo size="sm" showText={false} />
                </div>
                <div className="flex-1 bg-[#070e1a] border border-[#1a2b40] rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm text-[#d4e4fa] space-y-3 shadow-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-[#152336]">
                    <span className="font-bold text-[#f4f4f5] text-xs">LucyChat AI Engine</span>
                    <span className="font-mono text-[10px] text-[#38bdf8]">Latency: 18ms</span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed">{current.aiResponse}</p>

                  {/* Bullet points if available */}
                  {current.bullets && (
                    <ul className="space-y-1.5 pl-2">
                      {current.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <span className="text-[#38bdf8] font-bold">•</span>
                          <div>
                            <strong className="text-[#f4f4f5] font-semibold">{b.label} </strong>
                            <span className="text-[#94a3b8]">{b.text}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Document Citation Highlight Pill */}
                  {current.citation && (
                    <div className="p-3 rounded-xl bg-[#091424] border border-[#38bdf8]/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 text-[#38bdf8] font-mono text-[11px] font-semibold">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Source Verified: {current.citation.label}</span>
                        </div>
                        <span className="text-[10px] text-[#64748b] font-mono">{current.citation.source}</span>
                      </div>
                      <p className="text-[11px] text-[#94a3b8] italic bg-[#050b14] p-2 rounded border border-[#1a2b40]">
                        "{current.citation.detail}"
                      </p>
                    </div>
                  )}

                  {/* Vision Bounding Box Highlight */}
                  {current.boundingBoxData && (
                    <div className="p-3.5 rounded-xl bg-[#050b14] border border-[#818cf8]/40 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[11px] text-[#818cf8]">
                        <span>Spatial OCR Grounding</span>
                        <span className="text-[10px] text-[#94a3b8]">{current.boundingBoxData.accuracy}</span>
                      </div>
                      <div className="relative h-24 bg-[#0a1628] rounded-lg border border-dashed border-[#818cf8]/50 flex items-center justify-center">
                        <div className="border-2 border-[#818cf8] bg-[#818cf8]/15 rounded px-3 py-1.5 text-[11px] font-mono text-[#818cf8] flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{current.boundingBoxData.label}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#94a3b8] text-right font-mono">
                        Metric: {current.boundingBoxData.metric}
                      </p>
                    </div>
                  )}

                  {/* Code Snippet Box */}
                  {current.codeSnippet && (
                    <div className="rounded-xl bg-[#040811] border border-[#192b43] overflow-hidden text-xs font-mono">
                      <div className="bg-[#0b1626] px-3 py-1 border-b border-[#192b43] text-[10px] text-[#64748b] flex items-center justify-between">
                        <span>data_parser.py</span>
                        <span className="text-[#38bdf8]">Python 3.11</span>
                      </div>
                      <pre className="p-3 text-[#a5f3fc] overflow-x-auto text-[11px]">
                        <code>{current.codeSnippet}</code>
                      </pre>
                      <div className="px-3 py-1.5 bg-[#070e1a] border-t border-[#192b43] text-[10px] text-[#34d399] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{current.codeFooter}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Controls & Progress Bar */}
        <div className="bg-[#050b14] px-5 sm:px-6 py-3.5 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Play / Pause / Reset & Step Indicators */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1928] text-xs font-mono text-[#f4f4f5] hover:bg-[#15273e] hover:text-[#38bdf8] border border-[#1e293b] transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={() => {
                  setActiveStep(0);
                  setIsPlaying(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1928] text-xs font-mono text-[#94a3b8] hover:text-[#f4f4f5] border border-[#1e293b] transition-colors cursor-pointer"
                title="Reset demo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5">
              {demoScenarios.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveStep(i);
                    setIsPlaying(false);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    i === activeStep ? 'w-6 bg-[#38bdf8]' : 'w-1.5 bg-[#1e293b] hover:bg-[#38bdf8]/50'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                if (onLaunchApp) onLaunchApp();
              }}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Try Live Canvas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchDemoModal;
