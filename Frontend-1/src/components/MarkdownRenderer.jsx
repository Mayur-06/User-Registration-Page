import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

const MarkdownRenderer = ({ children, className = '' }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`text-xs sm:text-sm leading-relaxed font-sans prose prose-invert max-w-none chat-markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl sm:text-2xl font-bold text-[#f4f4f5] mt-5 mb-3 tracking-tight" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg sm:text-xl font-bold text-[#f4f4f5] mt-4 mb-2.5 tracking-tight" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base sm:text-lg font-semibold text-[#f4f4f5] mt-3.5 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm sm:text-base font-semibold text-[#f4f4f5] mt-3 mb-1.5" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-[#d4e4fa] mt-2.5 mb-2.5 leading-relaxed" {...props} />
          ),
          ul: ({ node, ordered, ...props }) => (
            <ul className="mt-3 mb-3 text-[#d4e4fa]" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mt-3 mb-3 text-[#d4e4fa]" {...props} />
          ),
          li: ({ node, ordered, ...props }) => (
            <li className="leading-relaxed" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[#38bdf8] pl-4 py-2 my-4 italic text-[#94a3b8] bg-[#38bdf8]/5 rounded-r-lg"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const codeId = match ? match[1] : 'code';
            const codeString = String(children).replace(/\n$/, '');

            if (inline) {
              return (
                <code
                  className="bg-[#38bdf8]/10 text-[#38bdf8] px-1.5 py-0.5 rounded-md text-xs font-mono font-medium border border-[#38bdf8]/20"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative group my-4">
                <div className="flex items-center justify-between bg-[#0b1626] border border-[#192b43] rounded-t-lg px-4 py-2">
                  <span className="text-[10px] text-[#64748b] font-mono uppercase tracking-wider">
                    {match ? match[1] : 'code'}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(codeString, codeId)}
                    className="text-[#64748b] hover:text-[#38bdf8] transition-colors p-1 rounded"
                    title="Copy code"
                  >
                    {copiedCode === codeId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="bg-[#040811] border border-t-0 border-[#192b43] rounded-b-lg p-4 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse text-sm" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[#0e1928] border-b-2 border-[#1e293b]" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-[#f4f4f5] uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-2.5 text-[#d4e4fa] border-b border-[#1e293b]/60" {...props} />
          ),
          a: ({ node, href, ...props }) => (
            <a
              href={href}
              className="text-[#38bdf8] hover:text-[#38bdf8]/80 underline underline-offset-2 decoration-[#38bdf8]/40 hover:decoration-[#38bdf8] transition-all"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-[#f4f4f5]" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-[#d4e4fa]" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-[#1e293b] my-6" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="rounded-xl border border-[#1e293b] my-4 max-w-full h-auto" {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
