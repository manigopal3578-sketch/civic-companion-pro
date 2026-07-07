import { motion } from "framer-motion";
import { Camera, MapPin, Send } from "lucide-react";

export function Report() {
  return (
    <section id="report" className="py-24 px-6">
      <div className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="text-xs uppercase tracking-widest text-saffron mb-3">Report an Issue</div>
          <h2 className="font-display font-black text-3xl md:text-5xl leading-tight">One photo. One tap. Full accountability.</h2>
          <p className="text-muted-foreground mt-4">Broken road? Water leak? Snap it, drop the pin, hit send. We route it to the right department and keep you posted.</p>
          <button onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })} className="btn-saffron mt-6 inline-flex items-center gap-2">
            <Send className="w-4 h-4" /> Start a Report
          </button>
        </div>
        <div className="space-y-3">
          {[
            { icon: Camera, label: "Attach a photo of the issue" },
            { icon: MapPin, label: "Auto-detect your location" },
            { icon: Send, label: "Track status until resolved" },
          ].map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border"
            >
              <div className="w-10 h-10 rounded-xl bg-saffron/10 text-saffron grid place-items-center shrink-0">
                <r.icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-medium">{r.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
