import { useState } from "react";

const faqs = [
  { q: "What is LucyChat?", a: "An AI-powered conversational assistant that helps answer questions instantly based on you document." },
  { q: "How is data security ensured?", a: "All data is encrypted in transit and at rest, with strict access controls." },
  { q: "How does the AI learn?", a: "The assistant improves through continuous refinement based on real interactions." },
  { q: "What are the benefits for my business?", a: "Faster response times, lower support costs, and 24/7 availability." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="px-8 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-3xl font-bold text-text-primary">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 flex flex-col divide-y divide-border border-t border-border">
          {faqs.map((f, i) => (
            <div key={f.q} className="py-4">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-text-primary">{f.q}</span>
                <span className="text-text-faint">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <p className="mt-2 text-[13px] text-text-muted">{f.a}</p>}
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand to-accent-violet p-8 text-center text-white md:flex-row md:text-left">
          <div>
            <h3 className="font-display text-xl font-semibold">Start with a 14-Day Free Trial</h3>
            <p className="mt-1 text-sm text-white/80">Try it out before committing to a plan.</p>
          </div>
          <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand hover:bg-white/90">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}