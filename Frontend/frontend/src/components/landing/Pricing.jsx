import { useState } from "react";

const plans = [
  { name: "Free Trial", price: "$0", note: "No card required", features: ["Priority email support", "Access core features", "1,000 messages/mo"] },
  { name: "Professional", price: "$19.99", note: "per month", features: ["Priority email & chat", "Access all features", "10,000 messages/mo", "Custom branding"], highlighted: true },
  { name: "Premium", price: "$49.99", note: "per month", features: ["Priority email & chat", "Access all features", "Unlimited messages", "Custom branding", "Dedicated support"] },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="bg-bg-muted px-8 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary">Personalized Pricing Plans</h2>

        {/* <div className="mx-auto mt-6 flex w-fit items-center gap-1 rounded-full border border-border bg-bg-panel p-1">
          <button
            onClick={() => setYearly(false)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${!yearly ? "bg-brand text-white" : "text-text-muted"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${yearly ? "bg-brand text-white" : "text-text-muted"}`}
          >
            Yearly
          </button>
        </div> */}

        <div className="mt-10 grid items-stretch gap-6 md:grid-cols-3">
  {plans.map((p) => (
    <div
  key={p.name}
  className={`flex flex-col rounded-2xl border p-6 pb-6 text-left ${
    p.highlighted ? "border-brand bg-bg-panel shadow-lg" : "border-border bg-bg-panel"
  }`}
>
  <h3 className="font-display text-lg font-semibold text-text-primary">{p.name}</h3>
  <div className="mt-2 font-display text-2xl font-bold text-text-primary">{p.price}</div>
  <div className="text-[12px] text-text-faint">{p.note}</div>
  <ul className="mt-5 flex flex-col gap-2">
    {p.features.map((f) => (
      <li key={f} className="flex items-center gap-2 text-[13px] text-text-muted">
        <span className="text-brand">✓</span> {f}
      </li>
    ))}
  </ul>
  <div className="mt-auto pt-8">
    <button className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
      Choose Plan
    </button>
  </div>
</div>
  ))}
</div>
      </div>
    </section>
  );
}