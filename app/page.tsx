"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CoverFlowPicker from "@/components/CoverFlowPicker";
import BeliefForm from "@/components/BeliefForm";
import InsightDisplay from "@/components/InsightDisplay";
import { saveEntry } from "@/lib/storage";
import { AppStep, Emotion } from "@/types";

export default function Home() {
  const [step, setStep] = useState<AppStep>("idle");
  const [selectedIndex, setSelectedIndex] = useState(5);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [belief, setBelief] = useState("");
  const [insight, setInsight] = useState("");
  const [saved, setSaved] = useState(false);
  const beliefRef = useRef<HTMLDivElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);

  const handleEmotionConfirm = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setStep("emotion-selected");
    setTimeout(() => {
      beliefRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleBeliefSubmit = async (beliefText: string) => {
    setBelief(beliefText);
    setInsight("");
    setSaved(false);
    setStep("submitting");

    try {
      const res = await fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotion: selectedEmotion!.name, belief: beliefText }),
      });

      if (!res.ok) throw new Error("API error");

      setStep("streaming");
      setTimeout(() => {
        insightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setInsight(full);
      }

      setStep("complete");
    } catch {
      setStep("emotion-selected");
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
    setStep("idle");
    setSelectedEmotion(null);
    setBelief("");
    setInsight("");
    setSaved(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLoading = step === "submitting";

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16 gap-20">
      <section className="w-full flex flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white tracking-tight">
            What are you feeling?
          </h1>
          <p className="text-white/40 mt-2 text-base">
            Select the emotion that&apos;s present for you right now
          </p>
        </motion.div>

        <CoverFlowPicker
          selected={selectedIndex}
          onSelect={setSelectedIndex}
          onConfirm={handleEmotionConfirm}
        />
      </section>

      <AnimatePresence>
        {(step === "emotion-selected" || step === "submitting") && selectedEmotion && (
          <section ref={beliefRef} className="w-full max-w-xl">
            <BeliefForm
              emotion={selectedEmotion}
              onSubmit={handleBeliefSubmit}
              isLoading={isLoading}
              onBack={handleReset}
            />
          </section>
        )}

        {(step === "streaming" || step === "complete") && selectedEmotion && (
          <section ref={insightRef} className="w-full max-w-xl">
            <InsightDisplay
              emotion={selectedEmotion}
              belief={belief}
              insight={insight}
              isStreaming={step === "streaming"}
              onSave={handleSave}
              onReset={handleReset}
              saved={saved}
            />
          </section>
        )}
      </AnimatePresence>
    </main>
  );
}
