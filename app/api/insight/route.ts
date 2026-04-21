import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GROQ_MODEL = "qwen/qwen3-32b";

const SYSTEM_PROMPT = `You are a compassionate, psychologically-grounded coach specializing in cognitive reframing.
Given an emotion someone is experiencing and the belief driving that emotion, provide a reframed belief insight that:
1. Validates the emotion without reinforcing the limiting belief
2. Offers a genuinely strengthening alternative perspective grounded in reality
3. Is honest, warm, and empowering — never toxic positivity or dismissive
4. Is 3–5 sentences. No bullet points. No headers. Speak directly to the person as "you".
5. End with a concise, memorable reframe of their belief as a new empowering statement.`;

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
      { role: "user", content: `I am feeling ${emotion}. The belief behind this feeling is: "${belief}"` },
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
