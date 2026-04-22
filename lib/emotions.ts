import { Emotion } from "@/types";

const CHALLENGING_EMOTIONS: Emotion[] = [
  { name: "Anger", emoji: "🔥", color: "#ef4444", bgClass: "bg-red-500", textClass: "text-red-500", borderClass: "border-red-500" },
  { name: "Fear", emoji: "😨", color: "#6366f1", bgClass: "bg-indigo-500", textClass: "text-indigo-500", borderClass: "border-indigo-500" },
  { name: "Sadness", emoji: "💧", color: "#3b82f6", bgClass: "bg-blue-500", textClass: "text-blue-500", borderClass: "border-blue-500" },
  { name: "Shame", emoji: "😔", color: "#a855f7", bgClass: "bg-purple-500", textClass: "text-purple-500", borderClass: "border-purple-500" },
  { name: "Guilt", emoji: "😓", color: "#64748b", bgClass: "bg-slate-500", textClass: "text-slate-500", borderClass: "border-slate-500" },
  { name: "Anxiety", emoji: "😰", color: "#f59e0b", bgClass: "bg-amber-500", textClass: "text-amber-500", borderClass: "border-amber-500" },
  { name: "Loneliness", emoji: "🫥", color: "#0ea5e9", bgClass: "bg-sky-500", textClass: "text-sky-500", borderClass: "border-sky-500" },
  { name: "Jealousy", emoji: "💚", color: "#22c55e", bgClass: "bg-green-500", textClass: "text-green-500", borderClass: "border-green-500" },
  { name: "Hurt", emoji: "💔", color: "#f43f5e", bgClass: "bg-rose-500", textClass: "text-rose-500", borderClass: "border-rose-500" },
  { name: "Hopelessness", emoji: "🪨", color: "#6b7280", bgClass: "bg-gray-500", textClass: "text-gray-500", borderClass: "border-gray-500" },
  { name: "Frustration", emoji: "😤", color: "#f97316", bgClass: "bg-orange-500", textClass: "text-orange-500", borderClass: "border-orange-500" },
  { name: "Overwhelm", emoji: "🌊", color: "#eab308", bgClass: "bg-yellow-500", textClass: "text-yellow-500", borderClass: "border-yellow-500" },
  { name: "Disappointment", emoji: "😞", color: "#14b8a6", bgClass: "bg-teal-500", textClass: "text-teal-500", borderClass: "border-teal-500" },
  { name: "Grief", emoji: "🕊️", color: "#8b5cf6", bgClass: "bg-violet-500", textClass: "text-violet-500", borderClass: "border-violet-500" },
  { name: "Envy", emoji: "👀", color: "#84cc16", bgClass: "bg-lime-500", textClass: "text-lime-500", borderClass: "border-lime-500" },
];

const GROWTH_EMOTIONS: Emotion[] = [
  { name: "Growth", emoji: "🌱", color: "#10b981", bgClass: "bg-emerald-500", textClass: "text-emerald-500", borderClass: "border-emerald-500" },
  { name: "Calm", emoji: "🌊", color: "#06b6d4", bgClass: "bg-cyan-500", textClass: "text-cyan-500", borderClass: "border-cyan-500" },
  { name: "Connection", emoji: "🤝", color: "#ec4899", bgClass: "bg-pink-500", textClass: "text-pink-500", borderClass: "border-pink-500" },
  { name: "Love", emoji: "❤️", color: "#f43f5e", bgClass: "bg-rose-500", textClass: "text-rose-500", borderClass: "border-rose-500" },
  { name: "Joy", emoji: "✨", color: "#eab308", bgClass: "bg-yellow-500", textClass: "text-yellow-500", borderClass: "border-yellow-500" },
  { name: "Gratitude", emoji: "🙏", color: "#f59e0b", bgClass: "bg-amber-500", textClass: "text-amber-500", borderClass: "border-amber-500" },
  { name: "Hope", emoji: "🌅", color: "#0ea5e9", bgClass: "bg-sky-500", textClass: "text-sky-500", borderClass: "border-sky-500" },
  { name: "Confidence", emoji: "💪", color: "#8b5cf6", bgClass: "bg-violet-500", textClass: "text-violet-500", borderClass: "border-violet-500" },
  { name: "Peace", emoji: "☮️", color: "#14b8a6", bgClass: "bg-teal-500", textClass: "text-teal-500", borderClass: "border-teal-500" },
  { name: "Curiosity", emoji: "🔍", color: "#f97316", bgClass: "bg-orange-500", textClass: "text-orange-500", borderClass: "border-orange-500" },
  { name: "Excitement", emoji: "🚀", color: "#6366f1", bgClass: "bg-indigo-500", textClass: "text-indigo-500", borderClass: "border-indigo-500" },
  { name: "Inspiration", emoji: "💡", color: "#a855f7", bgClass: "bg-purple-500", textClass: "text-purple-500", borderClass: "border-purple-500" },
  { name: "Compassion", emoji: "💗", color: "#db2777", bgClass: "bg-pink-600", textClass: "text-pink-600", borderClass: "border-pink-600" },
  { name: "Wonder", emoji: "🌌", color: "#4f46e5", bgClass: "bg-indigo-600", textClass: "text-indigo-600", borderClass: "border-indigo-600" },
  { name: "Pride", emoji: "🦁", color: "#d97706", bgClass: "bg-amber-600", textClass: "text-amber-600", borderClass: "border-amber-600" },
];

export const EMOTION_BATCHES = [
  { label: "Challenging", emotions: CHALLENGING_EMOTIONS },
  { label: "Growth", emotions: GROWTH_EMOTIONS },
];

export const EMOTIONS = CHALLENGING_EMOTIONS;
