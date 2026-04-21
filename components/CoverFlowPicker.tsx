"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EMOTIONS } from "@/lib/emotions";
import { Emotion } from "@/types";

type Props = {
  selected: number;
  onSelect: (index: number) => void;
  onConfirm: (emotion: Emotion) => void;
};

export default function CoverFlowPicker({ selected, onSelect, onConfirm }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const getCardStyle = (offset: number) => {
    const absOffset = Math.abs(offset);
    if (absOffset === 0) {
      return { scale: 1, rotateY: 0, opacity: 1, z: 100, x: 0 };
    }
    if (absOffset === 1) {
      return {
        scale: 0.8,
        rotateY: offset > 0 ? -30 : 30,
        opacity: 0.7,
        z: 50,
        x: offset * 20,
      };
    }
    if (absOffset === 2) {
      return {
        scale: 0.65,
        rotateY: offset > 0 ? -45 : 45,
        opacity: 0.4,
        z: 20,
        x: offset * 15,
      };
    }
    return {
      scale: 0.5,
      rotateY: offset > 0 ? -55 : 55,
      opacity: 0.15,
      z: 0,
      x: offset * 10,
    };
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onSelect(Math.max(0, selected - 1));
      } else if (e.key === "ArrowRight") {
        onSelect(Math.min(EMOTIONS.length - 1, selected + 1));
      } else if (e.key === "Enter") {
        onConfirm(EMOTIONS[selected]);
      }
    },
    [selected, onSelect, onConfirm]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        onSelect(Math.min(EMOTIONS.length - 1, selected + 1));
      } else {
        onSelect(Math.max(0, selected - 1));
      }
    }
    touchStartX.current = null;
  };

  const visibleRange = 3;

  return (
    <div className="flex flex-col items-center gap-8 w-full select-none">
      <div
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-72 perspective-1000"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: "1000px" }}
      >
        <div className="relative flex items-center justify-center w-full h-full">
          {EMOTIONS.map((emotion, index) => {
            const offset = index - selected;
            if (Math.abs(offset) > visibleRange) return null;

            const style = getCardStyle(offset);
            const isCenter = offset === 0;

            return (
              <motion.div
                key={emotion.name}
                className="absolute cursor-pointer"
                animate={{
                  scale: style.scale,
                  rotateY: style.rotateY,
                  opacity: style.opacity,
                  x: `calc(${offset * 220}px + ${style.x}px)`,
                  zIndex: style.z,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => {
                  if (!isCenter) {
                    onSelect(index);
                  }
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`w-48 h-56 rounded-3xl flex flex-col items-center justify-center gap-4 transition-shadow duration-300 ${
                    isCenter ? "shadow-2xl" : "shadow-md"
                  }`}
                  style={{
                    background: isCenter
                      ? `linear-gradient(135deg, ${emotion.color}cc, ${emotion.color})`
                      : `linear-gradient(135deg, ${emotion.color}88, ${emotion.color}aa)`,
                    border: isCenter ? `2px solid ${emotion.color}` : "none",
                  }}
                >
                  <span className="text-6xl">{emotion.emoji}</span>
                  <span className="text-white font-semibold text-lg tracking-wide">
                    {emotion.name}
                  </span>
                  {isCenter && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white/70 text-xs mt-1"
                    >
                      press Enter to select
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => onSelect(Math.max(0, selected - 1))}
          disabled={selected === 0}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition flex items-center justify-center text-white text-lg"
        >
          ←
        </button>

        <div className="flex gap-1.5">
          {EMOTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`rounded-full transition-all duration-200 ${
                i === selected ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/30"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => onSelect(Math.min(EMOTIONS.length - 1, selected + 1))}
          disabled={selected === EMOTIONS.length - 1}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition flex items-center justify-center text-white text-lg"
        >
          →
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onConfirm(EMOTIONS[selected])}
        className="px-8 py-3 rounded-2xl font-semibold text-white text-base shadow-lg transition"
        style={{ background: EMOTIONS[selected].color }}
      >
        I feel {EMOTIONS[selected].name} →
      </motion.button>
    </div>
  );
}
