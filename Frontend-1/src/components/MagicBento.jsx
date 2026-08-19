// import React, { useRef, useEffect, useState, useCallback } from 'react';
// import { gsap } from 'gsap';
// import {
//   FileText,
//   Eye,
//   Shield,
//   Sparkles,
//   Zap,
//   Network,
//   Code2,
//   Lock,
//   ArrowUpRight
// } from 'lucide-react';

// const DEFAULT_PARTICLE_COUNT = 12;
// const DEFAULT_SPOTLIGHT_RADIUS = 300;
// const DEFAULT_GLOW_COLOR = '56, 189, 248'; // Electric Cyan (#38bdf8)
// const MOBILE_BREAKPOINT = 768;

// export const lucyBentoCardData = [
//   {
//     id: 'doc-qa',
//     color: '#08101d',
//     title: 'Deep Document Q&A',
//     description: 'Parse 100+ page PDFs, DOCX, and financial tables with pinpoint citation tags.',
//     label: 'Document RAG',
//     icon: FileText,
//     badge: '99.8% Precision'
//   },
//   {
//     id: 'vision-ocr',
//     color: '#08101d',
//     title: 'Multi-Modal Vision',
//     description: 'Inspect UI wireframes, charts, and architecture diagrams with OCR & bounding boxes.',
//     label: 'Visual OCR',
//     icon: Eye,
//     badge: 'Sub-pixel'
//   },
//   {
//     id: 'hallucination-grounding',
//     color: '#091424',
//     title: 'Hallucination Grounding',
//     description: 'Bi-directional linking between chatbot answers and exact source paragraphs with sub-word confidence scoring.',
//     label: 'Vector Anchor',
//     icon: Network,
//     badge: 'Zero Hallucination'
//   },
//   {
//     id: 'zero-retention',
//     color: '#08101d',
//     title: 'Zero Data Retention',
//     description: 'Proprietary enterprise documents are processed in volatile RAM and never used for training foundation weights.',
//     label: 'SOC-2 Ready',
//     icon: Shield,
//     badge: 'KMS Encrypted'
//   },
//   {
//     id: 'code-exec',
//     color: '#08101d',
//     title: 'Python Sandbox',
//     description: 'Generate, validate, and execute Python streaming parsers in an isolated compute runtime.',
//     label: 'Code Runtime',
//     icon: Code2,
//     badge: 'Python 3.11'
//   },
//   {
//     id: 'low-latency',
//     color: '#08101d',
//     title: 'Sub-Second Latency',
//     description: 'Stream answers at lightspeed with accelerated vector retrieval and KV-cache optimization.',
//     label: 'Engine Speed',
//     icon: Zap,
//     badge: '<18ms TTFT'
//   }
// ];

// const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
//   const el = document.createElement('div');
//   el.className = 'particle';
//   el.style.cssText = `
//     position: absolute;
//     width: 3.5px;
//     height: 3.5px;
//     border-radius: 50%;
//     background: rgba(${color}, 1);
//     box-shadow: 0 0 8px rgba(${color}, 0.8);
//     pointer-events: none;
//     z-index: 100;
//     left: ${x}px;
//     top: ${y}px;
//   `;
//   return el;
// };

// const calculateSpotlightValues = (radius) => ({
//   proximity: radius * 0.5,
//   fadeDistance: radius * 0.75
// });

// const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
//   const rect = card.getBoundingClientRect();
//   const relativeX = ((mouseX - rect.left) / rect.width) * 100;
//   const relativeY = ((mouseY - rect.top) / rect.height) * 100;

//   card.style.setProperty('--glow-x', `${relativeX}%`);
//   card.style.setProperty('--glow-y', `${relativeY}%`);
//   card.style.setProperty('--glow-intensity', glow.toString());
//   card.style.setProperty('--glow-radius', `${radius}px`);
// };

// const ParticleCard = ({
//   children,
//   className = '',
//   disableAnimations = false,
//   style,
//   particleCount = DEFAULT_PARTICLE_COUNT,
//   glowColor = DEFAULT_GLOW_COLOR,
//   enableTilt = true,
//   clickEffect = true,
//   enableMagnetism = true
// }) => {
//   const cardRef = useRef(null);
//   const particlesRef = useRef([]);
//   const timeoutsRef = useRef([]);
//   const isHoveredRef = useRef(false);
//   const memoizedParticles = useRef([]);
//   const particlesInitialized = useRef(false);
//   const magnetismAnimationRef = useRef(null);

//   const initializeParticles = useCallback(() => {
//     if (particlesInitialized.current || !cardRef.current) return;

//     const { width, height } = cardRef.current.getBoundingClientRect();
//     memoizedParticles.current = Array.from({ length: particleCount }, () =>
//       createParticleElement(Math.random() * width, Math.random() * height, glowColor)
//     );
//     particlesInitialized.current = true;
//   }, [particleCount, glowColor]);

//   const clearAllParticles = useCallback(() => {
//     timeoutsRef.current.forEach(clearTimeout);
//     timeoutsRef.current = [];
//     magnetismAnimationRef.current?.kill();

//     particlesRef.current.forEach((particle) => {
//       gsap.to(particle, {
//         scale: 0,
//         opacity: 0,
//         duration: 0.3,
//         ease: 'back.in(1.7)',
//         onComplete: () => {
//           particle.parentNode?.removeChild(particle);
//         }
//       });
//     });
//     particlesRef.current = [];
//   }, []);

//   const animateParticles = useCallback(() => {
//     if (!cardRef.current || !isHoveredRef.current) return;

//     if (!particlesInitialized.current) {
//       initializeParticles();
//     }

//     memoizedParticles.current.forEach((particle, index) => {
//       const timeoutId = setTimeout(() => {
//         if (!isHoveredRef.current || !cardRef.current) return;

//         const clone = particle.cloneNode(true);
//         cardRef.current.appendChild(clone);
//         particlesRef.current.push(clone);

//         gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

//         gsap.to(clone, {
//           x: (Math.random() - 0.5) * 80,
//           y: (Math.random() - 0.5) * 80,
//           rotation: Math.random() * 360,
//           duration: 2 + Math.random() * 2,
//           ease: 'none',
//           repeat: -1,
//           yoyo: true
//         });

//         gsap.to(clone, {
//           opacity: 0.25,
//           duration: 1.5,
//           ease: 'power2.inOut',
//           repeat: -1,
//           yoyo: true
//         });
//       }, index * 100);

//       timeoutsRef.current.push(timeoutId);
//     });
//   }, [initializeParticles]);

//   useEffect(() => {
//     if (disableAnimations || !cardRef.current) return;

//     const element = cardRef.current;

//     const handleMouseEnter = () => {
//       isHoveredRef.current = true;
//       animateParticles();

//       if (enableTilt) {
//         gsap.to(element, {
//           rotateX: 4,
//           rotateY: 4,
//           duration: 0.3,
//           ease: 'power2.out',
//           transformPerspective: 1000
//         });
//       }
//     };

//     const handleMouseLeave = () => {
//       isHoveredRef.current = false;
//       clearAllParticles();

//       if (enableTilt) {
//         gsap.to(element, {
//           rotateX: 0,
//           rotateY: 0,
//           duration: 0.3,
//           ease: 'power2.out'
//         });
//       }

//       if (enableMagnetism) {
//         gsap.to(element, {
//           x: 0,
//           y: 0,
//           duration: 0.3,
//           ease: 'power2.out'
//         });
//       }
//     };

//     const handleMouseMove = (e) => {
//       if (!enableTilt && !enableMagnetism) return;

//       const rect = element.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       const centerX = rect.width / 2;
//       const centerY = rect.height / 2;

//       if (enableTilt) {
//         const rotateX = ((y - centerY) / centerY) * -8;
//         const rotateY = ((x - centerX) / centerX) * 8;

//         gsap.to(element, {
//           rotateX,
//           rotateY,
//           duration: 0.1,
//           ease: 'power2.out',
//           transformPerspective: 1000
//         });
//       }

//       if (enableMagnetism) {
//         const magnetX = (x - centerX) * 0.04;
//         const magnetY = (y - centerY) * 0.04;

//         magnetismAnimationRef.current = gsap.to(element, {
//           x: magnetX,
//           y: magnetY,
//           duration: 0.3,
//           ease: 'power2.out'
//         });
//       }
//     };

//     const handleClick = (e) => {
//       if (!clickEffect) return;

//       const rect = element.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       const maxDistance = Math.max(
//         Math.hypot(x, y),
//         Math.hypot(x - rect.width, y),
//         Math.hypot(x, y - rect.height),
//         Math.hypot(x - rect.width, y - rect.height)
//       );

//       const ripple = document.createElement('div');
//       ripple.style.cssText = `
//         position: absolute;
//         width: ${maxDistance * 2}px;
//         height: ${maxDistance * 2}px;
//         border-radius: 50%;
//         background: radial-gradient(circle, rgba(${glowColor}, 0.35) 0%, rgba(${glowColor}, 0.15) 35%, transparent 70%);
//         left: ${x - maxDistance}px;
//         top: ${y - maxDistance}px;
//         pointer-events: none;
//         z-index: 1000;
//       `;

//       element.appendChild(ripple);

//       gsap.fromTo(
//         ripple,
//         { scale: 0, opacity: 1 },
//         {
//           scale: 1,
//           opacity: 0,
//           duration: 0.8,
//           ease: 'power2.out',
//           onComplete: () => ripple.remove()
//         }
//       );
//     };

//     element.addEventListener('mouseenter', handleMouseEnter);
//     element.addEventListener('mouseleave', handleMouseLeave);
//     element.addEventListener('mousemove', handleMouseMove);
//     element.addEventListener('click', handleClick);

//     // Mobile touch interaction support
//     const handleTouchStart = (e) => {
//       isHoveredRef.current = true;
//       animateParticles();
//       if (e.touches && e.touches[0]) {
//         const rect = element.getBoundingClientRect();
//         const x = e.touches[0].clientX - rect.left;
//         const y = e.touches[0].clientY - rect.top;
//         if (clickEffect) {
//           const ripple = document.createElement('div');
//           ripple.style.cssText = `
//             position: absolute;
//             width: 160px;
//             height: 160px;
//             border-radius: 50%;
//             background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.15) 40%, transparent 70%);
//             left: ${x - 80}px;
//             top: ${y - 80}px;
//             pointer-events: none;
//             z-index: 1000;
//           `;
//           element.appendChild(ripple);
//           gsap.fromTo(
//             ripple,
//             { scale: 0, opacity: 1 },
//             {
//               scale: 1.2,
//               opacity: 0,
//               duration: 0.6,
//               ease: 'power2.out',
//               onComplete: () => ripple.remove()
//             }
//           );
//         }
//       }
//     };

//     const handleTouchEnd = () => {
//       setTimeout(() => {
//         isHoveredRef.current = false;
//         clearAllParticles();
//       }, 800);
//     };

//     element.addEventListener('touchstart', handleTouchStart, { passive: true });
//     element.addEventListener('touchend', handleTouchEnd, { passive: true });
//     element.addEventListener('touchcancel', handleTouchEnd, { passive: true });

//     return () => {
//       isHoveredRef.current = false;
//       element.removeEventListener('mouseenter', handleMouseEnter);
//       element.removeEventListener('mouseleave', handleMouseLeave);
//       element.removeEventListener('mousemove', handleMouseMove);
//       element.removeEventListener('click', handleClick);
//       element.removeEventListener('touchstart', handleTouchStart);
//       element.removeEventListener('touchend', handleTouchEnd);
//       element.removeEventListener('touchcancel', handleTouchEnd);
//       clearAllParticles();
//     };
//   }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

//   return (
//     <div
//       ref={cardRef}
//       className={`${className} relative overflow-hidden`}
//       style={{ ...style, position: 'relative', overflow: 'hidden' }}
//     >
//       {children}
//     </div>
//   );
// };

// const GlobalSpotlight = ({
//   gridRef,
//   disableAnimations = false,
//   enabled = true,
//   spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
//   glowColor = DEFAULT_GLOW_COLOR
// }) => {
//   const spotlightRef = useRef(null);
//   const isInsideSection = useRef(false);

//   useEffect(() => {
//     if (disableAnimations || !gridRef?.current || !enabled) return;

//     const spotlight = document.createElement('div');
//     spotlight.className = 'global-spotlight';
//     spotlight.style.cssText = `
//       position: fixed;
//       width: 700px;
//       height: 700px;
//       border-radius: 50%;
//       pointer-events: none;
//       background: radial-gradient(circle,
//         rgba(${glowColor}, 0.12) 0%,
//         rgba(${glowColor}, 0.06) 20%,
//         rgba(${glowColor}, 0.02) 45%,
//         transparent 70%
//       );
//       z-index: 200;
//       opacity: 0;
//       transform: translate(-50%, -50%);
//       mix-blend-mode: screen;
//     `;
//     document.body.appendChild(spotlight);
//     spotlightRef.current = spotlight;

//     const handleMouseMove = (e) => {
//       if (!spotlightRef.current || !gridRef.current) return;

//       const section = gridRef.current.closest('.bento-section');
//       const rect = section?.getBoundingClientRect();
//       const mouseInside =
//         rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

//       isInsideSection.current = mouseInside || false;
//       const cards = gridRef.current.querySelectorAll('.card');

//       if (!mouseInside) {
//         gsap.to(spotlightRef.current, {
//           opacity: 0,
//           duration: 0.3,
//           ease: 'power2.out'
//         });
//         cards.forEach((card) => {
//           card.style.setProperty('--glow-intensity', '0');
//         });
//         return;
//       }

//       const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
//       let minDistance = Infinity;

//       cards.forEach((card) => {
//         const cardElement = card;
//         const cardRect = cardElement.getBoundingClientRect();
//         const centerX = cardRect.left + cardRect.width / 2;
//         const centerY = cardRect.top + cardRect.height / 2;
//         const distance =
//           Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
//         const effectiveDistance = Math.max(0, distance);

//         minDistance = Math.min(minDistance, effectiveDistance);

//         let glowIntensity = 0;
//         if (effectiveDistance <= proximity) {
//           glowIntensity = 1;
//         } else if (effectiveDistance <= fadeDistance) {
//           glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
//         }

//         updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
//       });

//       gsap.to(spotlightRef.current, {
//         left: e.clientX,
//         top: e.clientY,
//         duration: 0.1,
//         ease: 'power2.out'
//       });

//       const targetOpacity =
//         minDistance <= proximity
//           ? 0.8
//           : minDistance <= fadeDistance
//             ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
//             : 0;

//       gsap.to(spotlightRef.current, {
//         opacity: targetOpacity,
//         duration: targetOpacity > 0 ? 0.2 : 0.5,
//         ease: 'power2.out'
//       });
//     };

//     const handleMouseLeave = () => {
//       isInsideSection.current = false;
//       gridRef.current?.querySelectorAll('.card').forEach((card) => {
//         card.style.setProperty('--glow-intensity', '0');
//       });
//       if (spotlightRef.current) {
//         gsap.to(spotlightRef.current, {
//           opacity: 0,
//           duration: 0.3,
//           ease: 'power2.out'
//         });
//       }
//     };

//     const handleTouchMove = (e) => {
//       if (!spotlightRef.current || !gridRef.current || !e.touches || !e.touches[0]) return;
//       const touch = e.touches[0];
//       handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
//     };

//     const handleTouchEnd = () => {
//       handleMouseLeave();
//     };

//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseleave', handleMouseLeave);
//     document.addEventListener('touchmove', handleTouchMove, { passive: true });
//     document.addEventListener('touchend', handleTouchEnd, { passive: true });

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseleave', handleMouseLeave);
//       document.removeEventListener('touchmove', handleTouchMove);
//       document.removeEventListener('touchend', handleTouchEnd);
//       spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
//     };
//   }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

//   return null;
// };

// const BentoCardGrid = ({ children, gridRef }) => (
//   <div
//     className="bento-section grid gap-4 p-2 max-w-6xl mx-auto select-none relative"
//     ref={gridRef}
//   >
//     {children}
//   </div>
// );

// const useMobileDetection = () => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

//     checkMobile();
//     window.addEventListener('resize', checkMobile);

//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   return isMobile;
// };

// export const MagicBento = ({
//   textAutoHide = false,
//   enableStars = true,
//   enableSpotlight = true,
//   enableBorderGlow = true,
//   disableAnimations = false,
//   spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
//   particleCount = DEFAULT_PARTICLE_COUNT,
//   enableTilt = true,
//   glowColor = DEFAULT_GLOW_COLOR,
//   clickEffect = true,
//   enableMagnetism = true,
//   cards = lucyBentoCardData
// }) => {
//   const gridRef = useRef(null);
//   const isMobile = useMobileDetection();
//   const shouldDisableAnimations = disableAnimations || isMobile;

//   return (
//     <div className="w-full relative">
//       <style>
//         {`
//           .bento-section {
//             --glow-x: 50%;
//             --glow-y: 50%;
//             --glow-intensity: 0;
//             --glow-radius: 240px;
//             --glow-color: ${glowColor};
//             --border-color: #1e293b;
//             --background-dark: #08101d;
//             --white: #f4f4f5;
//             --cyan-primary: rgba(56, 189, 248, 1);
//             --cyan-glow: rgba(56, 189, 248, 0.2);
//             --cyan-border: rgba(56, 189, 248, 0.8);
//           }
          
//           .card-responsive {
//             grid-template-columns: 1fr;
//             width: 100%;
//             margin: 0 auto;
//           }
          
//           @media (min-width: 640px) {
//             .card-responsive {
//               grid-template-columns: repeat(2, 1fr);
//             }
//           }
          
//           @media (min-width: 1024px) {
//             .card-responsive {
//               grid-template-columns: repeat(3, 1fr);
//             }
            
//             .card-responsive .card:nth-child(3) {
//               grid-column: 3;
//               grid-row: span 2;
//             }
            
//             .card-responsive .card:nth-child(4) {
//               grid-column: span 2;
//             }
//           }
          
//           .card--border-glow::after {
//             content: '';
//             position: absolute;
//             inset: 0;
//             padding: 1.5px;
//             background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
//                 rgba(${glowColor}, calc(var(--glow-intensity) * 0.9)) 0%,
//                 rgba(${glowColor}, calc(var(--glow-intensity) * 0.35)) 35%,
//                 transparent 70%);
//             border-radius: inherit;
//             -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
//             -webkit-mask-composite: xor;
//             mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
//             mask-composite: exclude;
//             pointer-events: none;
//             opacity: 1;
//             transition: opacity 0.3s ease;
//             z-index: 2;
//           }
          
//           .card--border-glow:hover {
//             box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 35px rgba(${glowColor}, 0.2);
//           }
//         `}
//       </style>

//       {enableSpotlight && (
//         <GlobalSpotlight
//           gridRef={gridRef}
//           disableAnimations={shouldDisableAnimations}
//           enabled={enableSpotlight}
//           spotlightRadius={spotlightRadius}
//           glowColor={glowColor}
//         />
//       )}

//       <BentoCardGrid gridRef={gridRef}>
//         <div className="card-responsive grid gap-5">
//           {cards.map((card, index) => {
//             const Icon = card.icon || Sparkles;
//             const baseClassName = `card flex flex-col justify-between relative min-h-[180px] sm:min-h-[220px] w-full p-5 sm:p-7 rounded-2xl border border-[#1e293b] overflow-hidden transition-all duration-300 ease-in-out hover:border-[#38bdf8]/50 hover:-translate-y-1 active:scale-[0.98] active:border-[#38bdf8]/30 touch-manipulation ${
//               enableBorderGlow ? 'card--border-glow' : ''
//             }`;

//             const cardStyle = {
//               backgroundColor: card.color || 'var(--background-dark)',
//               borderColor: '#1e293b',
//               color: 'var(--white)',
//               '--glow-x': '50%',
//               '--glow-y': '50%',
//               '--glow-intensity': '0',
//               '--glow-radius': '240px'
//             };

//             const CardInnerContent = () => (
//               <div className="flex flex-col justify-between h-full space-y-4">
//                 <div className="flex items-start justify-between gap-3 relative">
//                   <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.2)]">
//                     <Icon className="w-5 h-5" />
//                   </div>
//                   <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#38bdf8] bg-[#38bdf8]/10 px-2.5 py-1 rounded-full border border-[#38bdf8]/30 font-semibold tracking-wide">
//                     <span>{card.badge || card.label}</span>
//                   </div>
//                 </div>

//                 <div className="flex flex-col relative space-y-2">
//                   <h3
//                     className="font-bold text-lg sm:text-xl text-[#f4f4f5] tracking-tight group-hover:text-[#38bdf8] transition-colors"
//                     style={{ fontFamily: 'Sora, sans-serif' }}
//                   >
//                     {card.title}
//                   </h3>
//                   <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-sans">
//                     {card.description}
//                   </p>
//                 </div>
//               </div>
//             );

//             if (enableStars) {
//               return (
//                 <ParticleCard
//                   key={card.id || index}
//                   className={baseClassName}
//                   style={cardStyle}
//                   disableAnimations={shouldDisableAnimations}
//                   particleCount={particleCount}
//                   glowColor={glowColor}
//                   enableTilt={enableTilt}
//                   clickEffect={clickEffect}
//                   enableMagnetism={enableMagnetism}
//                 >
//                   <CardInnerContent />
//                 </ParticleCard>
//               );
//             }

//             return (
//               <div
//                 key={card.id || index}
//                 className={baseClassName}
//                 style={cardStyle}
//               >
//                 <CardInnerContent />
//               </div>
//             );
//           })}
//         </div>
//       </BentoCardGrid>
//     </div>
//   );
// };

// export default MagicBento;


import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import {
  UploadCloud,
  ShieldCheck,
  MessageSquareText,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '56, 189, 248'; // Electric Cyan (#38bdf8)
const MOBILE_BREAKPOINT = 768;

export const lucyBentoCardData = [
  {
    id: 'instant-upload',
    color: '#08101d',
    title: 'Upload Any Document & Ask Instantly',
    description: 'Upload PDFs and ask questions right away—extraction, chunking, and indexing happen automatically, no setup required.',
    label: 'Instant Ingestion',
    icon: UploadCloud,
    badge: 'Zero Setup'
  },
  {
    id: 'isolated-data',
    color: '#08101d',
    title: 'Your Data, Isolated & Private',
    description: 'Every user gets their own private FAISS vector index—no cross-contamination, no accidental leaks.',
    label: 'Per-User Isolation',
    icon: ShieldCheck,
    badge: 'Data Sovereign'
  },
  {
    id: 'context-aware',
    color: '#091424',
    title: 'Smart Context-Aware Answers',
    description: 'A calibrated system prompt distinguishes casual chat, document questions, and general knowledge—and admits it when the answer isn\'t in your docs.',
    label: 'Calibrated Reasoning',
    icon: MessageSquareText,
    badge: 'Trust Built'
  }
];

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 3.5px;
    height: 3.5px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 8px rgba(${color}, 0.8);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.25,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 4,
          rotateY: 4,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = (e) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.04;
        const magnetY = (y - centerY) * 0.04;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = (e) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.35) 0%, rgba(${glowColor}, 0.15) 35%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    // Mobile touch interaction support
    const handleTouchStart = (e) => {
      isHoveredRef.current = true;
      animateParticles();
      if (e.touches && e.touches[0]) {
        const rect = element.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        if (clickEffect) {
          const ripple = document.createElement('div');
          ripple.style.cssText = `
            position: absolute;
            width: 160px;
            height: 160px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.15) 40%, transparent 70%);
            left: ${x - 80}px;
            top: ${y - 80}px;
            pointer-events: none;
            z-index: 1000;
          `;
          element.appendChild(ripple);
          gsap.fromTo(
            ripple,
            { scale: 0, opacity: 1 },
            {
              scale: 1.2,
              opacity: 0,
              duration: 0.6,
              ease: 'power2.out',
              onComplete: () => ripple.remove()
            }
          );
        }
      }
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        isHoveredRef.current = false;
        clearAllParticles();
      }, 800);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 700px;
      height: 700px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.12) 0%,
        rgba(${glowColor}, 0.06) 20%,
        rgba(${glowColor}, 0.02) 45%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach((card) => {
          card.style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardElement = card;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach((card) => {
        card.style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleTouchMove = (e) => {
      if (!spotlightRef.current || !gridRef.current || !e.touches || !e.touches[0]) return;
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    };

    const handleTouchEnd = () => {
      handleMouseLeave();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <div
    className="bento-section grid gap-4 p-2 max-w-6xl mx-auto select-none relative"
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export const MagicBento = ({
  textAutoHide = false,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  cards = lucyBentoCardData
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <div className="w-full relative">
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 240px;
            --glow-color: ${glowColor};
            --border-color: #1e293b;
            --background-dark: #08101d;
            --white: #f4f4f5;
            --cyan-primary: rgba(56, 189, 248, 1);
            --cyan-glow: rgba(56, 189, 248, 0.2);
            --cyan-border: rgba(56, 189, 248, 0.8);
          }
          
          .card-responsive {
            grid-template-columns: 1fr;
            width: 100%;
            margin: 0 auto;
          }
          
          @media (min-width: 640px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
            }

            .card-responsive .card:nth-child(3) {
              grid-column: 1 / span 2;
              max-width: calc(50% - 0.625rem);
              justify-self: center;
            }
          }
          
          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 1.5px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.9)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.35)) 35%,
                transparent 70%);
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
            z-index: 2;
          }
          
          .card--border-glow:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 35px rgba(${glowColor}, 0.2);
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive grid gap-5">
          {cards.map((card, index) => {
            const Icon = card.icon || Sparkles;
            const baseClassName = `card flex flex-col justify-between relative min-h-[180px] sm:min-h-[220px] w-full p-5 sm:p-7 rounded-2xl border border-[#1e293b] overflow-hidden transition-all duration-300 ease-in-out hover:border-[#38bdf8]/50 hover:-translate-y-1 active:scale-[0.98] active:border-[#38bdf8]/30 touch-manipulation ${
              enableBorderGlow ? 'card--border-glow' : ''
            }`;

            const cardStyle = {
              backgroundColor: card.color || 'var(--background-dark)',
              borderColor: '#1e293b',
              color: 'var(--white)',
              '--glow-x': '50%',
              '--glow-y': '50%',
              '--glow-intensity': '0',
              '--glow-radius': '240px'
            };

            const CardInnerContent = () => (
              <div className="flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start justify-between gap-3 relative">
                  <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#38bdf8] bg-[#38bdf8]/10 px-2.5 py-1 rounded-full border border-[#38bdf8]/30 font-semibold tracking-wide">
                    <span>{card.badge || card.label}</span>
                  </div>
                </div>

                <div className="flex flex-col relative space-y-2">
                  <h3
                    className="font-bold text-lg sm:text-xl text-[#f4f4f5] tracking-tight group-hover:text-[#38bdf8] transition-colors"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>
              </div>
            );

            if (enableStars) {
              return (
                <ParticleCard
                  key={card.id || index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  <CardInnerContent />
                </ParticleCard>
              );
            }

            return (
              <div
                key={card.id || index}
                className={baseClassName}
                style={cardStyle}
              >
                <CardInnerContent />
              </div>
            );
          })}
        </div>
      </BentoCardGrid>
    </div>
  );
};

export default MagicBento;