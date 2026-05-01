"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuroraBackground from "@/components/AuroraBackground";
import AuroraNav from "@/components/AuroraNav";
import CoverFlowPicker from "@/components/CoverFlowPicker";
import BeliefForm from "@/components/BeliefForm";
import InsightDisplay from "@/components/InsightDisplay";
import { saveEntry } from "@/lib/storage";
import { Emotion, EmotionCategory } from "@/types";

type Page = "home" | "belief" | "insight";

export default function Home() {
  const router = useRouter();
  const [page, setPage] = useState<Page>("home");
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [category, setCategory] = useState<EmotionCategory>("challenging");
  const [belief, setBelief] = useState("");
  const [insight, setInsight] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleEmotionConfirm = (emotion: Emotion, cat: EmotionCategory) => {
    setSelectedEmotion(emotion);
    setCategory(cat);
    setPage("belief");
  };

  const handleBeliefSubmit = async (beliefText: string) => {
    setBelief(beliefText);
    setInsight("");
    setSaved(false);
    setIsStreaming(true);
    setPage("insight");

    try {
      const res = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion: selectedEmotion!.name, belief: beliefText, category }),
      });
      if (!res.ok) throw new Error("API error");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setInsight(full);
      }
    } catch {
      setPage("belief");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSave = () => {
    if (!selectedEmotion || !belief || !insight) return;
    saveEntry({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      emotion: selectedEmotion.name,
      emotionEmoji: selectedEmotion.emoji,
      emotionColor: selectedEmotion.color,
      belief,
      insight,
    });
    setSaved(true);
  };

  const handleReset = () => {
    setPage("home");
    setSelectedEmotion(null);
    setCategory("challenging");
    setBelief("");
    setInsight("");
    setSaved(false);
    setIsStreaming(false);
  };

  const handleNav = (target: "home" | "history") => {
    if (target === "home") handleReset();
    else router.push("/history");
  };

  const bgColor = selectedEmotion?.color ?? "#7c5cff";

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-0)", overflow: "hidden" }}>
      <AuroraBackground color={bgColor} intensity={page === "insight" ? 0.8 : page === "belief" ? 0.7 : 1} />
      <AuroraNav page="home" onNav={handleNav} />

      {page === "home" && (
        <CoverFlowPicker onConfirm={handleEmotionConfirm} />
      )}

      {page === "belief" && selectedEmotion && (
        <BeliefForm
          emotion={selectedEmotion}
          category={category}
          onSubmit={handleBeliefSubmit}
          onBack={() => setPage("home")}
        />
      )}

      {page === "insight" && selectedEmotion && (
        <InsightDisplay
          emotion={selectedEmotion}
          belief={belief}
          insight={insight}
          category={category}
          isStreaming={isStreaming}
          onSave={handleSave}
          onReset={handleReset}
          saved={saved}
        />
      )}
    </div>
  );
}
