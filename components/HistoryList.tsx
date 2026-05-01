"use client";

import { useState } from "react";
import { EmotionEntry, GrowthInsight } from "@/types";
import { deleteEntry, clearEntries } from "@/lib/storage";

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
  return { body: sentences.slice(0, -1).join(" "), empoweringBelief: last };
}

function tryParseGrowth(text: string): GrowthInsight | null {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const parsed = JSON.parse(match[0]);
    if (parsed.reflection && parsed.encouragement && parsed.empowerment_sentence) return parsed as GrowthInsight;
    return null;
  } catch {
    return null;
  }
}

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
      <div
        style={{
          textAlign: "center",
          padding: "80px 0",
          color: "var(--fg-mute)",
          fontFamily: "var(--font-text)",
        }}
      >
        <p style={{ fontSize: 48, margin: "0 0 16px" }}>🌱</p>
        <p style={{ fontSize: 18, margin: "0 0 6px", color: "var(--fg-dim)" }}>No entries yet.</p>
        <p style={{ fontSize: 14 }}>Your saved insights will appear here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--fg-mute)" }}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
        <button
          onClick={handleClearAll}
          onBlur={() => setConfirmClear(false)}
          style={{
            background: "transparent",
            border: "none",
            fontFamily: "var(--font-text)",
            fontSize: 12,
            color: confirmClear ? "#f43f5e" : "var(--fg-mute)",
            cursor: "pointer",
          }}
        >
          {confirmClear ? "Tap again to confirm" : "Clear all"}
        </button>
      </div>

      {entries.map((entry) => {
        const growth = tryParseGrowth(entry.insight);
        const { body, empoweringBelief } = !growth ? splitInsight(entry.insight) : { body: "", empoweringBelief: "" };
        const displayBody = growth ? growth.reflection : (body || entry.insight);
        const displayNewBelief = growth ? growth.empowerment_sentence : empoweringBelief;

        return (
          <div
            key={entry.id}
            style={{
              background: "var(--material)",
              border: "1px solid var(--hairline)",
              backdropFilter: "blur(40px) saturate(140%)",
              WebkitBackdropFilter: "blur(40px) saturate(140%)",
              borderRadius: "var(--r-lg)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 60px -20px rgba(0,0,0,0.4)",
              padding: 22,
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: `linear-gradient(160deg, ${entry.emotionColor}cc, ${entry.emotionColor}66)`,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 18,
                    boxShadow: `0 6px 16px ${entry.emotionColor}55`,
                  }}
                >
                  {entry.emotionEmoji}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--fg)",
                    }}
                  >
                    {entry.emotion}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      color: "var(--fg-mute)",
                    }}
                  >
                    {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} ·{" "}
                    {new Date(entry.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--hairline)",
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  color: "var(--fg-mute)",
                  fontSize: 14,
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                }}
                title="Delete"
              >
                ×
              </button>
            </div>

            {/* Belief */}
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 15,
                color: "var(--fg-dim)",
                margin: "0 0 10px",
                lineHeight: 1.4,
              }}
            >
              &ldquo;{entry.belief}&rdquo;
            </p>

            {/* Body */}
            <p
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                lineHeight: 1.55,
                margin: "0 0 12px",
                color: "var(--fg)",
              }}
            >
              {displayBody}
            </p>

            {/* New belief chip */}
            {displayNewBelief && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: `${entry.emotionColor}1a`,
                  border: `1px solid ${entry.emotionColor}55`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: entry.emotionColor,
                    marginBottom: 4,
                  }}
                >
                  New belief
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 15,
                    margin: 0,
                    lineHeight: 1.4,
                    color: "var(--fg)",
                  }}
                >
                  {displayNewBelief}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
