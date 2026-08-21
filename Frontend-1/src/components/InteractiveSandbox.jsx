// import React, { useState, useRef, useEffect } from 'react';
// import {
//   FileText,
//   Image as ImageIcon,
//   Plus,
//   Lock,
//   ArrowUp,
//   Paperclip,
//   ExternalLink,
//   ChevronDown,
//   BarChart3,
//   MessageSquare,
//   FileSearch,
//   Sparkles,
// } from 'lucide-react';
// import { generateClientAIResponse } from '../utils/aiEngine';
// import { Logo } from './Logo';

// export const InteractiveSandbox = ({
//   onOpenAddContext,
//   onSelectCitation,
//   onSelectDocument,
// }) => {
//   const [activeTab, setActiveTab] = useState('doc');
//   const [inputText, setInputText] = useState('');
//   const [isTyping, setIsTyping] = useState(false);

//   // Tab specific message streams
//   const [docMessages, setDocMessages] = useState([
//     {
//       id: 'doc-1',
//       sender: 'user',
//       text: 'Can you extract the key liabilities from Contract_v3.pdf?',
//       timestamp: '10:42 AM',
//     },
//     {
//       id: 'doc-2',
//       sender: 'assistant',
//       text: `Based on **Contract_v3.pdf**, here are the primary liabilities outlined in Section 4:`,
//       bullets: [
//         { label: 'Indemnification:', text: 'Party A holds liability for third-party IP claims up to $1M.' },
//         { label: 'Data Breach:', text: 'Liability is uncapped for gross negligence regarding PII data handling.' },
//       ],
//       citations: [
//         {
//           label: 'Pg. 12, Sec 4.2',
//           doc: 'Contract_v3.pdf',
//           snippet: 'Section 4.2: In the event of a Security Incident or data breach of PII, liability is uncapped for gross negligence.',
//           page: 12,
//         },
//       ],
//       timestamp: '10:42 AM',
//     },
//   ]);

//   const [visionMessages, setVisionMessages] = useState([
//     {
//       id: 'vis-1',
//       sender: 'user',
//       text: 'What is the Q3 revenue trend from this chart?',
//       timestamp: '10:43 AM',
//     },
//     {
//       id: 'vis-2',
//       sender: 'assistant',
//       text: 'Analyzing **Q3_Chart.png** with multi-modal visual OCR:',
//       hasBoundingBox: true,
//       chartSummary: 'The chart indicates a steady 15% MoM growth in Q3, accelerating in August and peaking in September at $450k ARR.',
//       timestamp: '10:43 AM',
//     },
//   ]);

//   const [generalMessages, setGeneralMessages] = useState([
//     {
//       id: 'gen-1',
//       sender: 'user',
//       text: 'Write a python script to parse a CSV into JSON.',
//       timestamp: '10:44 AM',
//     },
//     {
//       id: 'gen-2',
//       sender: 'assistant',
//       text: 'Here is a clean Python script using the native `csv` and `json` modules:',
//       codeSnippet: `import csv, json

// def csv_to_json(csv_path, json_path):
//     with open(csv_path, 'r', encoding='utf-8') as f:
//         data = list(csv.DictReader(f))
//     with open(json_path, 'w', encoding='utf-8') as f:
//         json.dump(data, f, indent=2)`,
//       codeExplanation: 'Reads the CSV header dynamically to construct dictionary objects per row.',
//       timestamp: '10:44 AM',
//     },
//   ]);

//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     chatContainerRef.current?.scrollTo({
//       top: chatContainerRef.current.scrollHeight,
//       behavior: 'smooth',
//     });
//   }, [activeTab, docMessages, visionMessages, generalMessages, isTyping]);

//   const handleSendMessage = (e) => {
//     if (e) e.preventDefault();
//     if (!inputText.trim() || isTyping) return;

//     const userText = inputText.trim();
//     setInputText('');

//     const newUserMsg = {
//       id: `u-${Date.now()}`,
//       sender: 'user',
//       text: userText,
//       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//     };

//     if (activeTab === 'doc') setDocMessages((prev) => [...prev, newUserMsg]);
//     else if (activeTab === 'vision') setVisionMessages((prev) => [...prev, newUserMsg]);
//     else setGeneralMessages((prev) => [...prev, newUserMsg]);

//     setIsTyping(true);

//     // Client-side instant reasoning generator
//     setTimeout(() => {
//       const aiResult = generateClientAIResponse(
//         userText,
//         [
//           { id: '1', name: 'Contract_v3.pdf', size: '2.4 MB', type: 'pdf', icon: 'picture_as_pdf', color: '#ffb4ab' },
//           { id: '2', name: 'Q3_Chart.png', size: '856 KB', type: 'image', icon: 'bar_chart', color: '#818cf8' },
//         ],
//         activeTab
//       );

//       const newBotMsg = {
//         id: `bot-${Date.now()}`,
//         sender: 'assistant',
//         text: aiResult.text,
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         citations: aiResult.citations,
//         codeSnippet: aiResult.codeSnippet,
//         bullets: aiResult.bullets,
//         hasBoundingBox: aiResult.hasBoundingBox,
//       };

//       if (activeTab === 'doc') setDocMessages((prev) => [...prev, newBotMsg]);
//       else if (activeTab === 'vision') setVisionMessages((prev) => [...prev, newBotMsg]);
//       else setGeneralMessages((prev) => [...prev, newBotMsg]);

//       setIsTyping(false);
//     }, 450);
//   };

//   return (
//     <section className="pb-20 px-4 md:px-10 w-full max-w-6xl mx-auto flex flex-col items-center">
//       {/* 4. Interactive Multi-Modal Sandbox Mockup (Central Hero Asset) */}
//       <div className="w-full bg-[#08101d] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.12)] border border-[#1e293b] flex flex-col h-[620px] relative z-10">
//         {/* macOS Simulated Window Chrome Header */}
//         <div className="bg-[#050b14] px-4 py-3 flex items-center justify-between border-b border-[#1e293b] select-none">
//           {/* Traffic Light Control Dots */}
//           <div className="flex items-center gap-2">
//             <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 cursor-pointer" />
//             <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 cursor-pointer" />
//             <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 cursor-pointer" />
//           </div>

//           {/* URL Pill */}
//           <div className="px-3.5 py-1 rounded-md bg-[#091424] border border-[#1a2b40] font-mono text-[11px] text-[#94a3b8] flex items-center gap-1.5 shadow-inner">
//             <Lock className="w-3 h-3 text-[#38bdf8]" />
//             <span className="text-[#f4f4f5]">lucychat.ai</span>
//             <span className="text-[#475569]">/</span>
//             <span className="text-[#38bdf8]">canvas</span>
//           </div>

//           <div className="w-12" />
//         </div>

//         {/* Window Body Container */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Left Context Sidebar */}
//           <aside className="w-[250px] bg-[#050b14]/90 border-r border-[#1e293b] p-4 flex flex-col gap-3 hidden md:flex shrink-0">
//             <div className="flex items-center justify-between mb-1">
//               <span className="font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase">
//                 CONTEXT
//               </span>
//               <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
//                 2 Files
//               </span>
//             </div>

//             {/* File Chip 1: Contract_v3.pdf */}
//             <div
//               onClick={() =>
//                 onSelectDocument({
//                   id: 'ctx-doc-contract',
//                   name: 'Contract_v3.pdf',
//                   size: '2.4 MB',
//                   pages: 24,
//                   type: 'pdf',
//                   icon: 'picture_as_pdf',
//                   color: '#ffb4ab',
//                   summary: 'Contractual liability allocations, indemnity caps, and SLA penalties.',
//                 })
//               }
//               className="flex items-center gap-3 p-2.5 rounded-xl bg-[#091424] border border-[#1a2b40] hover:border-[#38bdf8]/50 hover:bg-[#0e1d32] cursor-pointer transition-all group"
//             >
//               <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
//                 <FileText className="w-4 h-4" />
//               </div>
//               <div className="flex flex-col min-w-0">
//                 <span className="text-xs font-semibold text-[#f4f4f5] truncate group-hover:text-[#38bdf8] transition-colors">
//                   Contract_v3.pdf
//                 </span>
//                 <span className="text-[10px] font-mono text-[#94a3b8]">24 pgs • 2.4 MB</span>
//               </div>
//             </div>

//             {/* File Chip 2: Q3_Chart.png */}
//             <div
//               onClick={() =>
//                 onSelectDocument({
//                   id: 'ctx-img-q3-chart',
//                   name: 'Q3_Chart.png',
//                   size: '856 KB',
//                   type: 'image',
//                   icon: 'bar_chart',
//                   color: '#818cf8',
//                   summary: 'Quarterly ARR progression from July ($340k) to September ($450k).',
//                 })
//               }
//               className="flex items-center gap-3 p-2.5 rounded-xl bg-[#091424] border border-[#1a2b40] hover:border-[#818cf8]/50 hover:bg-[#0e1d32] cursor-pointer transition-all group"
//             >
//               <div className="w-8 h-8 rounded-lg bg-[#818cf8]/10 border border-[#818cf8]/30 flex items-center justify-center text-[#818cf8] shrink-0">
//                 <BarChart3 className="w-4 h-4" />
//               </div>
//               <div className="flex flex-col min-w-0">
//                 <span className="text-xs font-semibold text-[#f4f4f5] truncate group-hover:text-[#818cf8] transition-colors">
//                   Q3_Chart.png
//                 </span>
//                 <span className="text-[10px] font-mono text-[#94a3b8]">856 KB</span>
//               </div>
//             </div>

//             {/* Bottom "+ Add Context" Dashed Button */}
//             <button
//               onClick={onOpenAddContext}
//               className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-[#22364e] text-[#94a3b8] hover:text-[#38bdf8] hover:border-[#38bdf8]/60 hover:bg-[#38bdf8]/5 transition-all font-mono text-xs cursor-pointer group"
//             >
//               <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
//               <span>Add Context</span>
//             </button>
//           </aside>

//           {/* Center Chat Workspace */}
//           <div className="flex-1 bg-[#08101d] flex flex-col relative overflow-hidden">
//             {/* Mobile Context Strip (Visible on mobile/tablets where left sidebar is hidden) */}
//             <div className="md:hidden flex items-center justify-between px-3.5 py-2 bg-[#050b14] border-b border-[#1e293b] overflow-x-auto gap-2">
//               <div className="flex items-center gap-2 shrink-0">
//                 <span className="font-mono text-[10px] font-bold text-[#64748b] uppercase">Context:</span>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     onSelectDocument({
//                       id: 'ctx-doc-contract',
//                       name: 'Contract_v3.pdf',
//                       size: '2.4 MB',
//                       pages: 24,
//                       type: 'pdf',
//                       icon: 'picture_as_pdf',
//                       color: '#ffb4ab',
//                       summary: 'Contractual liability allocations, indemnity caps, and SLA penalties.',
//                     })
//                   }
//                   className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#091424] border border-[#1a2b40] text-[11px] text-[#f4f4f5] hover:border-[#38bdf8]/50"
//                 >
//                   <FileText className="w-3 h-3 text-rose-400" />
//                   <span className="font-mono">Contract_v3.pdf</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() =>
//                     onSelectDocument({
//                       id: 'ctx-img-q3-chart',
//                       name: 'Q3_Chart.png',
//                       size: '856 KB',
//                       type: 'image',
//                       icon: 'bar_chart',
//                       color: '#818cf8',
//                       summary: 'Quarterly ARR progression from July ($340k) to September ($450k).',
//                     })
//                   }
//                   className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#091424] border border-[#1a2b40] text-[11px] text-[#f4f4f5] hover:border-[#818cf8]/50"
//                 >
//                   <BarChart3 className="w-3 h-3 text-[#818cf8]" />
//                   <span className="font-mono">Q3_Chart.png</span>
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 onClick={onOpenAddContext}
//                 className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[10px] font-mono text-[#38bdf8] shrink-0"
//               >
//                 <Plus className="w-3 h-3" />
//                 <span>Add</span>
//               </button>
//             </div>

//             {/* Top Interactive Tabs: [Document Q&A], [Visual Analysis], [General Chat] */}
//             <div className="flex px-3 sm:px-6 pt-3 gap-3 sm:gap-6 border-b border-[#1e293b] bg-[#050b14]/50 overflow-x-auto">
//               <button
//                 onClick={() => setActiveTab('doc')}
//                 className={`pb-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
//                   activeTab === 'doc'
//                     ? 'text-[#38bdf8] border-[#38bdf8] font-semibold'
//                     : 'text-[#94a3b8] border-transparent hover:text-[#f4f4f5] hover:border-[#1e293b]'
//                 }`}
//               >
//                 <FileSearch className="w-4 h-4" />
//                 <span>Document Q&amp;A</span>
//               </button>

//               <button
//                 onClick={() => setActiveTab('vision')}
//                 className={`pb-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
//                   activeTab === 'vision'
//                     ? 'text-[#38bdf8] border-[#38bdf8] font-semibold'
//                     : 'text-[#94a3b8] border-transparent hover:text-[#f4f4f5] hover:border-[#1e293b]'
//                 }`}
//               >
//                 <BarChart3 className="w-4 h-4" />
//                 <span>Visual Analysis</span>
//               </button>

//               <button
//                 onClick={() => setActiveTab('general')}
//                 className={`pb-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
//                   activeTab === 'general'
//                     ? 'text-[#38bdf8] border-[#38bdf8] font-semibold'
//                     : 'text-[#94a3b8] border-transparent hover:text-[#f4f4f5] hover:border-[#1e293b]'
//                 }`}
//               >
//                 <MessageSquare className="w-4 h-4" />
//                 <span>General Chat</span>
//               </button>
//             </div>

//             {/* Chat Content Stream */}
//             <div ref={chatContainerRef} className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
//               {/* TAB 1: Document Q&A */}
//               {activeTab === 'doc' && (
//                 <div className="flex flex-col gap-4">
//                   {docMessages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                     >
//                       {msg.sender === 'assistant' && (
//                         <div className="shrink-0 mt-0.5">
//                           <Logo size="sm" showText={false} />
//                         </div>
//                       )}

//                       <div
//                         className={`max-w-[85%] rounded-2xl p-4 sm:p-5 border transition-all text-xs sm:text-sm leading-relaxed ${
//                           msg.sender === 'user'
//                             ? 'bg-[#152336] border-[#253952] text-[#f4f4f5] rounded-tr-sm'
//                             : 'bg-[#091424] border-[#1a2d46] text-[#d4e4fa] rounded-tl-sm'
//                         }`}
//                       >
//                         <p className="whitespace-pre-line">{msg.text}</p>

//                         {/* Structured response bullets */}
//                         {msg.bullets && (
//                           <ul className="mt-3 space-y-2 pl-2">
//                             {msg.bullets.map((b, i) => (
//                               <li key={`doc-b-${i}`} className="flex items-start gap-2">
//                                 <span className="text-[#38bdf8] mt-1">•</span>
//                                 <div>
//                                   <strong className="text-[#f4f4f5] font-semibold">{b.label} </strong>
//                                   <span className="text-[#94a3b8]">{b.text}</span>
//                                 </div>
//                               </li>
//                             ))}
//                           </ul>
//                         )}

//                         {/* Interactive Citation Pill */}
//                         {msg.citations && msg.citations.length > 0 && (
//                           <div className="mt-3.5 pt-2.5 border-t border-[#16273c] flex flex-wrap gap-2">
//                             <button
//                               type="button"
//                               onClick={() => onSelectCitation && onSelectCitation(msg.citations[0])}
//                               className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 hover:bg-[#38bdf8]/20 transition-all font-mono text-[11px] cursor-pointer"
//                             >
//                               <FileText className="w-3 h-3" />
//                               <span>{msg.citations[0].label}</span>
//                               <ExternalLink className="w-2.5 h-2.5 opacity-70" />
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* TAB 2: Visual Analysis */}
//               {activeTab === 'vision' && (
//                 <div className="flex flex-col gap-4">
//                   {visionMessages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                     >
//                       {msg.sender === 'assistant' && (
//                         <div className="shrink-0 mt-0.5">
//                           <Logo size="sm" showText={false} />
//                         </div>
//                       )}

//                       <div
//                         className={`max-w-[85%] rounded-2xl p-4 sm:p-5 border transition-all text-xs sm:text-sm leading-relaxed ${
//                           msg.sender === 'user'
//                             ? 'bg-[#152336] border-[#253952] text-[#f4f4f5] rounded-tr-sm'
//                             : 'bg-[#091424] border-[#1a2d46] text-[#d4e4fa] rounded-tl-sm'
//                         }`}
//                       >
//                         <p className="whitespace-pre-line mb-3">{msg.text}</p>

//                         {/* Bounding Box Visualizer Component */}
//                         {msg.hasBoundingBox && (
//                           <div className="p-3 rounded-xl bg-[#050b14] border border-[#38bdf8]/30 space-y-2 mb-3">
//                             <div className="flex items-center justify-between font-mono text-[11px] text-[#38bdf8]">
//                               <span>OCR Bounding Box Grounding</span>
//                               <span className="bg-[#38bdf8]/15 px-1.5 py-0.5 rounded text-[10px]">Q3 ARR: $450k</span>
//                             </div>
//                             <div className="relative h-24 bg-[#0a1628] rounded-lg border border-dashed border-[#38bdf8]/40 flex items-center justify-center overflow-hidden">
//                               <div className="border-2 border-[#38bdf8] bg-[#38bdf8]/10 rounded px-3 py-1 text-[11px] font-mono text-[#38bdf8]">
//                                 [Peak Acceleration: Sept +15% MoM]
//                               </div>
//                             </div>
//                           </div>
//                         )}

//                         {msg.chartSummary && (
//                           <p className="text-[#94a3b8] text-xs">{msg.chartSummary}</p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* TAB 3: General Chat */}
//               {activeTab === 'general' && (
//                 <div className="flex flex-col gap-4">
//                   {generalMessages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//                     >
//                       {msg.sender === 'assistant' && (
//                         <div className="shrink-0 mt-0.5">
//                           <Logo size="sm" showText={false} />
//                         </div>
//                       )}

//                       <div
//                         className={`max-w-[85%] rounded-2xl p-4 sm:p-5 border transition-all text-xs sm:text-sm leading-relaxed ${
//                           msg.sender === 'user'
//                             ? 'bg-[#152336] border-[#253952] text-[#f4f4f5] rounded-tr-sm'
//                             : 'bg-[#091424] border-[#1a2d46] text-[#d4e4fa] rounded-tl-sm'
//                         }`}
//                       >
//                         <p className="whitespace-pre-line mb-3">{msg.text}</p>

//                         {msg.codeSnippet && (
//                           <div className="rounded-xl bg-[#040811] border border-[#192b43] overflow-hidden text-xs my-2 font-mono">
//                             <div className="bg-[#0b1626] px-3 py-1.5 border-b border-[#192b43] text-[10px] text-[#64748b]">
//                               python_script.py
//                             </div>
//                             <pre className="p-3 text-[#a5f3fc] overflow-x-auto">
//                               <code>{msg.codeSnippet}</code>
//                             </pre>
//                           </div>
//                         )}

//                         {msg.codeExplanation && (
//                           <p className="text-[#94a3b8] text-xs mt-2">{msg.codeExplanation}</p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Typing State Indicator */}
//               {isTyping && (
//                 <div className="flex gap-3 items-center">
//                   <Logo size="sm" showText={false} />
//                   <div className="px-4 py-2.5 rounded-2xl bg-[#091424] border border-[#1a2d46] flex items-center gap-2">
//                     <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce" />
//                     <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.2s]" />
//                     <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.4s]" />
//                     <span className="font-mono text-xs text-[#38bdf8] ml-1">Reasoning...</span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Bottom Input Bar */}
//             <div className="p-3.5 bg-[#050b14] border-t border-[#1e293b]">
//               <form
//                 onSubmit={handleSendMessage}
//                 className="relative flex items-center bg-[#091424] rounded-xl border border-[#1a2b40] p-1.5 focus-within:border-[#38bdf8] focus-within:shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all duration-200"
//               >
//                 {/* Left Attachment Icon */}
//                 <button
//                   type="button"
//                   onClick={onOpenAddContext}
//                   className="p-2 rounded-lg text-[#94a3b8] hover:text-[#38bdf8] hover:bg-[#122138] transition-colors cursor-pointer"
//                   title="Attach file to context"
//                 >
//                   <Paperclip className="w-4 h-4" />
//                 </button>

//                 {/* Main Input Field */}
//                 <input
//                   type="text"
//                   value={inputText}
//                   onChange={(e) => setInputText(e.target.value)}
//                   placeholder="Ask anything about your context..."
//                   className="flex-1 bg-transparent px-2.5 py-2 text-xs sm:text-sm text-[#f4f4f5] placeholder-[#64748b] focus:outline-none"
//                 />

//                 {/* Glowing Circular Send Button with Up Arrow */}
//                 <button
//                   type="submit"
//                   disabled={!inputText.trim() || isTyping}
//                   className="w-8 h-8 rounded-full bg-[#38bdf8] text-slate-950 flex items-center justify-center font-bold hover:bg-[#38bdf8]/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.35)] shrink-0"
//                 >
//                   <ArrowUp className="w-4 h-4 stroke-[2.5]" />
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 5. Scroll Engagement Cue */}
//       <div 
//         className="mt-8 flex flex-col items-center gap-2 text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer group"
//         onClick={() => {
//           const featuresSection = document.getElementById('features');
//           if (featuresSection) {
//             featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//           }
//         }}
//       >
//         <span className="font-mono text-[11px] tracking-wider uppercase group-hover:text-[#38bdf8] transition-colors">
//           Explore Platform Architecture &amp; Capabilities
//         </span>
//         <ChevronDown className="w-4 h-4 animate-bounce text-[#38bdf8]" />
//       </div>
//     </section>
//   );
// };

// export default InteractiveSandbox;


import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Plus,
  Lock,
  ArrowUp,
  Paperclip,
  ExternalLink,
  ChevronDown,
  BarChart3,
  MessageSquare,
  FileSearch,
  Sparkles,
} from 'lucide-react';
import { generateClientAIResponse } from '../utils/aiEngine';
import { Logo } from './Logo';

export const InteractiveSandbox = ({
  onOpenAddContext,
  onSelectCitation,
  onSelectDocument,
}) => {
  const [activeTab, setActiveTab] = useState('doc');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Tab specific message streams
  const [docMessages, setDocMessages] = useState([
    {
      id: 'doc-1',
      sender: 'user',
      text: 'Can you extract the key liabilities from Contract_v3.pdf?',
      timestamp: '10:42 AM',
    },
    {
      id: 'doc-2',
      sender: 'assistant',
      text: `Based on **Contract_v3.pdf**, here are the primary liabilities outlined in Section 4:`,
      bullets: [
        { label: 'Indemnification:', text: 'Party A holds liability for third-party IP claims up to $1M.' },
        { label: 'Data Breach:', text: 'Liability is uncapped for gross negligence regarding PII data handling.' },
      ],
      citations: [
        {
          label: 'Pg. 12, Sec 4.2',
          doc: 'Contract_v3.pdf',
          snippet: 'Section 4.2: In the event of a Security Incident or data breach of PII, liability is uncapped for gross negligence.',
          page: 12,
        },
      ],
      timestamp: '10:42 AM',
    },
  ]);

  const [generalMessages, setGeneralMessages] = useState([
    {
      id: 'gen-1',
      sender: 'user',
      text: 'Write a python script to parse a CSV into JSON.',
      timestamp: '10:44 AM',
    },
    {
      id: 'gen-2',
      sender: 'assistant',
      text: 'Here is a clean Python script using the native `csv` and `json` modules:',
      codeSnippet: `import csv, json

def csv_to_json(csv_path, json_path):
    with open(csv_path, 'r', encoding='utf-8') as f:
        data = list(csv.DictReader(f))
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)`,
      codeExplanation: 'Reads the CSV header dynamically to construct dictionary objects per row.',
      timestamp: '10:44 AM',
    },
  ]);

  const chatContainerRef = useRef(null);
  const responseTimeoutRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [activeTab, docMessages, generalMessages, isTyping]);

  useEffect(()=>{
    return () =>{
      if (responseTimeoutRef.current){
        clearTimeout(responseTimeoutRef.current);
      }
    };
  },[]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    setInputText('');

    const newUserMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (activeTab === 'doc') setDocMessages((prev) => [...prev, newUserMsg]);
    else setGeneralMessages((prev) => [...prev, newUserMsg]);

    setIsTyping(true);

      if (responseTimeoutRef.current){
        clearTimeout(responseTimeoutRef.current);
        }
        responseTimeoutRef.current = setTimeout(()=>{
          const aiResult = generateClientAIResponse(
            userText,
        [
          { id: '1', name: 'Contract_v3.pdf', size: '2.4 MB', type: 'pdf', icon: 'picture_as_pdf', color: '#ffb4ab' },
        ],
        activeTab
      );

      const newBotMsg = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: aiResult.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: aiResult.citations,
        codeSnippet: aiResult.codeSnippet,
        bullets: aiResult.bullets,
        hasBoundingBox: aiResult.hasBoundingBox,
      };

      if (activeTab === 'doc') setDocMessages((prev) => [...prev, newBotMsg]);
      else setGeneralMessages((prev) => [...prev, newBotMsg]);

      setIsTyping(false);
      responseTimeoutRef.current = null;
    }, 450);
  };

  return (
    <section className="pb-20 px-4 md:px-10 w-full max-w-6xl mx-auto flex flex-col items-center">
      {/* 4. Interactive Multi-Modal Sandbox Mockup (Central Hero Asset) */}
      <div className="w-full bg-[#08101d] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.12)] border border-[#1e293b] flex flex-col h-[620px] relative z-10">
        {/* macOS Simulated Window Chrome Header */}
        <div className="bg-[#050b14] px-4 py-3 flex items-center justify-between border-b border-[#1e293b] select-none">
          {/* Traffic Light Control Dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 cursor-pointer" />
          </div>

          {/* URL Pill */}
          <div className="px-3.5 py-1 rounded-md bg-[#091424] border border-[#1a2b40] font-mono text-[11px] text-[#94a3b8] flex items-center gap-1.5 shadow-inner">
            <Lock className="w-3 h-3 text-[#38bdf8]" />
            <span className="text-[#f4f4f5]">lucychat.ai</span>
            <span className="text-[#475569]">/</span>
            <span className="text-[#38bdf8]">canvas</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1e293b]/60 border border-[#334155] text-[9px] font-mono text-[#94a3b8] shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-[#38bdf8]" />
            Simulated preview
          </span>

          <div className="w-12 sm:w-0" />
        </div>

        {/* Window Body Container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Context Sidebar */}
          <aside className="w-[250px] bg-[#050b14]/90 border-r border-[#1e293b] p-4 flex flex-col gap-3 hidden md:flex shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[11px] font-bold text-[#64748b] tracking-wider uppercase">
                CONTEXT
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
                1 File
              </span>
            </div>

            {/* File Chip 1: Contract_v3.pdf */}
            <div
              onClick={() =>
                onSelectDocument({
                  id: 'ctx-doc-contract',
                  name: 'Contract_v3.pdf',
                  size: '2.4 MB',
                  pages: 24,
                  type: 'pdf',
                  icon: 'picture_as_pdf',
                  color: '#ffb4ab',
                  summary: 'Contractual liability allocations, indemnity caps, and SLA penalties.',
                })
              }
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#091424] border border-[#1a2b40] hover:border-[#38bdf8]/50 hover:bg-[#0e1d32] cursor-pointer transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#f4f4f5] truncate group-hover:text-[#38bdf8] transition-colors">
                  Contract_v3.pdf
                </span>
                <span className="text-[10px] font-mono text-[#94a3b8]">24 pgs • 2.4 MB</span>
              </div>
            </div>

            {/* Bottom "+ Add Context" Dashed Button */}
            <button
              onClick={onOpenAddContext}
              className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-[#22364e] text-[#94a3b8] hover:text-[#38bdf8] hover:border-[#38bdf8]/60 hover:bg-[#38bdf8]/5 transition-all font-mono text-xs cursor-pointer group"
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
              <span>Add Context</span>
            </button>
          </aside>

          {/* Center Chat Workspace */}
          <div className="flex-1 bg-[#08101d] flex flex-col relative overflow-hidden">
            {/* Mobile Context Strip (Visible on mobile/tablets where left sidebar is hidden) */}
            <div className="md:hidden flex items-center justify-between px-3.5 py-2 bg-[#050b14] border-b border-[#1e293b] overflow-x-auto gap-2">
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[10px] font-bold text-[#64748b] uppercase">Context:</span>
                <button
                  type="button"
                  onClick={() =>
                    onSelectDocument({
                      id: 'ctx-doc-contract',
                      name: 'Contract_v3.pdf',
                      size: '2.4 MB',
                      pages: 24,
                      type: 'pdf',
                      icon: 'picture_as_pdf',
                      color: '#ffb4ab',
                      summary: 'Contractual liability allocations, indemnity caps, and SLA penalties.',
                    })
                  }
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#091424] border border-[#1a2b40] text-[11px] text-[#f4f4f5] hover:border-[#38bdf8]/50"
                >
                  <FileText className="w-3 h-3 text-rose-400" />
                  <span className="font-mono">Contract_v3.pdf</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onOpenAddContext}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[10px] font-mono text-[#38bdf8] shrink-0"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>

            {/* Top Interactive Tabs: [Document Q&A], [General Chat] */}
            <div className="flex px-3 sm:px-6 pt-3 gap-3 sm:gap-6 border-b border-[#1e293b] bg-[#050b14]/50 overflow-x-auto">
              <button
                onClick={() => setActiveTab('doc')}
                className={`pb-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'doc'
                    ? 'text-[#38bdf8] border-[#38bdf8] font-semibold'
                    : 'text-[#94a3b8] border-transparent hover:text-[#f4f4f5] hover:border-[#1e293b]'
                }`}
              >
                <FileSearch className="w-4 h-4" />
                <span>Document Q&amp;A</span>
              </button>

              <button
                onClick={() => setActiveTab('general')}
                className={`pb-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'general'
                    ? 'text-[#38bdf8] border-[#38bdf8] font-semibold'
                    : 'text-[#94a3b8] border-transparent hover:text-[#f4f4f5] hover:border-[#1e293b]'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>General Chat</span>
              </button>
            </div>

            {/* Chat Content Stream */}
            <div ref={chatContainerRef} className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
              {/* TAB 1: Document Q&A */}
              {activeTab === 'doc' && (
                <div className="flex flex-col gap-4">
                  {docMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'assistant' && (
                        <div className="shrink-0 mt-0.5">
                          <Logo size="sm" showText={false} />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 sm:p-5 border transition-all text-xs sm:text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[#152336] border-[#253952] text-[#f4f4f5] rounded-tr-sm'
                            : 'bg-[#091424] border-[#1a2d46] text-[#d4e4fa] rounded-tl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>

                        {/* Structured response bullets */}
                        {msg.bullets && (
                          <ul className="mt-3 space-y-2 pl-2">
                            {msg.bullets.map((b, i) => (
                              <li key={`doc-b-${i}`} className="flex items-start gap-2">
                                <span className="text-[#38bdf8] mt-1">•</span>
                                <div>
                                  <strong className="text-[#f4f4f5] font-semibold">{b.label} </strong>
                                  <span className="text-[#94a3b8]">{b.text}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Interactive Citation Pill */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3.5 pt-2.5 border-t border-[#16273c] flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => onSelectCitation && onSelectCitation(msg.citations[0])}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 hover:bg-[#38bdf8]/20 transition-all font-mono text-[11px] cursor-pointer"
                            >
                              <FileText className="w-3 h-3" />
                              <span>{msg.citations[0].label}</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: General Chat */}
              {activeTab === 'general' && (
                <div className="flex flex-col gap-4">
                  {generalMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'assistant' && (
                        <div className="shrink-0 mt-0.5">
                          <Logo size="sm" showText={false} />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 sm:p-5 border transition-all text-xs sm:text-sm leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[#152336] border-[#253952] text-[#f4f4f5] rounded-tr-sm'
                            : 'bg-[#091424] border-[#1a2d46] text-[#d4e4fa] rounded-tl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line mb-3">{msg.text}</p>

                        {msg.codeSnippet && (
                          <div className="rounded-xl bg-[#040811] border border-[#192b43] overflow-hidden text-xs my-2 font-mono">
                            <div className="bg-[#0b1626] px-3 py-1.5 border-b border-[#192b43] text-[10px] text-[#64748b]">
                              python_script.py
                            </div>
                            <pre className="p-3 text-[#a5f3fc] overflow-x-auto">
                              <code>{msg.codeSnippet}</code>
                            </pre>
                          </div>
                        )}

                        {msg.codeExplanation && (
                          <p className="text-[#94a3b8] text-xs mt-2">{msg.codeExplanation}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Typing State Indicator */}
              {isTyping && (
                <div className="flex gap-3 items-center">
                  <Logo size="sm" showText={false} />
                  <div className="px-4 py-2.5 rounded-2xl bg-[#091424] border border-[#1a2d46] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-bounce [animation-delay:0.4s]" />
                    <span className="font-mono text-xs text-[#38bdf8] ml-1">Reasoning...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Input Bar */}
            <div className="p-3.5 bg-[#050b14] border-t border-[#1e293b]">
              <form
                onSubmit={handleSendMessage}
                className="relative flex items-center bg-[#091424] rounded-xl border border-[#1a2b40] p-1.5 focus-within:border-[#38bdf8] focus-within:shadow-[0_0_20px_rgba(56,189,248,0.25)] transition-all duration-200"
              >
                {/* Left Attachment Icon */}
                <button
                  type="button"
                  onClick={onOpenAddContext}
                  className="p-2 rounded-lg text-[#94a3b8] hover:text-[#38bdf8] hover:bg-[#122138] transition-colors cursor-pointer"
                  title="Attach file to context"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Main Input Field */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask anything about your context..."
                  className="flex-1 bg-transparent px-2.5 py-2 text-xs sm:text-sm text-[#f4f4f5] placeholder-[#64748b] focus:outline-none"
                />

                {/* Glowing Circular Send Button with Up Arrow */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="w-8 h-8 rounded-full bg-[#38bdf8] text-slate-950 flex items-center justify-center font-bold hover:bg-[#38bdf8]/90 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.35)] shrink-0"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Scroll Engagement Cue */}
      <div 
        className="mt-8 flex flex-col items-center gap-2 text-[#64748b] hover:text-[#38bdf8] transition-colors cursor-pointer group"
        onClick={() => {
          const featuresSection = document.getElementById('features');
          if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      >
        <span className="font-mono text-[11px] tracking-wider uppercase group-hover:text-[#38bdf8] transition-colors">
          Explore Platform Architecture &amp; Capabilities
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#38bdf8]" />
      </div>
    </section>
  );
};

export default InteractiveSandbox;