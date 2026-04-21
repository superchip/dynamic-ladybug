"use client";

import { motion } from "framer-motion";
import { Emotion } from "@/types";

type Props = {
  emotion: Emotion;
  belief: string;
  insight: string;
  isStreaming: boolean;
  onSave: () => void;
  onReset: () => void;
  saved: boolean;
};

export default function InsightDisplay({
  emotion,
  belief,
  insight,
  isStreaming,
  onSave,
  onReset,
  saved,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto flex flex-col gap-6"
    >
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-medium"
          style={{ background: `${emotion.color}44`, border: `1px solid ${emotion.color}66` }}
        >
          <span>{emotion.emoji}</span>
          <span>{emotion.name}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
        <p className="text-xs text-white/40 uppercase tracking-wide mb-1 font-medium">Your belief</p>
        <p className="text-white/60 text-sm italic">&ldquo;{belief}&rdquo;</p>
      </div>

      <div
        className="rounded-2xl px-6 py-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${emotion.color}18, ${emotion.color}08)`,
          border: `1px solid ${emotion.color}33`,
        }}
      >
        <p className="text-xs uppercase tracking-wide mb-3 font-medium" style={{ color: `${emotion.color}cc` }}>
          New belief insight
        </p>
        <p className="text-white leading-relaxed text-base">
          {insight}
          {isStreaming && (
            <span
              className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse rounded-full"
              style={{ background: emotion.color }}
            />
          )}
        </p>
      </div>

      {!isStreaming && insight && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          {!saved ? (
            <button
              onClick={onSave}
              className="flex-1 py-3 rounded-2xl font-semibold text-white text-sm shadow transition"
              style={{ background: emotion.color }}
            >
              Save to history
            </button>
          ) : (
            <div className="flex-1 py-3 rounded-2xl text-center text-white/50 text-sm border border-white/10">
              Saved ✓
            </div>
          )}
          <button
            onClick={onReset}
            className="flex-1 py-3 rounded-2xl font-semibold text-white/60 text-sm border border-white/15 hover:bg-white/5 transition"
          >
            Start over
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
