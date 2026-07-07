import { motion } from "framer-motion";
import { Sparkles, Camera, Compass, Languages } from "lucide-react";

const items = [
  { icon: Sparkles, title: "Simplify Government Info", desc: "GenAI explains schemes and legal text in plain, friendly language." },
  { icon: Camera, title: "Report & Track Issues", desc: "Photo-based complaint filing with a live, transparent status tracker." },
  { icon: Compass, title: "Personalized Recommendations", desc: "Suggests relevant schemes based on your profile and locality." },
  { icon: Languages, title: "Multilingual by Default", desc: "Full support for Hindi, Telugu, and English — extendable to all 22." },
];

export function Features() {
  return (
    <section id="features" className="py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-saffron mb-3">Core Features</div>
          <h2 className="font-display font-black text-4xl md:text-6xl">A civic toolkit, reimagined.</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 group hover:shadow-[0_20px_60px_-20px_oklch(0.78_0.17_60/0.5)] transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-saffron/10 grid place-items-center text-saffron mb-5 group-hover:bg-saffron group-hover:text-primary-foreground transition">
                <it.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl leading-tight">{it.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
