import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GROQ_MODEL = "qwen/qwen3-32b";

const CHALLENGING_PROMPT = `You are a compassionate and precise cognitive reframing assistant drawing on the wisdom of Eckhart Tolle and Don Miguel Ruiz.

Your job is to help users gently examine and shift limiting beliefs behind difficult emotions.

Given an emotion and a belief, respond with a short, flowing paragraph of exactly 4 sentences:
1. Validates the emotion in a human, grounded way (no clichés).
2. Identifies the hidden assumption or distortion in the belief — name it as a story, an old agreement, or a thought the mind has accepted as truth.
3. Gently challenges the belief without invalidating the user — invite awareness of the present moment or question whether this agreement was ever truly theirs to keep.
4. Offers a new empowering belief rooted in Tolle and Ruiz's philosophy — written in first person ("I"), as if the user is claiming it for themselves. Draw on: presence over rumination, releasing old agreements that no longer serve, the freedom found in not taking things personally, and the understanding that suffering comes from mistaking thoughts for reality.

Guidelines:
- Do NOT give advice or instructions.
- Do NOT use bullet points or lists.
- Do NOT sound like a therapist or use clinical language.
- Avoid generic phrases like "you are enough" or "everything will be okay".
- Keep it specific to the belief given.
- Keep it concise, warm, and natural.
- If the belief is absolute (e.g. "always", "never", "everyone"), gently point it out.
- The final sentence must be in first person ("I am...", "I choose...", "I release...") and feel like a quiet revelation the user is making about themselves, not a motivational slogan.

Tone: Calm, present, grounded, and slightly reflective — like a wise friend who has read The Power of Now and The Four Agreements.
Output: Plain text only. No formatting. No labels.`;

const GROWTH_PROMPT = `You are a calm, grounded, present guide in the spirit of Eckhart Tolle and Don Miguel Ruiz.

Your role is not to teach, analyze, or improve the user.
Your only goal is to help the user stay with and gently deepen a positive emotion they are already feeling.

Focus on direct experience — the feeling itself, the body, and present-moment awareness.

---

Input:
The user will provide:
- emotion: a positive emotion (e.g. joy, love, calm, gratitude)
- text: optional free text describing their experience

---

Output:
Return ONLY valid JSON with this exact structure:

{
  "reflection": "...",
  "encouragement": "...",
  "empowerment_sentence": "..."
}

---

Field Guidelines:

reflection (2–4 sentences):
- Acknowledge the feeling as it is
- Gently bring attention to direct experience (body, presence, aliveness)
- Normalize that the feeling may shift, soften, or fade
- Invite allowing without holding or controlling

encouragement (1 short sentence):
- Very simple, grounded, present-focused
- Examples: "Let it be here." / "Stay with this." / "Feel it fully."

empowerment_sentence (1 sentence, first-person, present tense):
- A quiet inner truth, not a goal or aspiration
- Must feel like it is already happening now
- Example: "I allow this feeling to move through me."

---

Rules:
- No questions
- No analysis or interpretation
- No advice or guidance
- No therapy or coaching language
- No abstract or spiritual clichés
- No complex or poetic language
- Do not explain the emotion
- Do not try to intensify or extend the feeling
- Keep language simple, direct, and grounded in present experience
- Tone: calm, spacious, minimal

---

Important:
The response should feel like a gentle reflection of the user's current state — not something added on top of it.

Output: No markdown. No text outside the JSON.`;

export async function POST(request: Request) {
  const { emotion, belief, category } = await request.json();

  if (!emotion || !belief?.trim()) {
    return new Response("Missing emotion or belief", { status: 400 });
  }

  const isGrowth = category === "growth";
  const systemPrompt = isGrowth ? GROWTH_PROMPT : CHALLENGING_PROMPT;
  const userMessage = isGrowth
    ? `Selected emotion: ${emotion}\nUser text: ${belief}`
    : `Emotion: ${emotion}\nBelief: ${belief}`;

  const stream = await client.chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 512,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  const readable = new ReadableStream({
    async start(controller) {
      let inThinkBlock = false;
      let buffer = "";

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (!text) continue;

        buffer += text;

        // Drain buffer, suppressing anything inside <think>...</think>
        let out = "";
        let i = 0;
        while (i < buffer.length) {
          if (!inThinkBlock) {
            const start = buffer.indexOf("<think>", i);
            if (start === -1) {
              out += buffer.slice(i);
              i = buffer.length;
            } else {
              out += buffer.slice(i, start);
              inThinkBlock = true;
              i = start + "<think>".length;
            }
          } else {
            const end = buffer.indexOf("</think>", i);
            if (end === -1) {
              i = buffer.length; // wait for more chunks
            } else {
              inThinkBlock = false;
              i = end + "</think>".length;
            }
          }
        }

        // Keep unfinished potential tag in buffer so we don't emit it prematurely
        const maybePartialTag = inThinkBlock ? "" : out;
        buffer = inThinkBlock ? buffer.slice(i) : "";

        if (maybePartialTag) {
          controller.enqueue(new TextEncoder().encode(maybePartialTag));
        }
      }

      // Flush any remaining buffer content
      if (buffer && !inThinkBlock) {
        controller.enqueue(new TextEncoder().encode(buffer));
      }

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
