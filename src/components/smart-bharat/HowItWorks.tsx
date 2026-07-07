import { motion } from "framer-motion";
import { MessageSquare, Brain, ListChecks, Activity } from "lucide-react";

const steps = [
  { icon: MessageSquare, title: "Ask or Upload", desc: "Ask your question or upload a document." },
  { icon: Brain, title: "AI Understands", desc: "AI understands intent & simplifies the answer." },
  { icon: ListChecks, title: "Get Matched", desc: "Receive matched schemes with step-by-step guidance." },
  { icon: Activity, title: "Track & Resolve", desc: "Track your request until it's fully resolved." },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-saffron mb-3">How It Works</div>
          <h2 className="font-display font-black text-4xl md:text-6xl">Four steps. Zero friction.</h2>
        </motion.div>
        <div className="relative">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-saffron to-transparent origin-left"
          />
          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-saffron to-amber-glow grid place-items-center text-primary-foreground mb-4 relative z-10 shadow-[0_10px_30px_-10px_oklch(0.78_0.17_60/0.6)]">
                  <s.icon className="w-7 h-7" />
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Step {i + 1}</div>
                <h3 className="font-display font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground max-w-[220px] mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
