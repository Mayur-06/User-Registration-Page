import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What file formats and sizes are supported?',
      answer:
        'LucyChat natively parses multi-page PDFs (up to 250MB per file), Microsoft Word (.docx), Excel spreadsheets (.xlsx, .csv), plain text, Markdown, Jupyter notebooks (.ipynb), and high-resolution images (PNG, JPG, WEBP) with automatic sub-pixel OCR bounding boxes.',
    },
    {
      question: 'How does the hallucination grounding engine work?',
      answer:
        'Our vector reasoning engine calculates bidirectional attention scores between retrieved source document spans and LLM output tokens. Every factual statement and quantitative insight is anchored with clickable sub-word citation markers that immediately jump to the exact page, table, or paragraph in the document viewer.',
    },
    {
      question: 'Is my data safe and never used for model training?',
      answer:
        'Yes, with an ironclad guarantee. We enforce strict enterprise Zero Data Retention (ZDR). Your proprietary documents, embeddings, and chat transcripts reside in volatile RAM with AES-256 and TLS 1.3 encryption and are never used to train or fine-tune public foundation models.',
    },
    {
      question: 'Can LucyChat execute code and calculate statistics?',
      answer:
        'Yes. LucyChat features an isolated Python 3.11 compute sandbox. When analyzing spreadsheets or financial charts, it writes and executes Python scripts in real-time to compute exact statistics, perform regression models, and render interactive charts with zero mathematical hallucination.',
    },
    {
      question: 'Can I export reports and share workspaces with teammates?',
      answer:
        'LucyChat workspaces support multi-seat collaboration, shared vector libraries, one-click PDF and Markdown executive briefings, and secure read-only live canvas links for external stakeholders.',
    },
    {
      question: 'Can I start for free before upgrading?',
      answer:
        'Yes. The Free Canvas plan provides full multi-modal reasoning and up to 5 document analyses every month with no credit card required. You can upgrade anytime to Pro or Enterprise for unlimited throughput.',
    },
  ];

  return (
    <section id="faq" className="py-24 px-4 md:px-10 max-w-[1440px] mx-auto text-center scroll-mt-20">
      {/* Section Badge & Title */}
      <div className="max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#08101d] border border-[#38bdf8]/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <HelpCircle className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="font-mono text-xs font-bold text-[#38bdf8] tracking-wider uppercase">
            FREQUENTLY ASKED QUESTIONS
          </span>
        </div>

        <h2
          className="text-3xl sm:text-4xl md:text-5xl text-[#f4f4f5] tracking-tight font-extrabold"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Everything you need to know.
        </h2>
        <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed font-sans">
          Clear answers about multi-modal file ingestion, citation accuracy, Python execution, and enterprise security.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-4xl mx-auto space-y-3.5 text-left">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`bg-[#08101d] border rounded-2xl overflow-hidden transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.99] ${
                isOpen
                  ? 'border-[#38bdf8]/60 bg-[#091424] shadow-[0_0_25px_rgba(56,189,248,0.12)]'
                  : 'border-[#1e293b] hover:border-[#38bdf8]/40 hover:bg-[#091424]/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.08)]'
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer group transition-colors duration-300"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm sm:text-base font-bold transition-colors ${
                      isOpen ? 'text-[#38bdf8]' : 'text-[#f4f4f5] group-hover:text-[#38bdf8]'
                    }`}
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {faq.question}
                  </span>
                </div>

                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                    isOpen
                      ? 'bg-[#38bdf8]/20 border-[#38bdf8]/40 text-[#38bdf8]'
                      : 'bg-[#0e1928] border-[#1e293b] text-[#94a3b8] group-hover:text-[#f4f4f5]'
                  }`}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#38bdf8]' : ''
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-[#94a3b8] leading-relaxed border-t border-[#1e293b] pt-4 font-sans">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support help footer card */}
      <div className="mt-12 max-w-4xl mx-auto p-5 rounded-xl bg-[#08101d]/60 border border-[#1e293b] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#f4f4f5]">Have a specialized question?</div>
            <div className="text-[11px] text-[#94a3b8]">Our AI researchers and systems engineers are here to assist.</div>
          </div>
        </div>
        <a
          href="mailto:support@lucychat.ai"
          className="px-4 py-2 rounded-lg bg-[#0e1928] hover:bg-[#15273e] border border-[#1e293b] hover:border-[#38bdf8]/40 text-[#f4f4f5] text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <span>Contact Support</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
        </a>
      </div>
    </section>
  );
};

export default FAQSection;
