import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileText, Search, ClipboardList, Globe, CheckCircle2, Circle, Loader2 } from "lucide-react";

type Lang = "en" | "hi" | "te";
const langNames: Record<Lang, string> = { en: "English", hi: "हिन्दी", te: "తెలుగు" };

const script: Record<Lang, { user: string; bot: string; docs: string[]; steps: string[]; statusLabel: string }> = {
  en: {
    user: "How do I apply for a ration card?",
    bot: "Great — I'll walk you through it. You'll need your Aadhaar card and address proof. Here's your checklist and live application status:",
    docs: ["Aadhaar Card", "Address Proof (Utility Bill)", "Passport-size Photo", "Income Certificate"],
    steps: ["Application Submitted", "Document Verification", "Field Visit", "Card Issued"],
    statusLabel: "Application Progress",
  },
  hi: {
    user: "मैं राशन कार्ड के लिए कैसे आवेदन करूँ?",
    bot: "बहुत अच्छा — मैं आपको समझाता हूँ। आपको अपना आधार कार्ड और पते का प्रमाण चाहिए। यह रही आपकी सूची और लाइव स्थिति:",
    docs: ["आधार कार्ड", "पते का प्रमाण (बिजली बिल)", "पासपोर्ट फोटो", "आय प्रमाण पत्र"],
    steps: ["आवेदन जमा किया गया", "दस्तावेज़ सत्यापन", "फ़ील्ड विज़िट", "कार्ड जारी"],
    statusLabel: "आवेदन की प्रगति",
  },
  te: {
    user: "నేను రేషన్ కార్డ్ కోసం ఎలా దరఖాస్తు చేయాలి?",
    bot: "సరే — నేను మీకు వివరిస్తాను. మీకు మీ ఆధార్ కార్డ్ మరియు చిరునామా రుజువు అవసరం. ఇదిగో మీ చెక్‌లిస్ట్ మరియు ప్రత్యక్ష స్థితి:",
    docs: ["ఆధార్ కార్డ్", "చిరునామా రుజువు (విద్యుత్ బిల్లు)", "పాస్‌పోర్ట్ ఫోటో", "ఆదాయ ధృవీకరణ పత్రం"],
    steps: ["దరఖాస్తు సమర్పించబడింది", "పత్రాల ధృవీకరణ", "క్షేత్ర సందర్శన", "కార్డ్ జారీ"],
    statusLabel: "దరఖాస్తు పురోగతి",
  },
};

const chips = [
  { icon: Search, label: "Find a Scheme" },
  { icon: ClipboardList, label: "Track My Complaint" },
  { icon: FileText, label: "Document Checklist" },
];

export function Demo() {
  const [lang, setLang] = useState<Lang>("en");
  const [stage, setStage] = useState(0); // 0 idle, 1 user msg, 2 typing, 3 bot msg, 4 docs, 5 status
  const [progress, setProgress] = useState(0);
  const messagesRef = useRef<HTMLDivElement>(null);

  const s = script[lang];

  const startDemo = () => {
    setStage(0); setProgress(0);
    setTimeout(() => setStage(1), 200);
    setTimeout(() => setStage(2), 900);
    setTimeout(() => setStage(3), 2400);
    setTimeout(() => setStage(4), 3200);
    setTimeout(() => setStage(5), 4000);
  };

  useEffect(() => {
    if (stage === 5) {
      let p = 0;
      const id = setInterval(() => {
        p += 2;
        setProgress(p);
        if (p >= 65) clearInterval(id);
      }, 30);
      return () => clearInterval(id);
    }
  }, [stage]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [stage]);

  return (
    <section id="demo" className="relative py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="text-xs uppercase tracking-widest text-saffron mb-3">Live Demo</div>
          <h2 className="font-display font-black text-4xl md:text-6xl">Meet your Companion.</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Ask anything. Switch language. Get real answers, real checklists, real tracking.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="glass rounded-3xl p-5 space-y-2 h-fit">
            <div className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-2">Quick Actions</div>
            {chips.map((c) => (
              <button key={c.label} onClick={startDemo} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-saffron/10 text-left text-sm transition">
                <c.icon className="w-4 h-4 text-saffron shrink-0" /> {c.label}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-border">
              <div className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-2 flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> Language
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(Object.keys(langNames) as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setStage(0); }}
                    className={`px-2 py-2 rounded-lg text-xs font-semibold transition ${lang === l ? "bg-saffron text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted"}`}
                  >
                    {langNames[l]}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="glass rounded-3xl flex flex-col min-h-[560px] overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-amber-glow grid place-items-center text-primary-foreground font-black">SB</div>
              <div>
                <div className="font-semibold text-sm">Smart Bharat Companion</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Online · {langNames[lang]}
                </div>
              </div>
            </div>

            <div ref={messagesRef} className="flex-1 overflow-y-auto p-5 space-y-4">
              {stage === 0 && (
                <div className="h-full grid place-items-center text-center">
                  <div>
                    <p className="text-muted-foreground text-sm mb-4">Click a quick action or the button below to see the Companion in action.</p>
                    <button onClick={startDemo} className="btn-saffron">Ask the Companion</button>
                  </div>
                </div>
              )}
              {stage >= 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end">
                  <div className="max-w-[80%] bg-saffron text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">{s.user}</div>
                </motion.div>
              )}
              {stage === 2 && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-saffron animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-saffron animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-2 h-2 rounded-full bg-saffron animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                  typing…
                </div>
              )}
              {stage >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[85%]">
                  <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">{s.bot}</div>
                </motion.div>
              )}
              <AnimatePresence>
                {stage >= 4 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[85%] bg-card border border-border rounded-2xl p-4">
                    <div className="text-xs uppercase tracking-wider text-saffron mb-3 flex items-center gap-1.5">
                      <FileText className="w-3 h-3" /> Documents Needed
                    </div>
                    <ul className="space-y-2">
                      {s.docs.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> {d}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {stage >= 5 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[85%] bg-card border border-border rounded-2xl p-4">
                    <div className="text-xs uppercase tracking-wider text-teal-deep mb-3 flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" /> {s.statusLabel}
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                      <motion.div className="h-full bg-gradient-to-r from-saffron to-amber-glow" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[10px]">
                      {s.steps.map((step, i) => (
                        <div key={i} className="text-center">
                          {progress >= (i + 1) * 20 ? <CheckCircle2 className="w-4 h-4 text-saffron mx-auto mb-1" /> : <Circle className="w-4 h-4 text-muted-foreground mx-auto mb-1" />}
                          <div className={progress >= (i + 1) * 20 ? "text-foreground" : "text-muted-foreground"}>{step}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t border-border flex gap-2">
              <input
                readOnly
                placeholder={lang === "en" ? "Type your question…" : lang === "hi" ? "अपना प्रश्न लिखें…" : "మీ ప్రశ్న టైప్ చేయండి…"}
                className="flex-1 bg-muted/40 border border-border rounded-full px-4 py-2.5 text-sm outline-none focus:border-saffron"
              />
              <button onClick={startDemo} className="w-11 h-11 rounded-full bg-saffron text-primary-foreground grid place-items-center hover:scale-105 transition">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
