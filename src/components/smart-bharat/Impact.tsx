import { Counter } from "./Counter";

export function Impact() {
  return (
    <section id="impact" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-card to-background" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay photo-cool"
        style={{ backgroundImage: "url(https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg)" }}
      />
      <div className="absolute inset-0 bg-background/40" />
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="text-xs uppercase tracking-widest text-saffron mb-3">Real Impact</div>
        <h2 className="font-display font-black text-4xl md:text-6xl text-foreground mb-14">
          Numbers that speak for Bharat.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { n: 10000, s: "+", label: "Citizens Helped" },
            { n: 500, s: "+", label: "Schemes Indexed" },
            { n: 95, s: "%", label: "Query Accuracy" },
          ].map((x) => (
            <div key={x.label} className="glass rounded-3xl p-8 bg-card/40">
              <div className="font-display font-black text-5xl md:text-7xl text-saffron">
                <Counter to={x.n} suffix={x.s} />
              </div>
              <div className="text-sm text-muted-foreground mt-3 uppercase tracking-widest">{x.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
