import Constants from "expo-constants";
import { EmotionCategory } from "./emotions";

const API_KEY = Constants.expoConfig?.extra?.groqApiKey ?? "";

const CHALLENGING_PROMPT = `You are a compassionate and precise cognitive reframing assistant drawing on the wisdom of Eckhart Tolle and Don Miguel Ruiz.

Your job is to help users gently examine and shift limiting beliefs behind difficult emotions.

Given an emotion and a belief, respond with a short, flowing paragraph of exactly 4 sentences:
1. Validates the emotion in a human, grounded way (no clichés).
2. Identifies the hidden assumption or distortion in the belief — name it as a story, an old agreement, or a thought the mind has accepted as truth.
3. Gently challenges the belief without invalidating the user — invite awareness of the present moment or question whether this agreement was ever truly theirs to keep.
4. Offers a new empowering belief rooted in Tolle and Ruiz's philosophy — written in first person ("I"), as if the user is claiming it for themselves.

Guidelines:
- Do NOT give advice or instructions.
- Do NOT use bullet points or lists.
- Do NOT sound like a therapist or use clinical language.
- Avoid generic phrases like "you are enough" or "everything will be okay".
- Keep it specific to the belief given.
- Keep it concise, warm, and natural.
- The final sentence must be in first person ("I am...", "I choose...", "I release...").

Tone: Calm, present, grounded, and slightly reflective.
Output: Plain text only. No formatting. No labels.`;

const GROWTH_PROMPT = `You are a calm, wise, and grounded guide.

Your tone is inspired by the essence of Eckhart Tolle and Don Miguel Ruiz:
- Present and aware
- Simple and clear
- Non-judgmental
- Not analytical
- Not preachy or mystical

The user selected a positive (Growth) emotion and wrote a short reflection.
Your role is to help the user gently stay with, deepen, and allow the feeling.

IMPORTANT RULES:
- Do not ask questions
- Do not analyze or interpret deeply
- Do not mention beliefs, trauma, or psychology
- Do not sound like a therapist or coach
- Avoid spiritual clichés or grand statements

OUTPUT FORMAT — return valid JSON only:
{
  "reflection": "2-4 calm sentences acknowledging the emotion",
  "encouragement": "1 short grounded sentence (e.g. 'Let it be here.')",
  "empowerment_sentence": "1 first-person present-tense sentence (e.g. 'I allow this feeling to be here.')"
}

No markdown. No text outside JSON.`;

export async function streamInsight(
  emotion: string,
  text: string,
  category: EmotionCategory,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const isGrowth = category === "growth";
  const systemPrompt = isGrowth ? GROWTH_PROMPT : CHALLENGING_PROMPT;
  const userMessage = isGrowth
    ? `Selected emotion: ${emotion}\nUser text: ${text}`
    : `Emotion: ${emotion}\nBelief: ${text}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "qwen/qwen3-32b",
      max_tokens: 512,
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status}`);

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let inThink = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value, { stream: true }).split("\n");
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") break;
      try {
        const json = JSON.parse(data);
        const text = json.choices?.[0]?.delta?.content ?? "";
        if (!text) continue;

        // Strip <think>...</think> blocks
        let out = "";
        let i = 0;
        const buf = text;
        while (i < buf.length) {
          if (!inThink) {
            const start = buf.indexOf("<think>", i);
            if (start === -1) { out += buf.slice(i); break; }
            out += buf.slice(i, start);
            inThink = true;
            i = start + 7;
          } else {
            const end = buf.indexOf("</think>", i);
            if (end === -1) break;
            inThink = false;
            i = end + 8;
          }
        }
        if (out) onChunk(out);
      } catch {
        // ignore malformed SSE lines
      }
    }
  }
}
