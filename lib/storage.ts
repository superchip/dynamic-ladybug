import { EmotionEntry } from "@/types";

const KEY = "dynamic_ladybug_history";
const MAX_ENTRIES = 100;

export function getEntries(): EmotionEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: EmotionEntry): void {
  const entries = getEntries();
  entries.unshift(entry);
  if (entries.length > MAX_ENTRIES) entries.splice(MAX_ENTRIES);
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function deleteEntry(id: string): void {
  const entries = getEntries().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function clearEntries(): void {
  localStorage.removeItem(KEY);
}
