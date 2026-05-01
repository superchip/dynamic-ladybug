"use client";

import { useState, useEffect, useCallback } from "react";
import { EMOTION_BATCHES } from "@/lib/emotions";
import { Emotion, EmotionCategory } from "@/types";

type Props = {
  onConfirm: (emotion: Emotion, category: EmotionCategory) => void;
};

export default function CoverFlowPicker({ onConfirm }: Props) {
  const [batchIndex, setBatchIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(5);

  const emotions = EMOTION_BATCHES[batchIndex].emotions;
  const sel = emotions[selectedIndex];

  const handleBatchSwitch = (idx: number) => {
    setBatchIndex(idx);
    setSelectedIndex(Math.floor(EMOTION_BATCHES[idx].emotions.length / 2));
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setSelectedIndex((i) => (i - 1 + emotions.length) % emotions.length);
      else if (e.key === "ArrowRight") setSelectedIndex((i) => (i + 1) % emotions.length);
      else if (e.key === "Enter") onConfirm(sel, batchIndex === 0 ? "challenging" : "growth");
    },
    [sel, emotions.length, batchIndex, onConfirm]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 96,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--fg-mute)",
            marginBottom: 14,
          }}
        >
          {new Date().toLocaleDateString("en-US", { weekday: "long" })} ·{" "}
          {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: -1.5,
            margin: 0,
            lineHeight: 1.05,
            color: "var(--fg)",
          }}
        >
          What&apos;s present
          <br />
          <span
            style={{
              color: "var(--fg-dim)",
              fontWeight: 400,
              fontStyle: "italic",
              fontFamily: "var(--font-serif)",
            }}
          >
            for you?
          </span>
        </h1>
      </div>

      {/* Category tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 4,
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid var(--hairline)",
          marginBottom: 28,
        }}
      >
        {EMOTION_BATCHES.map((batch, idx) => (
          <button
            key={batch.label}
            onClick={() => handleBatchSwitch(idx)}
            style={{
              padding: "6px 18px",
              borderRadius: 999,
              border: "none",
              background: idx === batchIndex ? "rgba(255,255,255,0.14)" : "transparent",
              color: idx === batchIndex ? "var(--fg)" : "var(--fg-dim)",
              fontFamily: "var(--font-text)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {batch.label}
          </button>
        ))}
      </div>

      {/* Orbital wheel */}
      <div style={{ position: "relative", width: 560, height: 340, marginBottom: 24 }}>
        {/* Central card */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 210,
            height: 250,
            borderRadius: 32,
            background: `linear-gradient(160deg, ${sel.color}cc, ${sel.color}66)`,
            boxShadow: `0 30px 80px ${sel.color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
            border: "1px solid rgba(255,255,255,0.18)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            backdropFilter: "blur(20px)",
            zIndex: 5,
            transition: "background 0.4s ease, box-shadow 0.4s ease",
          }}
        >
          <div style={{ fontSize: 80, lineHeight: 1, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
            {sel.emoji}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: -0.3,
              color: "white",
            }}
          >
            {sel.name}
          </div>
        </div>

        {/* Orbital chips */}
        {emotions.map((e, i) => {
          const offset = i - selectedIndex;
          const visible = Math.abs(offset) >= 1 && Math.abs(offset) <= 4;
          if (!visible) return null;

          const angle = offset * 12;
          const radius = 280;
          const x = Math.sin((angle * Math.PI) / 180) * radius;
          const y = -Math.cos((angle * Math.PI) / 180) * radius * 0.45 + 120;
          const scale = 1 - Math.abs(offset) * 0.12;
          const opacity = 1 - Math.abs(offset) * 0.18;

          return (
            <button
              key={e.name}
              onClick={() => setSelectedIndex(i)}
              style={{
                position: "absolute",
                left: `calc(50% + ${x}px)`,
                top: y,
                transform: `translate(-50%, -50%) scale(${scale})`,
                width: 62,
                height: 62,
                borderRadius: "50%",
                background: `linear-gradient(160deg, ${e.color}cc, ${e.color}77)`,
                border: "1px solid rgba(255,255,255,0.2)",
                boxShadow: `0 10px 30px ${e.color}55`,
                display: "grid",
                placeItems: "center",
                fontSize: 26,
                cursor: "pointer",
                opacity,
                transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                zIndex: 4,
              }}
            >
              {e.emoji}
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      <button
        onClick={() => onConfirm(sel, batchIndex === 0 ? "challenging" : "growth")}
        style={{
          padding: "14px 28px",
          borderRadius: 999,
          background: `linear-gradient(180deg, ${sel.color}, ${sel.color}cc)`,
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: -0.1,
          boxShadow: `0 10px 30px ${sel.color}66, inset 0 1px 0 rgba(255,255,255,0.3)`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        Continue with {sel.name}
        <span style={{ opacity: 0.7 }}>→</span>
      </button>

      <div
        style={{
          marginTop: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--fg-mute)",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        ← → to browse · Return to confirm
      </div>
    </div>
  );
}
