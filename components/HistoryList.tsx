"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmotionEntry } from "@/types";
import { deleteEntry, clearEntries } from "@/lib/storage";

type Props = {
  entries: EmotionEntry[];
  onUpdate: () => void;
};

export default function HistoryList({ entries, onUpdate }: Props) {
  const [confirmClear, setConfirmClear] = useState(false);

  const handleDelete = (id: string) => {
    deleteEntry(id);
    onUpdate();
  };

  const handleClearAll = () => {
    if (confirmClear) {
      clearEntries();
      onUpdate();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 text-white/30">
        <p className="text-5xl mb-4">🌱</p>
        <p className="text-lg">No entries yet.</p>
        <p className="text-sm mt-1">Your saved insights will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-white/40 text-sm">{entries.length} {entries.length === 1 ? "entry" : "entries"}</p>
        <button
          onClick={handleClearAll}
          onBlur={() => setConfirmClear(false)}
          className="text-sm text-white/30 hover:text-red-400 transition"
        >
          {confirmClear ? "Tap again to confirm" : "Clear all"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{
                  background: `${entry.emotionColor}33`,
                  border: `1px solid ${entry.emotionColor}55`,
                }}
              >
                <span>{entry.emotionEmoji}</span>
                <span>{entry.emotion}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/25 text-xs">
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}{" "}
                  {new Date(entry.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-white/20 hover:text-red-400 transition text-sm"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-white/35 uppercase tracking-wide mb-1">Belief</p>
              <p className="text-white/50 text-sm italic">&ldquo;{entry.belief}&rdquo;</p>
            </div>

            <div
              className="rounded-xl px-4 py-3"
              style={{ background: `${entry.emotionColor}12`, border: `1px solid ${entry.emotionColor}22` }}
            >
              <p className="text-xs uppercase tracking-wide mb-1 font-medium" style={{ color: `${entry.emotionColor}bb` }}>
                Insight
              </p>
              <p className="text-white/80 text-sm leading-relaxed">{entry.insight}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
