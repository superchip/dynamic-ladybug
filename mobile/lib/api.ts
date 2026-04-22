import { EmotionCategory } from "./emotions";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

export function streamInsight(
  emotion: string,
  text: string,
  category: EmotionCategory,
  onChunk: (chunk: string) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/api/insight`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    let processed = 0;

    xhr.onprogress = () => {
      const newText = xhr.responseText.slice(processed);
      processed = xhr.responseText.length;
      if (newText) onChunk(newText);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`HTTP ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error"));
    xhr.ontimeout = () => reject(new Error("Request timed out"));
    xhr.timeout = 60000;

    xhr.send(JSON.stringify({ emotion, belief: text, category }));
  });
}
