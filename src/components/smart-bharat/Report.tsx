import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Send, CheckCircle2, Copy, Loader2, Search } from "lucide-react";

type Ticket = { id: string; type: string; description: string; location: string; photo?: string; status: string; createdAt: number };

const STORAGE_KEY = "smart-bharat-tickets";

const readTickets = (): Record<string, Ticket> => {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
};
const writeTickets = (t: Record<string, Ticket>) => {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
};

const genId = () => {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `SB-2026-${n}`;
};

const ISSUE_TYPES = ["Broken Road", "Water Leak", "Streetlight", "Garbage", "Public Safety", "Other"];

export function Report() {
  const [type, setType] = useState(ISSUE_TYPES[0]);
  const [desc, setDesc] = useState("");
  const [loc, setLoc] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [trackInput, setTrackInput] = useState("");
  const [trackResult, setTrackResult] = useState<Ticket | null | "notfound">(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !loc.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const t: Ticket = {
        id: genId(), type, description: desc, location: loc, photo: photoName,
        status: "Received", createdAt: Date.now(),
      };
      const all = readTickets();
      all[t.id] = t;
      writeTickets(all);
      // Progress: Received → Under Review after a moment (simulated)
      setTimeout(() => {
        const cur = readTickets();
        if (cur[t.id]) { cur[t.id].status = "Under Review"; writeTickets(cur); }
      }, 4000);
      setTicket(t);
      setSubmitting(false);
      setDesc(""); setLoc(""); setPhotoName("");
    }, 900);
  };

  const track = (e: React.FormEvent) => {
    e.preventDefault();
    const id = trackInput.trim().toUpperCase();
    const all = readTickets();
    setTrackResult(all[id] || "notfound");
  };

  return (
    <section id="report" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-widest text-saffron mb-3">Report & Track</div>
          <h2 className="font-display font-black text-4xl md:text-5xl">One photo. One tap. Full accountability.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Report form */}
          <div className="glass rounded-3xl p-7">
            <h3 className="font-display font-bold text-2xl mb-5">File a complaint</h3>
            {!ticket ? (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label htmlFor="issue-type" className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Issue type</label>
                  <select id="issue-type" value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-saffron">
                    {ISSUE_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="issue-desc" className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Description</label>
                  <textarea id="issue-desc" required value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Describe the issue…" className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-saffron resize-none" />
                </div>
                <div>
                  <label htmlFor="issue-loc" className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location</label>
                  <input id="issue-loc" required value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Street, area, city" className="w-full bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-saffron" />
                </div>
                <div>
                  <label htmlFor="issue-photo" className="flex items-center gap-2 text-sm cursor-pointer text-muted-foreground hover:text-saffron transition">
                    <Camera className="w-4 h-4" /> {photoName || "Attach a photo (optional)"}
                  </label>
                  <input id="issue-photo" type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoName(e.target.files?.[0]?.name || "")} />
                </div>
                <button type="submit" disabled={submitting} className="btn-saffron w-full inline-flex items-center justify-center gap-2 disabled:opacity-50">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><Send className="w-4 h-4" /> Submit Report</>}
                </button>
              </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-400/10 grid place-items-center text-green-400 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-2xl">Report filed successfully</h4>
                <p className="text-sm text-muted-foreground mt-2">Save this ticket ID to track progress:</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-muted/40 border border-saffron/40 rounded-xl px-4 py-3">
                  <code className="font-mono font-bold text-saffron">{ticket.id}</code>
                  <button onClick={() => navigator.clipboard?.writeText(ticket.id)} aria-label="Copy ticket ID" className="text-muted-foreground hover:text-saffron">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-6">
                  <button onClick={() => setTicket(null)} className="text-sm text-muted-foreground hover:text-saffron underline">File another report</button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Track */}
          <div className="glass rounded-3xl p-7">
            <h3 className="font-display font-bold text-2xl mb-5">Track your complaint</h3>
            <form onSubmit={track} className="flex gap-2">
              <label htmlFor="track-id" className="sr-only">Ticket ID</label>
              <input id="track-id" value={trackInput} onChange={(e) => setTrackInput(e.target.value)} placeholder="e.g. SB-2026-12345" className="flex-1 bg-muted/40 border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-saffron font-mono" />
              <button type="submit" aria-label="Track ticket" className="w-11 h-11 rounded-xl bg-saffron text-primary-foreground grid place-items-center hover:scale-105 transition">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6">
              {trackResult === "notfound" && (
                <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-4">No ticket found for that ID. Check spelling — IDs look like <code className="text-saffron">SB-2026-12345</code>.</p>
              )}
              {trackResult && trackResult !== "notfound" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <code className="font-mono font-bold text-saffron">{trackResult.id}</code>
                    <span className="text-xs px-2 py-1 rounded-full bg-saffron/10 text-saffron border border-saffron/30">{trackResult.status}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Type:</span> {trackResult.type}</div>
                    <div><span className="text-muted-foreground">Location:</span> {trackResult.location}</div>
                    <div><span className="text-muted-foreground">Details:</span> {trackResult.description}</div>
                  </div>
                  <div className="mt-5">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      <span>Received</span><span>Under Review</span><span>Resolved</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-saffron to-amber-glow transition-all" style={{ width: trackResult.status === "Resolved" ? "100%" : trackResult.status === "Under Review" ? "60%" : "25%" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              {!trackResult && (
                <div className="text-sm text-muted-foreground bg-muted/20 rounded-xl p-4">
                  Enter a ticket ID above to see the live status. Tickets are stored securely in your browser only.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
