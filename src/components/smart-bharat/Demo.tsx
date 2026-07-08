import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileText, Search, ClipboardList, Globe, CheckCircle2, Circle, Loader2, Sparkles, AlertCircle } from "lucide-react";

type Lang = "en" | "hi" | "te";
const langNames: Record<Lang, string> = { en: "English", hi: "हिन्दी", te: "తెలుగు" };

const script: Record<Lang, { user: string; bot: string; docs: string[]; steps: string[]; statusLabel: string; placeholder: string }> = {
  en: {
    user: "How do I apply for a ration card?",
    bot: "Great — I'll walk you through it. You'll need your Aadhaar card and address proof. Here's your checklist and live application status:",
    docs: ["Aadhaar Card", "Address Proof (Utility Bill)", "Passport-size Photo", "Income Certificate"],
    steps: ["Application Submitted", "Document Verification", "Field Visit", "Card Issued"],
    statusLabel: "Application Progress",
    placeholder: "Ask about schemes, documents, complaints…",
  },
  hi: {
    user: "मैं राशन कार्ड के लिए कैसे आवेदन करूँ?",
    bot: "बहुत अच्छा — मैं आपको समझाता हूँ। आपको अपना आधार कार्ड और पते का प्रमाण चाहिए। यह रही आपकी सूची और लाइव स्थिति:",
    docs: ["आधार कार्ड", "पते का प्रमाण (बिजली बिल)", "पासपोर्ट फोटो", "आय प्रमाण पत्र"],
    steps: ["आवेदन जमा किया गया", "दस्तावेज़ सत्यापन", "फ़ील्ड विज़िट", "कार्ड जारी"],
    statusLabel: "आवेदन की प्रगति",
    placeholder: "योजनाओं, दस्तावेज़ों के बारे में पूछें…",
  },
  te: {
    user: "నేను రేషన్ కార్డ్ కోసం ఎలా దరఖాస్తు చేయాలి?",
    bot: "సరే — నేను మీకు వివరిస్తాను. మీకు మీ ఆధార్ కార్డ్ మరియు చిరునామా రుజువు అవసరం. ఇదిగో మీ చెక్‌లిస్ట్ మరియు ప్రత్యక్ష స్థితి:",
    docs: ["ఆధార్ కార్డ్", "చిరునామా రుజువు (విద్యుత్ బిల్లు)", "పాస్‌పోర్ట్ ఫోటో", "ఆదాయ ధృవీకరణ పత్రం"],
    steps: ["దరఖాస్తు సమర్పించబడింది", "పత్రాల ధృవీకరణ", "క్షేత్ర సందర్శన", "కార్డ్ జారీ"],
    statusLabel: "దరఖాస్తు పురోగతి",
    placeholder: "పథకాలు, పత్రాల గురించి అడగండి…",
  },
};

const chips = [
  { icon: Search, label: "Find a Scheme", q: "What government schemes am I eligible for as a farmer in Telangana?" },
  { icon: ClipboardList, label: "Track My Complaint", q: "How do I track a public grievance filed on CPGRAMS?" },
  { icon: FileText, label: "Document Checklist", q: "What documents do I need to apply for a ration card in India?" },
];

type Msg = { role: "user" | "bot"; text: string; isDemo?: boolean };

export function Demo() {
  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Optional Gemini key: read once from localStorage (advanced users) or Vite env; no UI exposed.
  const apiKey = (typeof window !== "undefined" && localStorage.getItem("smart-bharat-gemini-key")) || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) || "";
  const [demoStage, setDemoStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const messagesRef = useRef<HTMLDivElement>(null);

  const s = script[lang];

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, demoStage, loading]);

  const runScriptedDemo = () => {
    setMessages([]); setError(null); setDemoStage(0); setProgress(0);
    setTimeout(() => setDemoStage(1), 200);
    setTimeout(() => setDemoStage(2), 900);
    setTimeout(() => setDemoStage(3), 2400);
    setTimeout(() => setDemoStage(4), 3200);
    setTimeout(() => setDemoStage(5), 4000);
  };

  useEffect(() => {
    if (demoStage === 5) {
      let p = 0;
      const id = setInterval(() => { p += 2; setProgress(p); if (p >= 65) clearInterval(id); }, 30);
      return () => clearInterval(id);
    }
  }, [demoStage]);

  const callGemini = async (question: string) => {
    setLoading(true); setError(null);
    setMessages((m) => [...m, { role: "user", text: question }]);
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are Smart Bharat, an AI civic companion helping Indian citizens navigate government schemes, documents, and public services. Answer clearly in ${langNames[lang]}, in 4-6 short sentences with step-by-step guidance where helpful.\n\nUser question: ${question}` }] }],
          }),
        }
      );
      if (!resp.ok) throw new Error(`API error ${resp.status}`);
      const data = await resp.json();
      const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response received.";
      setMessages((m) => [...m, { role: "bot", text }]);
    } catch (e) {
      setError("Couldn't reach the AI right now — showing a sample response instead.");
      setMessages((m) => [...m, { role: "bot", text: s.bot, isDemo: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput("");
    if (apiKey.trim()) callGemini(q);
    else runScriptedDemo();
  };

  const handleChip = (q: string) => {
    if (apiKey.trim()) callGemini(q);
    else runScriptedDemo();
  };

  const isScripted = messages.length === 0 && demoStage > 0;

  return (
    <section id="demo" className="relative py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <div className="text-xs uppercase tracking-widest text-saffron mb-3">Live Demo</div>
          <h2 className="font-display font-black text-4xl md:text-6xl">Meet your Companion.</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Ask anything. Switch language. Get real answers.</p>
          <div className="mt-5 inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-saffron" /> Powered by Google Gemini
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <aside className="glass rounded-3xl p-5 space-y-2 h-fit">
            <div className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-2">Quick Actions</div>
            {chips.map((c) => (
              <button key={c.label} onClick={() => handleChip(c.q)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-saffron/10 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron">
                <c.icon className="w-4 h-4 text-saffron shrink-0" aria-hidden="true" /> {c.label}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-border">
              <div className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-2 flex items-center gap-1.5">
                <Globe className="w-3 h-3" aria-hidden="true" /> Language
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(Object.keys(langNames) as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    className={`px-2 py-2 rounded-lg text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${lang === l ? "bg-saffron text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted"}`}
                  >
                    {langNames[l]}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-border">
              <label htmlFor="gemini-key" className="text-xs uppercase tracking-wider text-muted-foreground px-2 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3 h-3" aria-hidden="true" /> Gemini API Key
              </label>
              <div className="relative">
                <input
                  id="gemini-key"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your key (optional)"
                  className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-saffron"
                />
                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-saffron">
                  {showKey ? "hide" : "show"}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 px-1 leading-snug">
                Your API key stays in your browser and is never stored. Without a key, you'll see a scripted sample.
              </p>
            </div>
          </aside>

          <div className="glass rounded-3xl flex flex-col min-h-[560px] overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-amber-glow grid place-items-center text-primary-foreground font-black">SB</div>
              <div className="min-w-0">
                <div className="font-semibold text-sm">Smart Bharat Companion</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> {apiKey.trim() ? "Live · Gemini" : "Demo Mode"} · {langNames[lang]}
                </div>
              </div>
            </div>

            <div ref={messagesRef} className="flex-1 overflow-y-auto p-5 space-y-4" aria-live="polite">
              {messages.length === 0 && demoStage === 0 && (
                <div className="h-full grid place-items-center text-center">
                  <div>
                    <p className="text-muted-foreground text-sm mb-4 max-w-xs">Type a question or pick a quick action. Add a Gemini key for live AI answers.</p>
                    <button onClick={runScriptedDemo} className="btn-saffron">Ask the Companion</button>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : ""}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl whitespace-pre-wrap ${m.role === "user" ? "bg-saffron text-primary-foreground rounded-tr-sm" : "bg-muted/50 rounded-tl-sm"}`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-saffron" /> Thinking…
                </div>
              )}
              {error && (
                <div className="flex items-start gap-2 text-xs text-amber-glow bg-amber-glow/10 border border-amber-glow/30 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> {error}
                </div>
              )}

              {isScripted && demoStage >= 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end">
                  <div className="max-w-[80%] bg-saffron text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">{s.user}</div>
                </motion.div>
              )}
              {isScripted && demoStage === 2 && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-saffron animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-saffron animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-2 h-2 rounded-full bg-saffron animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                  typing…
                </div>
              )}
              {isScripted && demoStage >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[85%]">
                  <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">{s.bot}</div>
                </motion.div>
              )}
              <AnimatePresence>
                {isScripted && demoStage >= 4 && (
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
                {isScripted && demoStage >= 5 && (
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

            <form onSubmit={handleSubmit} className="p-4 border-t border-border flex gap-2">
              <label htmlFor="chat-input" className="sr-only">Ask the Companion</label>
              <input
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={s.placeholder}
                className="flex-1 bg-muted/40 border border-border rounded-full px-4 py-2.5 text-sm outline-none focus:border-saffron"
              />
              <button type="submit" disabled={loading} aria-label="Send message" className="w-11 h-11 rounded-full bg-saffron text-primary-foreground grid place-items-center hover:scale-105 transition disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
