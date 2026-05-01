"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuroraBackground from "@/components/AuroraBackground";
import AuroraNav from "@/components/AuroraNav";
import HistoryList from "@/components/HistoryList";
import { getEntries } from "@/lib/storage";
import { EmotionEntry } from "@/types";

export default function HistoryPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<EmotionEntry[]>([]);

  const load = () => setEntries(getEntries());
  useEffect(() => { load(); }, []);

  const handleNav = (target: "home" | "history") => {
    if (target === "home") router.push("/");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", overflow: "hidden" }}>
      <AuroraBackground color="#7c5cff" intensity={0.5} />
      <AuroraNav page="history" onNav={handleNav} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          overflowY: "auto",
          padding: "96px 32px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 720 }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 44,
                fontWeight: 600,
                letterSpacing: -1,
                margin: 0,
                color: "var(--fg)",
              }}
            >
              History
            </h1>
            <p
              style={{
                fontFamily: "var(--font-text)",
                fontSize: 15,
                color: "var(--fg-dim)",
                margin: "6px 0 0",
              }}
            >
              <span style={{ color: "var(--fg)" }}>{entries.length}</span> reflections saved
            </p>
          </div>

          {/* Mood weave strip */}
          {entries.length > 0 && (
            <div
              style={{
                background: "var(--material)",
                border: "1px solid var(--hairline)",
                backdropFilter: "blur(40px) saturate(140%)",
                WebkitBackdropFilter: "blur(40px) saturate(140%)",
                borderRadius: "var(--r-lg)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                padding: 18,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "var(--fg-mute)",
                  marginBottom: 12,
                }}
              >
                Mood weave
              </div>
              <div style={{ display: "flex", gap: 3, height: 36, alignItems: "flex-end" }}>
                {Array.from({ length: 30 }).map((_, i) => {
                  const present = i % 4 === 0 || i % 7 === 0;
                  const e = entries[i % entries.length];
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: present ? `${60 + (i * 13) % 40}%` : "10%",
                        borderRadius: 3,
                        background: present
                          ? `linear-gradient(180deg, ${e.emotionColor}, ${e.emotionColor}66)`
                          : "rgba(255,255,255,0.06)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <HistoryList entries={entries} onUpdate={load} />
        </div>
      </div>
    </div>
  );
}
