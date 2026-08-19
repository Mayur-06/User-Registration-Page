import React from 'react';
import { X, FileText, Search } from 'lucide-react';

export const DocumentViewerModal = ({
  isOpen,
  onClose,
  document,
  citation,
}) => {
  if (!isOpen || (!document && !citation)) return null;

  const docTitle = document?.name || citation?.doc || 'Document Citation Preview';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#08101d] border border-[#1e293b] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#070f1d] px-6 py-4 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-[#f4f4f5] truncate max-w-md font-mono">
              {docTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#f4f4f5] hover:bg-[#0e1928] border border-transparent hover:border-[#1e293b] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-[#050b14]">
          {citation && (
            <div className="bg-[#08101d] p-4 rounded-xl border border-[#38bdf8]/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[#38bdf8] flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>Grounding Citation: {citation.label}</span>
                </span>
                <span className="text-[10px] font-mono bg-[#38bdf8]/15 text-[#38bdf8] px-2 py-0.5 rounded border border-[#38bdf8]/30">
                  Confidence: 99.8%
                </span>
              </div>
              <p className="text-xs font-mono text-[#f4f4f5] bg-[#050b14] p-3 rounded-lg border border-[#1e293b] leading-relaxed">
                "{citation.snippet || 'Section 4.2: Data Protection & Privacy. In the event of a Security Incident or unauthorized access to Personally Identifiable Information (PII), liability is uncapped in cases of gross negligence or willful misconduct.'}"
              </p>
            </div>
          )}

          {/* Full document simulated view */}
          <div className="bg-[#08101d] p-4 sm:p-5 rounded-xl border border-[#1e293b] max-h-72 overflow-y-auto font-mono text-xs text-[#94a3b8] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] text-[11px] text-[#38bdf8]">
              <span>PAGE 12 OF 24 — MASTER SERVICES AGREEMENT</span>
              <span className="bg-[#38bdf8]/10 px-2 py-0.5 rounded text-[10px]">CONFIDENTIAL</span>
            </div>

            <div className="space-y-3 leading-relaxed">
              <p className="text-[#f4f4f5] font-bold">SECTION 4: INDEMNIFICATION AND LIABILITY ALLOCATION</p>
              
              <p>
                <strong className="text-[#f4f4f5]">4.1 Intellectual Property Indemnity.</strong> Provider shall defend, indemnify, and hold harmless Customer, its affiliates, and respective officers from any third-party claims alleging infringement of patent, copyright, or trademark, capped at $1,000,000 USD aggregate.
              </p>

              {/* Highlighted portion */}
              <div className="bg-[#38bdf8]/10 border-l-4 border-[#38bdf8] p-3 rounded text-[#f4f4f5]">
                <strong className="text-[#38bdf8]">4.2 Data Protection & Security Incidents.</strong> In the event of unauthorized disclosure or breach of Personally Identifiable Information (PII), liability is <span className="underline font-bold text-white">UNCAPPED</span> in any occurrence involving gross negligence, intentional wrongdoing, or violation of applicable privacy statutory mandates.
              </div>

              <p>
                <strong className="text-[#f4f4f5]">4.3 Service Availability Guarantees.</strong> Provider warrants a 99.9% uptime Service Level Agreement (SLA). Breaches exceeding 45 minutes shall accrue 5% billing credits per hourly increment.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#070f1d] px-6 py-3.5 border-t border-[#1e293b] flex items-center justify-between text-xs font-mono">
          <span className="text-[#64748b]">Vector Hash: 0x8f2d...c41e</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#38bdf8] text-slate-950 font-bold hover:bg-[#38bdf8]/90 transition-all cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.2)]"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;
