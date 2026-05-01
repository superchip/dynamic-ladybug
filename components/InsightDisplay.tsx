"use client";

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
  return { body: sentences.slice(0, -1).join(" "), empoweringBelief: last };
}

function parseGrowthInsight(text: string): GrowthInsight | null {
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

  const displayBody = isGrowth
    ? growthData
      ? growthData.reflection
      : insight
    : body || insight;

  const displayNewBelief = isGrowth
    ? growthData?.empowerment_sentence ?? ""
    : empoweringBelief;

  const now = new Date();
  const timeStr = now.toLocaleDateString("en-US", { weekday: "short" }) + " · " +
    now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        overflowY: "auto",
        padding: "100px 32px 48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Emotion + time row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
            <span>{emotion.emoji}</span>
            <span style={{ fontFamily: "var(--font-text)", fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>
              {emotion.name}
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--fg-mute)",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {timeStr}
          </span>
        </div>

        {/* Belief card */}
        <div
          style={{
            background: "var(--material)",
            border: "1px solid var(--hairline)",
            backdropFilter: "blur(40px) saturate(140%)",
            WebkitBackdropFilter: "blur(40px) saturate(140%)",
            borderRadius: "var(--r-lg)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 80px -30px rgba(0,0,0,0.5)",
            padding: 22,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "var(--fg-mute)",
              marginBottom: 6,
            }}
          >
            {isGrowth ? "Your reflection" : "The belief"}
          </div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 18,
              lineHeight: 1.45,
              color: "var(--fg-dim)",
              margin: 0,
            }}
          >
            &ldquo;{belief}&rdquo;
          </p>
        </div>

        {/* Reflection card */}
        <div
          style={{
            position: "relative",
            padding: 28,
            borderRadius: "var(--r-lg)",
            background: `linear-gradient(160deg, ${emotion.color}1a, ${emotion.color}06)`,
            border: `1px solid ${emotion.color}33`,
            backdropFilter: "blur(40px)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 12,
              color: emotion.color,
            }}
          >
            {isGrowth ? "Your experience" : "Reflection"}
          </div>

          {isStreaming && !insight ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--fg-mute)" }}>
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 18,
                  background: emotion.color,
                  animation: "pulse 1s ease-in-out infinite",
                  borderRadius: 1,
                }}
              />
              <span style={{ fontFamily: "var(--font-text)", fontSize: 14 }}>Finding your insight…</span>
            </div>
          ) : (
            <p
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 17,
                lineHeight: 1.55,
                margin: 0,
                color: "var(--fg)",
              }}
            >
              {displayBody}
              {isStreaming && (
                <span
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 18,
                    marginLeft: 4,
                    verticalAlign: "middle",
                    background: emotion.color,
                    animation: "pulse 1s ease-in-out infinite",
                    borderRadius: 1,
                  }}
                />
              )}
            </p>
          )}

          {isGrowth && growthData?.encouragement && !isStreaming && (
            <p
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 14,
                fontStyle: "italic",
                color: "var(--fg-dim)",
                margin: "12px 0 0",
                lineHeight: 1.5,
              }}
            >
              {growthData.encouragement}
            </p>
          )}
        </div>

        {/* New belief glow card */}
        {!isStreaming && displayNewBelief && (
          <div
            style={{
              position: "relative",
              padding: 28,
              borderRadius: "var(--r-lg)",
              background: `linear-gradient(160deg, ${emotion.color}30, ${emotion.color}10)`,
              border: `1px solid ${emotion.color}88`,
              boxShadow: `0 0 60px ${emotion.color}44, inset 0 1px 0 rgba(255,255,255,0.15)`,
              backdropFilter: "blur(40px)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 12,
                color: emotion.color,
              }}
            >
              {isGrowth ? "Your empowerment" : "A truer belief"}
            </div>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 24,
                lineHeight: 1.35,
                margin: 0,
                fontWeight: 400,
                letterSpacing: -0.3,
                color: "var(--fg)",
              }}
            >
              {displayNewBelief}
            </p>
          </div>
        )}

        {/* Action buttons */}
        {!isStreaming && insight && (
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {saved ? (
              <div
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  borderRadius: 16,
                  border: "1px solid var(--hairline)",
                  color: "var(--fg-mute)",
                  fontFamily: "var(--font-display)",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Saved ✓
              </div>
            ) : (
              <button
                onClick={onSave}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  borderRadius: 16,
                  background: `linear-gradient(180deg, ${emotion.color}, ${emotion.color}cc)`,
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "white",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  boxShadow: `0 10px 24px ${emotion.color}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
                  cursor: "pointer",
                }}
              >
                Save to history
              </button>
            )}
            <button
              onClick={onReset}
              style={{
                flex: 1,
                padding: "14px 20px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--hairline-strong)",
                color: "var(--fg)",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
