const features = [
  { title: "Fast Response", desc: "Get quick, efficient replies every time." },
  { title: "High Quality", desc: "Answers tailored to your specific needs." },
  { title: "40+ Languages", desc: "Communicate effortlessly in your language." },
  { title: "24/7 Support", desc: "Always available, whenever you need it." },
];

export default function Features() {
  return (
    <section id="features" className="bg-bg-muted px-8 py-16">
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-bg-panel p-6">
            <div className="mb-3 h-10 w-10 rounded-lg bg-brand/10" />
            <h3 className="font-display text-sm font-semibold text-text-primary">{f.title}</h3>
            <p className="mt-1 text-[13px] text-text-muted">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}