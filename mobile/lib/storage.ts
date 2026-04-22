import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "sanctuary_entries";

export type HistoryEntry = {
  id: string;
  date: string;
  emotion: string;
  emotionEmoji: string;
  emotionColor: string;
  category: "challenging" | "growth";
  belief: string;
  insight: string;
};

export async function loadEntries(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveEntry(entry: HistoryEntry): Promise<void> {
  const entries = await loadEntries();
  await AsyncStorage.setItem(KEY, JSON.stringify([entry, ...entries]));
}

export async function deleteEntry(id: string): Promise<void> {
  const entries = await loadEntries();
  await AsyncStorage.setItem(KEY, JSON.stringify(entries.filter((e) => e.id !== id)));
}

export async function clearEntries(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
