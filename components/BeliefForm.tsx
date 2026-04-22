"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Emotion, EmotionCategory } from "@/types";

type Props = {
  emotion: Emotion;
  category: EmotionCategory;
  onSubmit: (belief: string) => void;
  isLoading: boolean;
  onBack: () => void;
};

export default function BeliefForm({ emotion, category, onSubmit, isLoading, onBack }: Props) {
  const isGrowth = category === "growth";
  const [belief, setBelief] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 300);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (belief.trim() && !isLoading) onSubmit(belief.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-white/50 hover:text-white/80 transition text-sm"
        >
          ← back
        </button>
        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-medium"
          style={{ background: `${emotion.color}44`, border: `1px solid ${emotion.color}66` }}
        >
          <span>{emotion.emoji}</span>
          <span>{emotion.name}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-white/60 text-sm mb-2 font-medium tracking-wide uppercase text-xs">
            {isGrowth ? "What are you noticing with this feeling?" : "What belief is driving this feeling?"}
          </label>
          <textarea
            ref={textareaRef}
            value={belief}
            onChange={(e) => setBelief(e.target.value)}
            placeholder={
              isGrowth
                ? `e.g. "I feel this warmth but I'm not sure I deserve it", "This peace is unfamiliar to me"…`
                : `e.g. "I'm not good enough", "Nobody really cares about me", "I always mess things up"…`
            }
            rows={4}
            disabled={isLoading}
            className="w-full rounded-2xl bg-white/8 border border-white/15 text-white placeholder-white/25 px-5 py-4 text-base resize-none focus:outline-none focus:border-white/40 focus:bg-white/12 transition disabled:opacity-50"
            style={{ backdropFilter: "blur(8px)" }}
          />
        </div>

        <motion.button
          whileHover={{ scale: belief.trim() ? 1.02 : 1 }}
          whileTap={{ scale: belief.trim() ? 0.97 : 1 }}
          type="submit"
          disabled={!belief.trim() || isLoading}
          className="py-3.5 rounded-2xl font-semibold text-white text-base shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: belief.trim() ? emotion.color : "#ffffff22" }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              {isGrowth ? "Receiving your insight…" : "Finding your insight…"}
            </span>
          ) : (
            isGrowth ? "Deepen this feeling →" : "Reframe this belief →"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
