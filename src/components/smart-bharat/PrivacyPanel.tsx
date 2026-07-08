import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Trash2, X, Database, AlertTriangle, Download, Undo2 } from "lucide-react";

type StoredEntry = {
  key: string;
  label: string;
  size: number;
  preview: string;
  count?: number;
};

// Known keys used by Smart Bharat components
const KNOWN_KEYS: Array<{ key: string; label: string }> = [
  { key: "smart-bharat-tickets", label: "Complaint tickets" },
  { key: "smart-bharat-chat", label: "Chat conversation history" },
  { key: "smart-bharat-chat-history", label: "Chat conversation history" },
  { key: "smart-bharat-profile", label: "Personalization profile" },
  { key: "smart-bharat-gemini-key", label: "Gemini API key" },
];

function scanStorage(): StoredEntry[] {
  if (typeof window === "undefined") return [];
  const seen = new Set<string>();
  const entries: StoredEntry[] = [];

  const push = (key: string, label?: string) => {
    if (seen.has(key)) return;
    const raw = localStorage.getItem(key);
    if (raw === null) return;
    seen.add(key);
    let count: number | undefined;
    let preview = raw;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) count = parsed.length;
      else if (parsed && typeof parsed === "object") count = Object.keys(parsed).length;
      preview = JSON.stringify(parsed, null, 2);
    } catch {
      // plain string
    }
    entries.push({
      key,
      label: label || key,
      size: new Blob([raw]).size,
      preview: preview.length > 600 ? preview.slice(0, 600) + "…" : preview,
      count,
    });
  };

  KNOWN_KEYS.forEach((k) => push(k.key, k.label));

  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (k.startsWith("smart-bharat") || k.startsWith("sb-")) push(k);
  }
  return entries;
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function PrivacyPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [entries, setEntries] = useState<StoredEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const [undoStack, setUndoStack] = useState<Array<{ key: string; value: string; label: string }>>([]);
  const undoTimer = useRef<number | null>(null);

  const refresh = () => setEntries(scanStorage());

  useEffect(() => {
    if (open) {
      refresh();
      setConfirmAll(false);
      setExpanded(null);
      setUndoStack([]);
    }
  }, [open]);

  const totalSize = useMemo(() => entries.reduce((n, e) => n + e.size, 0), [entries]);

  const queueUndo = (items: Array<{ key: string; value: string; label: string }>) => {
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    setUndoStack(items);
    undoTimer.current = window.setTimeout(() => setUndoStack([]), 8000);
  };

  const deleteKey = (key: string, label: string) => {
    const value = localStorage.getItem(key);
    if (value === null) return;
    localStorage.removeItem(key);
    refresh();
    queueUndo([{ key, value, label }]);
  };

  const deleteAll = () => {
    const snapshot = entries
      .map((e) => ({ key: e.key, value: localStorage.getItem(e.key), label: e.label }))
      .filter((x): x is { key: string; value: string; label: string } => x.value !== null);
    entries.forEach((e) => localStorage.removeItem(e.key));
    refresh();
    setConfirmAll(false);
    queueUndo(snapshot);
  };

  const undo = () => {
    undoStack.forEach((item) => localStorage.setItem(item.key, item.value));
    setUndoStack([]);
    if (undoTimer.current) window.clearTimeout(undoTimer.current);
    refresh();
  };

  const exportJson = () => {
    const payload: Record<string, unknown> = {
      exportedAt: new Date().toISOString(),
      app: "Smart Bharat",
      data: {},
    };
    entries.forEach((e) => {
      const raw = localStorage.getItem(e.key);
      if (raw === null) return;
      try {
        (payload.data as Record<string, unknown>)[e.key] = JSON.parse(raw);
      } catch {
        (payload.data as Record<string, unknown>)[e.key] = raw;
      }
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smart-bharat-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm grid place-items-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-panel-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-saffron/15 text-saffron grid place-items-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="privacy-panel-title" className="font-display font-black text-xl leading-tight">
                    Privacy Control Panel
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    All Smart Bharat data lives only in this browser. Review and delete it any time.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-lg hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Database className="w-4 h-4" />
                  <span>
                    {entries.length} item{entries.length === 1 ? "" : "s"} · {formatBytes(totalSize)}
                  </span>
                </div>
                {entries.length > 0 &&
                  (confirmAll ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmAll(false)}
                        className="text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-muted/40"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={deleteAll}
                        className="text-sm px-3 py-1.5 rounded-lg bg-red-500/90 hover:bg-red-500 text-white font-medium inline-flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-4 h-4" /> Confirm delete all
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmAll(true)}
                      className="text-sm px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" /> Delete all
                    </button>
                  ))}
              </div>

              {entries.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                  <Shield className="w-8 h-8 text-saffron mx-auto mb-3 opacity-70" />
                  <p className="font-medium">Nothing stored on this device</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Chats and complaints you create will show up here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {entries.map((e) => {
                    const isOpen = expanded === e.key;
                    return (
                      <li key={e.key} className="rounded-xl border border-border bg-background/40">
                        <div className="flex items-center justify-between gap-3 p-4">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{e.label}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
                              {e.key} · {formatBytes(e.size)}
                              {typeof e.count === "number" && ` · ${e.count} record${e.count === 1 ? "" : "s"}`}
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => setExpanded(isOpen ? null : e.key)}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-border hover:bg-muted/40"
                            >
                              {isOpen ? "Hide" : "View"}
                            </button>
                            <button
                              onClick={() => deleteKey(e.key)}
                              aria-label={`Delete ${e.label}`}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                        {isOpen && (
                          <pre className="mx-4 mb-4 p-3 rounded-lg bg-black/40 text-xs text-muted-foreground overflow-x-auto max-h-60 whitespace-pre-wrap break-all">
                            {e.preview}
                          </pre>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border text-xs text-muted-foreground">
              Deletions are immediate and permanent on this device. No data leaves your browser.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
