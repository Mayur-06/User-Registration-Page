import { useEffect, useState } from "react";

function randomChunk(len) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

//false renders the dim resting state,
//true triggers the left-to-right lighting sequence.
function LoadingCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/4 p-7 backdrop-blur-xl">
      <div className="mb-6 h-2 w-24 rounded-full bg-white/10" />
      <div className="mb-7 flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-white/10" />
          <div className="h-3 w-40 rounded bg-white/5" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
        <div className="h-8 rounded bg-white/5" />
        <div className="h-8 rounded bg-white/5" />
      </div>
    </div>
  );
}

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

//   return (
//     <div
//       className={`flex w-full overflow-hidden rounded-xl border transition-all duration-500 ${
//         signed && active[2]
//           ? "border-accent-cyan/60 shadow-[0_0_24px_-4px_var(--color-accent-cyan)]"
//           : "border-white/10"
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

export default function TokenCard({ signed = false, instant = false }) {
  const [segments] = useState({
    header: randomChunk(8),
    payload: randomChunk(28),
    signature: randomChunk(14),
  });
  const [active, setActive] = useState(instant && signed ? [true, true, true] : [false, false, false]);

  useEffect(() => {
    if (!signed || instant) return;
    const timers = [
      setTimeout(() => setActive([true, false, false]), 80),
      setTimeout(() => setActive([true, true, false]), 260),
      setTimeout(() => setActive([true, true, true]), 440),
    ];
    return () => timers.forEach(clearTimeout);
  }, [signed, instant]);

  const fullyLit = signed && active[2];

  return (
    <div
      className={`flex w-full overflow-hidden rounded-xl border transition-all duration-500 ${
        fullyLit
          ? "border-accent-cyan/60 shadow-[0_0_24px_-4px_var(--color-accent-cyan)]"
          : "border-accent-cyan/15 shadow-[0_0_14px_-6px_var(--color-accent-cyan)]"
      }`}
    >
      <TokenSegment label="HDR" value={segments.header} lit={active[0]} flexGrow={1} />
      <Divider lit={active[0]} />
      <TokenSegment label="PAYLOAD" value={segments.payload} lit={active[1]} flexGrow={3} />
      <Divider lit={active[1]} />
      <TokenSegment label="SIGNATURE" value={segments.signature} lit={active[2]} flexGrow={1.6} />
    </div>
  );
}

//components

function Divider({ lit }) {
  return (
    <div
      className={`w-px shrink-0 transition-colors duration-300 ${
        lit ? "bg-accent-cyan" : "bg-white/10"
      }`}
    />
  );
}

function TokenSegment({ label, value, lit, flexGrow }) {
  return (
    <div
      style={{ flexGrow }}
      className={`min-w-0 px-3 py-2.5 transition-colors duration-300 ${
        lit ? "bg-white/[0.07]" : "bg-white/[0.02]"
      }`}
    >
      <div
        className={`mb-1 text-[9px] font-semibold tracking-widest transition-colors duration-300 ${
          lit ? "text-accent-cyan" : "text-text-muted"
        }`}
      >
        {label}
      </div>
      <div
        className={`truncate font-mono text-[11px] transition-colors duration-300 ${
          lit ? "text-text-primary" : "text-text-muted/60"
        }`}
      >
        {value}
      </div>
    </div>
  );
}


