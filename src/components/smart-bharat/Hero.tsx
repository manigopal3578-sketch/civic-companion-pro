import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChakraIcon } from "./ChakraIcon";
import { Counter } from "./Counter";
import { ArrowRight, MessageCircle } from "lucide-react";

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex items-center overflow-hidden grain-overlay">
      <motion.div
        style={{ y: bgY, backgroundImage: "url(https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg)" }}
        className="absolute inset-0 bg-cover bg-center scale-110"
      />
      <div className="absolute inset-0 mesh-bg opacity-60 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />

      <ChakraIcon className="absolute right-[-80px] top-1/4 w-[380px] h-[380px] text-saffron/20 animate-spin-slow hidden md:block" />
      <div className="absolute left-8 bottom-32 w-24 h-24 text-amber-glow/30 animate-float hidden lg:block">
        <ChakraIcon className="w-full h-full" />
      </div>

      <motion.div style={{ y: textY }} className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs text-amber-glow">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
            AI Civic Companion · Live for Bharat
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl">
            Smart Bharat —{" "}
            <span className="bg-gradient-to-r from-saffron via-amber-glow to-saffron bg-clip-text text-transparent">
              Your AI Civic Companion
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Access government services, report public issues, and get personalized help — in your own language, in seconds.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button onClick={() => scrollTo("demo")} className="btn-saffron inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Ask the Companion
            </button>
            <button onClick={() => scrollTo("report")} className="btn-outline inline-flex items-center gap-2">
              Report an Issue <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-border/50 max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
              Built for Bharat's 1.4 Billion Citizens
            </p>
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              {[
                { n: 28, s: "", label: "States Covered" },
                { n: 12, s: "+", label: "Languages" },
                { n: 24, s: "/7", label: "Availability" },
              ].map((x) => (
                <div key={x.label}>
                  <div className="font-display font-black text-3xl md:text-5xl text-saffron">
                    <Counter to={x.n} suffix={x.s} />
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{x.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
