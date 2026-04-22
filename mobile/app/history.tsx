import { useState, useEffect, useCallback } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { C } from "../lib/colors";
import { loadEntries, deleteEntry, clearEntries, HistoryEntry } from "../lib/storage";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

type GrowthInsight = { reflection: string; encouragement: string; empowerment_sentence: string };

function tryParseGrowth(text: string): GrowthInsight | null {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const p = JSON.parse(match[0]);
    if (p.reflection && p.encouragement && p.empowerment_sentence) return p;
    return null;
  } catch { return null; }
}

function splitChallenging(text: string): { body: string; belief: string } {
  const sentences = text.trim().split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length <= 1) return { body: "", belief: text.trim() };
  const last = sentences[sentences.length - 1].replace(/^\*{1,2}[^*]*\*{1,2}:?\s*/g, "").trim();
  return { body: sentences.slice(0, -1).join(" "), belief: last };
}

export default function History() {
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const refresh = async () => setEntries(await loadEntries());

  useFocusEffect(useCallback(() => { refresh(); }, []));

  const handleDelete = (id: string) => {
    Alert.alert("Delete entry?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => { await deleteEntry(id); refresh(); },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert("Clear all entries?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear all", style: "destructive",
        onPress: async () => { await clearEntries(); refresh(); },
      },
    ]);
  };

  const renderEntry = ({ item }: { item: HistoryEntry }) => {
    const growth = item.category === "growth" ? tryParseGrowth(item.insight) : null;
    const { body, belief: newBelief } =
      item.category !== "growth" ? splitChallenging(item.insight) : { body: "", belief: "" };

    const dateStr = new Date(item.date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

    return (
      <View style={styles.entry}>
        {/* Emotion + date row */}
        <View style={styles.entryTop}>
          <View style={styles.entryLeft}>
            <View style={[styles.emojiCircle, { backgroundColor: `${item.emotionColor}20`, borderColor: `${item.emotionColor}30` }]}>
              <Text style={styles.entryEmoji}>{item.emotionEmoji}</Text>
            </View>
            <View>
              <Text style={styles.entryEmotion}>{item.emotion}</Text>
              <Text style={styles.entryDate}>{dateStr}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={12}>
            <Text style={styles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Belief / Reflection */}
        <Text style={styles.entryBelief}>"{item.belief}"</Text>

        {/* Insight section */}
        {growth ? (
          <>
            <View style={[styles.insightBox, { backgroundColor: `${item.emotionColor}10`, borderColor: `${item.emotionColor}18` }]}>
              <Text style={[styles.insightLabel, { color: `${item.emotionColor}bb` }]}>YOUR EXPERIENCE</Text>
              <Text style={styles.insightText}>{growth.reflection}</Text>
              <Text style={styles.encouragement}>{growth.encouragement}</Text>
            </View>
            <View style={[styles.glowBox, { backgroundColor: `${item.emotionColor}14`, borderColor: `${item.emotionColor}44`, shadowColor: item.emotionColor }]}>
              <Text style={[styles.glowLabel, { color: `${item.emotionColor}dd` }]}>YOUR EMPOWERMENT</Text>
              <Text style={styles.glowText}>{growth.empowerment_sentence}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.insightBox, { backgroundColor: `${item.emotionColor}10`, borderColor: `${item.emotionColor}18` }]}>
              <Text style={[styles.insightLabel, { color: `${item.emotionColor}bb` }]}>INSIGHT</Text>
              <Text style={styles.insightText}>{body || item.insight}</Text>
            </View>
            {newBelief && body && (
              <View style={[styles.glowBox, { backgroundColor: `${item.emotionColor}14`, borderColor: `${item.emotionColor}44`, shadowColor: item.emotionColor }]}>
                <Text style={[styles.glowLabel, { color: `${item.emotionColor}dd` }]}>NEW BELIEF</Text>
                <Text style={styles.glowText}>{newBelief}</Text>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <TopBar />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>Past Reflections</Text>
            <Text style={styles.pageSub}>Your sanctuary of insights over time.</Text>
          </View>
          {entries.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} hitSlop={8}>
              <Text style={styles.clearAll}>Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptySub}>Your saved insights will appear here.</Text>
            <TouchableOpacity onPress={() => router.replace("/")} style={styles.startBtn} activeOpacity={0.8}>
              <Text style={styles.startBtnText}>Begin a session →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(e) => e.id}
            renderItem={renderEntry}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
      <BottomNav active="growth" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surfaceLowest },
  safe: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  pageTitle: { fontFamily: "Manrope_800ExtraBold", fontSize: 28, color: "#fff", letterSpacing: -0.3 },
  pageSub: { fontFamily: "Manrope_400Regular", fontSize: 14, color: C.onSurfaceVariant, marginTop: 4 },
  clearAll: { fontFamily: "Manrope_500Medium", fontSize: 13, color: C.onSurfaceVariant },
  list: { paddingHorizontal: 20, paddingBottom: 100, gap: 16 },
  entry: {
    backgroundColor: C.surfaceLow,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: `${C.outlineVariant}15`,
  },
  entryTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  entryLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  emojiCircle: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  entryEmoji: { fontSize: 20 },
  entryEmotion: { fontFamily: "Manrope_700Bold", fontSize: 16, color: "#fff" },
  entryDate: { fontFamily: "Manrope_400Regular", fontSize: 12, color: C.onSurfaceVariant, marginTop: 1 },
  deleteIcon: { color: `${C.onSurfaceVariant}60`, fontSize: 16 },
  entryBelief: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: C.onSurfaceVariant,
    fontStyle: "italic",
    lineHeight: 20,
    borderLeftWidth: 2,
    borderLeftColor: `${C.outlineVariant}40`,
    paddingLeft: 12,
  },
  insightBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  insightLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 4,
  },
  insightText: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: C.onSurface,
    lineHeight: 21,
  },
  encouragement: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    color: C.onSurfaceVariant,
    fontStyle: "italic",
    lineHeight: 19,
  },
  glowBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  glowLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 6,
  },
  glowText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    color: "#f4f1ff",
    lineHeight: 21,
  },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingBottom: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyTitle: { fontFamily: "Manrope_700Bold", fontSize: 20, color: "#fff" },
  emptySub: { fontFamily: "Manrope_400Regular", fontSize: 14, color: C.onSurfaceVariant },
  startBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: C.primaryContainer,
    borderRadius: 999,
  },
  startBtnText: { fontFamily: "Manrope_600SemiBold", fontSize: 15, color: "#fff" },
});
