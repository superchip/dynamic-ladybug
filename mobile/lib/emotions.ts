export type Emotion = {
  name: string;
  emoji: string;
  color: string;
  subtitle: string;
};

export type EmotionCategory = "challenging" | "growth";

const CHALLENGING: Emotion[] = [
  { name: "Anger", emoji: "🔥", color: "#ef4444", subtitle: "Burning edge" },
  { name: "Fear", emoji: "😨", color: "#6366f1", subtitle: "Held in place" },
  { name: "Sadness", emoji: "💧", color: "#3b82f6", subtitle: "Heavy rain" },
  { name: "Shame", emoji: "😶", color: "#8b5cf6", subtitle: "Turned inward" },
  { name: "Guilt", emoji: "⚖️", color: "#f59e0b", subtitle: "Weighing you down" },
  { name: "Anxiety", emoji: "🌀", color: "#06b6d4", subtitle: "Always spinning" },
  { name: "Loneliness", emoji: "🌑", color: "#64748b", subtitle: "Far from shore" },
  { name: "Overwhelm", emoji: "🌪️", color: "#f97316", subtitle: "Too much noise" },
  { name: "Jealousy", emoji: "👀", color: "#84cc16", subtitle: "Quiet wanting" },
  { name: "Resentment", emoji: "🧊", color: "#14b8a6", subtitle: "Frozen over" },
  { name: "Doubt", emoji: "🌫️", color: "#94a3b8", subtitle: "Unclear path" },
  { name: "Grief", emoji: "🕊️", color: "#a78bfa", subtitle: "Deep passage" },
  { name: "Envy", emoji: "🌿", color: "#22c55e", subtitle: "Longing quietly" },
  { name: "Frustration", emoji: "💢", color: "#fb7185", subtitle: "Stuck in motion" },
  { name: "Despair", emoji: "🌧️", color: "#475569", subtitle: "Low tide" },
];

const GROWTH: Emotion[] = [
  { name: "Growth", emoji: "🌱", color: "#10b981", subtitle: "Becoming" },
  { name: "Calm", emoji: "🌊", color: "#06b6d4", subtitle: "Clear and steady" },
  { name: "Connection", emoji: "🤝", color: "#ec4899", subtitle: "Hearts open" },
  { name: "Love", emoji: "❤️", color: "#f43f5e", subtitle: "Fully here" },
  { name: "Joy", emoji: "✨", color: "#eab308", subtitle: "Light rising" },
  { name: "Gratitude", emoji: "🙏", color: "#f59e0b", subtitle: "Quietly full" },
  { name: "Hope", emoji: "🌅", color: "#0ea5e9", subtitle: "Opening forward" },
  { name: "Confidence", emoji: "💪", color: "#8b5cf6", subtitle: "Grounded strength" },
  { name: "Peace", emoji: "☮️", color: "#14b8a6", subtitle: "Still water" },
  { name: "Curiosity", emoji: "🔍", color: "#f97316", subtitle: "Leaning in" },
  { name: "Excitement", emoji: "🚀", color: "#6366f1", subtitle: "Ready to move" },
  { name: "Inspiration", emoji: "💡", color: "#a855f7", subtitle: "Light arriving" },
  { name: "Compassion", emoji: "💗", color: "#db2777", subtitle: "Soft presence" },
  { name: "Wonder", emoji: "🌌", color: "#4f46e5", subtitle: "Looking inward" },
  { name: "Pride", emoji: "🦁", color: "#d97706", subtitle: "Standing tall" },
];

export const EMOTION_BATCHES: { label: string; category: EmotionCategory; emotions: Emotion[] }[] = [
  { label: "Challenging", category: "challenging", emotions: CHALLENGING },
  { label: "Growth", category: "growth", emotions: GROWTH },
];
