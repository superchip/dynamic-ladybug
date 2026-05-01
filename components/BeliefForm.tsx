"use client";

import { useState, useEffect, useRef } from "react";
import { Emotion, EmotionCategory } from "@/types";

type Props = {
  emotion: Emotion;
  category: EmotionCategory;
  onSubmit: (belief: string) => void;
  onBack: () => void;
};

export default function BeliefForm({ emotion, category, onSubmit, onBack }: Props) {
  const isGrowth = category === "growth";
  const [belief, setBelief] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 200);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (belief.trim()) onSubmit(belief.trim());
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 32px 32px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          background: "var(--material)",
          border: "1px solid var(--hairline)",
          backdropFilter: "blur(40px) saturate(140%)",
          WebkitBackdropFilter: "blur(40px) saturate(140%)",
          borderRadius: "var(--r-lg)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 80px -30px rgba(0,0,0,0.5)",
          padding: 40,
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--fg-dim)",
              fontFamily: "var(--font-text)",
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              background: `${emotion.color}22`,
              border: `1px solid ${emotion.color}55`,
            }}
          >
            <span style={{ fontSize: 16 }}>{emotion.emoji}</span>
            <span style={{ fontFamily: "var(--font-text)", fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>
              {emotion.name}
            </span>
          </div>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 34,
            letterSpacing: -0.5,
            lineHeight: 1.15,
            margin: "0 0 8px",
            color: "var(--fg)",
          }}
        >
          {isGrowth ? (
            <>
              What are you noticing
              <br />
              with this feeling?
            </>
          ) : (
            <>
              What belief is
              <br />
              underneath this feeling?
            </>
          )}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-text)",
            fontSize: 14,
            color: "var(--fg-dim)",
            margin: "0 0 28px",
            lineHeight: 1.5,
          }}
        >
          {isGrowth
            ? "Stay with it. Don't edit."
            : "Type whatever's there. Don't edit it. We'll work with it."}
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            value={belief}
            onChange={(e) => setBelief(e.target.value)}
            placeholder={
              isGrowth
                ? `e.g. "I feel this warmth but I'm not sure I deserve it"…`
                : `e.g. "I'm not good enough", "Nobody really cares about me"…`
            }
            rows={5}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--hairline)",
              borderRadius: 20,
              padding: "18px 20px",
              color: "var(--fg)",
              fontFamily: "var(--font-text)",
              fontSize: 16,
              lineHeight: 1.5,
              resize: "none",
              outline: "none",
              display: "block",
            }}
          />

          <button
            type="submit"
            disabled={!belief.trim()}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "16px 24px",
              borderRadius: 18,
              background: belief.trim()
                ? `linear-gradient(180deg, ${emotion.color}, ${emotion.color}cc)`
                : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "white",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 15,
              boxShadow: belief.trim()
                ? `0 10px 30px ${emotion.color}55, inset 0 1px 0 rgba(255,255,255,0.25)`
                : "none",
              cursor: belief.trim() ? "pointer" : "not-allowed",
              opacity: belief.trim() ? 1 : 0.5,
              transition: "all 0.2s",
            }}
          >
            {isGrowth ? "Deepen this feeling →" : "Reframe this belief →"}
          </button>
        </form>
      </div>
    </div>
  );
}
