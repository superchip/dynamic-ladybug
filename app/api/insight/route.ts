import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GROQ_MODEL = "qwen/qwen3-32b";

const SYSTEM_PROMPT = `You are a compassionate and precise cognitive reframing assistant drawing on the wisdom of Eckhart Tolle and Don Miguel Ruiz.

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

export async function POST(request: Request) {
  const { emotion, belief } = await request.json();

  if (!emotion || !belief?.trim()) {
    return new Response("Missing emotion or belief", { status: 400 });
  }

  const stream = await client.chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 512,
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Emotion: ${emotion}\nBelief: ${belief}` },
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
