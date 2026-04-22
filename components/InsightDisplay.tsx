"use client";

import { motion } from "framer-motion";
import { Emotion, EmotionCategory, GrowthInsight } from "@/types";

function splitInsight(text: string): { body: string; empoweringBelief: string } {
  const sentences = text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 1) return { body: "", empoweringBelief: text.trim() };

  const last = sentences[sentences.length - 1]
    .replace(/^\*{1,2}[^*]*\*{1,2}:?\s*/g, "")
    .trim();

  return {
    body: sentences.slice(0, -1).join(" "),
    empoweringBelief: last,
  };
}

function parseGrowthInsight(text: string): GrowthInsight | null {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    if (parsed.reflection && parsed.encouragement && parsed.empowerment_sentence) {
      return parsed as GrowthInsight;
    }
    return null;
  } catch {
    return null;
  }
}

type Props = {
  emotion: Emotion;
  belief: string;
  insight: string;
  category: EmotionCategory;
  isStreaming: boolean;
  onSave: () => void;
  onReset: () => void;
  saved: boolean;
};

export default function InsightDisplay({
  emotion,
  belief,
  insight,
  category,
  isStreaming,
  onSave,
  onReset,
  saved,
}: Props) {
  const isGrowth = category === "growth";

  const growthData = !isStreaming && isGrowth ? parseGrowthInsight(insight) : null;
  const { body, empoweringBelief } =
    !isStreaming && !isGrowth ? splitInsight(insight) : { body: "", empoweringBelief: "" };

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
        <p className="text-xs text-white/40 uppercase tracking-wide mb-1 font-medium">
          {isGrowth ? "Your reflection" : "Your belief"}
        </p>
        <p className="text-white/60 text-sm italic">&ldquo;{belief}&rdquo;</p>
      </div>

      {/* Main insight box */}
      <div
        className="rounded-2xl px-6 py-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${emotion.color}18, ${emotion.color}08)`,
          border: `1px solid ${emotion.color}33`,
        }}
      >
        <p className="text-xs uppercase tracking-wide mb-3 font-medium" style={{ color: `${emotion.color}cc` }}>
          {isGrowth ? "Your experience" : "New belief insight"}
        </p>

        {isStreaming ? (
          isGrowth ? (
            <div className="flex items-center gap-3 text-white/50 text-sm">
              <span
                className="inline-block w-0.5 h-4 align-middle animate-pulse rounded-full"
                style={{ background: emotion.color }}
              />
              Receiving your insight…
            </div>
          ) : (
            <p className="text-white leading-relaxed text-base">
              {insight}
              <span
                className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse rounded-full"
                style={{ background: emotion.color }}
              />
            </p>
          )
        ) : isGrowth && growthData ? (
          <>
            <p className="text-white leading-relaxed text-base">{growthData.reflection}</p>
            <p className="mt-3 text-white/60 text-sm italic">{growthData.encouragement}</p>
          </>
        ) : (
          <p className="text-white leading-relaxed text-base">{body}</p>
        )}
      </div>

      {/* Empowerment glow box */}
      {!isStreaming && insight && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl px-6 py-5 relative"
          style={{
            background: `linear-gradient(135deg, ${emotion.color}1a, ${emotion.color}0d)`,
            border: `1px solid ${emotion.color}66`,
            boxShadow: `0 0 24px ${emotion.color}40, 0 0 8px ${emotion.color}28, inset 0 1px 0 ${emotion.color}22`,
          }}
        >
          <p className="text-xs uppercase tracking-wide mb-3 font-semibold" style={{ color: `${emotion.color}dd` }}>
            {isGrowth ? "Your empowerment" : "Your new belief"}
          </p>
          <p className="text-white font-medium leading-relaxed text-base">
            {isGrowth && growthData ? growthData.empowerment_sentence : empoweringBelief}
          </p>
        </motion.div>
      )}

      {!isStreaming && insight && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
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
