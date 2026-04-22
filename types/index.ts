export type EmotionEntry = {
  id: string;
  date: string;
  emotion: string;
  emotionEmoji: string;
  emotionColor: string;
  belief: string;
  insight: string;
};

export type AppStep = "idle" | "emotion-selected" | "submitting" | "streaming" | "complete";

export type EmotionCategory = "challenging" | "growth";

export type GrowthInsight = {
  reflection: string;
  encouragement: string;
  empowerment_sentence: string;
};

export type Emotion = {
  name: string;
  emoji: string;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
};
