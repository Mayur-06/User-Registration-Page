// const features = [
//   { title: "Fast Response", desc: "Get quick, efficient replies every time." },
//   { title: "High Quality", desc: "Answers tailored to your specific needs." },
//   { title: "40+ Languages", desc: "Communicate effortlessly in your language." },
//   { title: "24/7 Support", desc: "Always available, whenever you need it." },
// ];

// export default function Features() {
//   return (
//     <section id="features" className="bg-bg-muted px-8 py-16">
//       <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         {features.map((f) => (
//           <div key={f.title} className="rounded-2xl border border-border bg-bg-panel p-6">
//             <div className="mb-3 h-10 w-10 rounded-lg bg-brand/10" />
//             <h3 className="font-display text-sm font-semibold text-text-primary">{f.title}</h3>
//             <p className="mt-1 text-[13px] text-text-muted">{f.desc}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

import { Zap, Sparkles, Clock } from "lucide-react";

const features = [
  { icon: Zap, title: "Fast Response", desc: "Get quick, efficient replies every time." },
  { icon: Sparkles, title: "High Quality", desc: "Answers tailored to your specific needs." },
  { icon: Clock, title: "24/7 Support", desc: "Always available, whenever you need it." },
];

export default function Features() {
  return (
    <section id="features" className="bg-bg-muted px-8 py-16">
      <h2 className="text-center font-display text-3xl font-bold text-text-primary">
        Our Core Features
      </h2>

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="rounded-2xl border border-border bg-bg-panel p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10">
                <Icon size={22} className="text-brand" />
              </div>
              <h3 className="font-display text-base font-semibold text-text-primary">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-text-muted">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}