import { Twitter, Github, Linkedin, Mail } from "lucide-react";
import { ChakraIcon } from "./ChakraIcon";

const cols = [
  { title: "Product", links: ["Companion", "Report Issue", "Schemes", "Roadmap"] },
  { title: "Resources", links: ["Docs", "API", "Guides", "Support"] },
  { title: "Contact", links: ["Partnerships", "Press", "Careers", "hello@smartbharat.in"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ChakraIcon className="w-8 h-8 text-saffron" />
            <span className="font-display font-black text-xl">Smart Bharat</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            An AI civic companion built to make government services accessible, transparent, and human — for every citizen of Bharat.
          </p>
          <div className="flex gap-3 mt-5">
            {[Twitter, Github, Linkedin, Mail].map((I, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full glass grid place-items-center hover:text-saffron transition">
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
      </div>
      <div className="max-w-7xl mx-auto pt-6 border-t border-border/60 text-xs text-muted-foreground text-center">
        © 2026 Smart Bharat — Built for PromptWars x Global Prompt Challenge.
      </div>
    </footer>
  );
}
