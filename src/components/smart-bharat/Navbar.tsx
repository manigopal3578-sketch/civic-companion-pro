import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ChakraIcon } from "./ChakraIcon";

const links = [
  { label: "Home", id: "hero" },
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how" },
  { label: "Impact", id: "impact" },
  { label: "Contact", id: "contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "glass py-3" : "py-5"}`}>
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between gap-4">
        <button onClick={() => go("hero")} className="flex items-center gap-2 shrink-0">
          <ChakraIcon className="w-8 h-8 text-saffron" />
          <span className="font-display font-black text-xl tracking-tight">Smart Bharat</span>
        </button>
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} className="text-sm text-muted-foreground hover:text-saffron transition-colors">
              {l.label}
            </button>
          ))}
        </div>
        <button onClick={() => go("demo")} className="btn-saffron hidden md:inline-flex text-sm">
          Try the Companion
        </button>
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-2">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden glass mt-2 mx-4 rounded-2xl p-5 flex flex-col gap-4">
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} className="text-left text-muted-foreground hover:text-saffron">
              {l.label}
            </button>
          ))}
          <button onClick={() => go("demo")} className="btn-saffron w-full">Try the Companion</button>
        </div>
      )}
    </nav>
  );
}
