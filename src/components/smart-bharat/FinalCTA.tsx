export function FinalCTA() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2.5rem] p-12 md:p-20 text-center grain-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-saffron via-amber-glow to-teal-deep" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        <div className="relative">
          <h2 className="font-display font-black text-4xl md:text-6xl text-primary-foreground leading-tight max-w-3xl mx-auto">
            Ready to make civic access effortless?
          </h2>
          <p className="text-primary-foreground/80 mt-5 max-w-xl mx-auto">Join thousands of citizens already using Smart Bharat to navigate their government.</p>
          <button
            onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 inline-flex items-center gap-2 bg-background text-foreground font-bold px-8 py-4 rounded-full hover:scale-105 transition shadow-2xl"
          >
            Start with Smart Bharat
          </button>
        </div>
      </div>
    </section>
  );
}
