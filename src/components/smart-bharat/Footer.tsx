import { useState } from "react";
import { Twitter, Github, Linkedin, Mail, Shield } from "lucide-react";
import { ChakraIcon } from "./ChakraIcon";
import { PrivacyModal } from "./PrivacyModal";
import { PrivacyPanel } from "./PrivacyPanel";

const cols = [
  { title: "Product", links: ["Companion", "Report Issue", "Schemes", "Roadmap"] },
  { title: "Resources", links: ["Docs", "API", "Guides", "Support"] },
];

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  return (
    <footer className="border-t border-border/60 px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ChakraIcon className="w-8 h-8 text-saffron" />
            <span className="font-display font-black text-xl">Smart Bharat</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            An AI civic companion built to make government services accessible, transparent, and human — for every citizen of Bharat.
          </p>
          <div className="flex gap-3 mt-5">
            {[
              { I: Twitter, label: "Twitter" },
              { I: Github, label: "GitHub" },
              { I: Linkedin, label: "LinkedIn" },
              { I: Mail, label: "Email" },
            ].map(({ I, label }) => (
              <a key={label} href="#" aria-label={label} className="w-9 h-9 rounded-full glass grid place-items-center hover:text-saffron transition focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron">
                <I className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="font-semibold text-sm mb-4">{c.title}</div>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-saffron transition">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <div className="font-semibold text-sm mb-4">Contact</div>
          <ul className="space-y-2.5">
            <li><a href="#" className="text-sm text-muted-foreground hover:text-saffron transition">Partnerships</a></li>
            <li><a href="#" className="text-sm text-muted-foreground hover:text-saffron transition">Press</a></li>
            <li>
              <button onClick={() => setPrivacyOpen(true)} className="text-sm text-muted-foreground hover:text-saffron transition focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded">
                Privacy & Data
              </button>
            </li>
            <li>
              <button onClick={() => setPanelOpen(true)} className="text-sm text-muted-foreground hover:text-saffron transition focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Manage my data
              </button>
            </li>
            <li><a href="mailto:hello@smartbharat.in" className="text-sm text-muted-foreground hover:text-saffron transition">hello@smartbharat.in</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-6 border-t border-border/60 space-y-3 text-center">
        <p className="text-xs text-muted-foreground max-w-3xl mx-auto italic">
          Smart Bharat is a conceptual prototype built for the PromptWars x Global Prompt Challenge hackathon and is not an official Government of India service.
        </p>
        <p className="text-xs text-muted-foreground">© 2026 Smart Bharat — Built for PromptWars x Global Prompt Challenge.</p>
      </div>
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  );
}
