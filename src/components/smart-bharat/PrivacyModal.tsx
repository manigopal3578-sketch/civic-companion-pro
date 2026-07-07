import { useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PrivacyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm grid place-items-center p-4"
          onClick={onClose}
          role="dialog" aria-modal="true" aria-labelledby="privacy-title"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-3xl max-w-lg w-full p-8 relative"
          >
            <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-muted-foreground hover:text-saffron">
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-saffron/10 grid place-items-center text-saffron mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 id="privacy-title" className="font-display font-black text-2xl mb-3">Privacy & Data</h3>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Smart Bharat is a prototype. We do not run a server that stores your personal data.</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Any complaint you file is saved <span className="text-foreground">only in your browser</span> (localStorage) on this device.</li>
                <li>If you paste a Gemini API key, it stays in memory for this session and is <span className="text-foreground">never sent to us</span>. Requests go directly from your browser to Google.</li>
                <li>No accounts, no tracking cookies, no analytics attached to your identity.</li>
                <li>Clearing your browser data will remove all saved tickets.</li>
              </ul>
              <p className="text-xs pt-3 border-t border-border">For a real government deployment, all data would live on secure, audited government infrastructure with proper consent flows.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
