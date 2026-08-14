// import { useEffect, useState } from "react";

// // function randomChunk(len) {
// //   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
// //   return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
// // }

// export default function TokenCard({ signed = false, instant = false }) {
//   const [segments] = useState({
//     header: randomChunk(8),
//     payload: randomChunk(28),
//     signature: randomChunk(14),
//   });
//   const [active, setActive] = useState(instant && signed ? [true, true, true] : [false, false, false]);

//   useEffect(() => {
//     if (!signed || instant) return;
//     const timers = [
//       setTimeout(() => setActive([true, false, false]), 80),
//       setTimeout(() => setActive([true, true, false]), 260),
//       setTimeout(() => setActive([true, true, true]), 440),
//     ];
//     return () => timers.forEach(clearTimeout);
//   }, [signed, instant]);

//   const fullyLit = signed && active[2];

//   return (
//     <div
//       className={`flex w-full overflow-hidden rounded-xl border bg-bg-panel transition-all duration-500 ${
//         fullyLit
//           ? "border-brand/50 shadow-[0_0_20px_-6px_var(--color-brand)]"
//           : "border-border"
//       }`}
//     >
//       <TokenSegment label="HDR" value={segments.header} lit={active[0]} flexGrow={1} />
//       <Divider lit={active[0]} />
//       <TokenSegment label="PAYLOAD" value={segments.payload} lit={active[1]} flexGrow={3} />
//       <Divider lit={active[1]} />
//       <TokenSegment label="SIGNATURE" value={segments.signature} lit={active[2]} flexGrow={1.6} />
//     </div>
//   );
// }

// function Divider({ lit }) {
//   return (
//     <div
//       className={`w-px shrink-0 transition-colors duration-300 ${
//         lit ? "bg-brand" : "bg-border"
//       }`}
//     />
//   );
// }

// function TokenSegment({ label, value, lit, flexGrow }) {
//   return (
//     <div
//       style={{ flexGrow }}
//       className={`min-w-0 px-3 py-2.5 transition-colors duration-300 ${
//         lit ? "bg-brand/5" : "bg-transparent"
//       }`}
//     >
//       <div
//         className={`mb-1 text-[9px] font-semibold tracking-widest transition-colors duration-300 ${
//           lit ? "text-brand" : "text-text-faint"
//         }`}
//       >
//         {label}
//       </div>
//       <div
//         className={`truncate font-mono text-[11px] transition-colors duration-300 ${
//           lit ? "text-text-primary" : "text-text-muted"
//         }`}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }