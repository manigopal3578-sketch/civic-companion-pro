import { motion } from "framer-motion";
import { FileWarning, Search, Languages } from "lucide-react";

const problems = [
  { icon: FileWarning, title: "Complex paperwork & jargon", desc: "Legal-heavy scheme documents that most citizens struggle to decode." },
  { icon: Search, title: "No single place to track complaints", desc: "Filed a grievance? You're stuck refreshing five different portals." },
  { icon: Languages, title: "Language barriers for rural citizens", desc: "English-first interfaces exclude the majority of Bharat." },
];

export function Problem() {
  return (
    <section id="problem" className="relative py-28 px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 photo-cool"
        style={{ backgroundImage: "url(https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-xs uppercase tracking-widest text-saffron mb-4">The Problem</div>
          <h2 className="font-display font-black text-4xl md:text-6xl leading-tight">
            Government services shouldn't feel like a <span className="italic text-amber-glow">maze.</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-md">
            Millions of citizens spend hours navigating portals, queues, and paperwork just to access services meant for them.
          </p>
        </motion.div>
        <div className="space-y-5">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 flex gap-5 hover:border-saffron/40 transition-colors"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-saffron/10 grid place-items-center text-saffron">
                <p.icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-xl">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
