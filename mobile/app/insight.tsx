import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { C } from "../lib/colors";
import { EmotionCategory } from "../lib/emotions";
import { streamInsight } from "../lib/groq";
import { saveEntry } from "../lib/storage";

type GrowthInsight = {
  reflection: string;
  encouragement: string;
  empowerment_sentence: string;
};

function parseGrowth(text: string): GrowthInsight | null {
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

export default function InsightScreen() {
  const router = useRouter();
  const { emotion, emoji, color, category, belief } = useLocalSearchParams<{
    emotion: string; emoji: string; color: string; category: EmotionCategory; belief: string;
  }>();

  const [raw, setRaw] = useState("");
  const [streaming, setStreaming] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const isGrowth = category === "growth";

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        let buf = "";
        await streamInsight(
          emotion!,
          belief!,
          category!,
          (chunk) => { buf += chunk; setRaw(buf); },
          controller.signal
        );
        setStreaming(false);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError("Something went wrong. Please try again.");
        setStreaming(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const handleSave = async () => {
    await saveEntry({
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString(),
      emotion: emotion!,
      emotionEmoji: emoji!,
      emotionColor: color!,
      category: category!,
      belief: belief!,
      insight: raw,
    });
    setSaved(true);
  };

  const growthData = !streaming && isGrowth ? parseGrowth(raw) : null;
  const { body, belief: newBelief } = !streaming && !isGrowth ? splitChallenging(raw) : { body: "", belief: "" };

  return (
    <View style={styles.root}>
      {/* Ambient light pool */}
      <View style={[styles.glow, { backgroundColor: `${color}20` }]} pointerEvents="none" />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sanctuary</Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Emotion context pill */}
          <View style={styles.pillWrap}>
            <View style={[styles.pill, { borderColor: `${color}30`, backgroundColor: `${C.surfaceVariant}50` }]}>
              <View style={[styles.pillDot, { backgroundColor: color!, shadowColor: color! }]} />
              <Text style={styles.pillText}>{(emotion ?? "").toUpperCase()}</Text>
            </View>
          </View>

          {/* Glass insight card */}
          <View style={[styles.glassCard, { borderColor: `${C.outlineVariant}18`, shadowColor: C.primaryContainer }]}>
            <View style={styles.cardLabel}>
              <Text style={[styles.cardLabelIcon]}>✦</Text>
              <Text style={styles.cardLabelText}>
                {isGrowth ? "Your Experience" : "Reframed Perspective"}
              </Text>
            </View>

            {streaming ? (
              isGrowth ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color={C.primary} size="small" />
                  <Text style={styles.loadingText}>Receiving your insight…</Text>
                </View>
              ) : (
                <Text style={styles.insightText}>
                  {raw}
                  <Text style={{ color: C.primary }}>▌</Text>
                </Text>
              )
            ) : isGrowth && growthData ? (
              <>
                <Text style={styles.insightText}>{growthData.reflection}</Text>
                <Text style={styles.encouragement}>{growthData.encouragement}</Text>
              </>
            ) : error ? (
              <Text style={[styles.insightText, { color: C.tertiary }]}>{error}</Text>
            ) : (
              <Text style={styles.insightText}>{body || raw}</Text>
            )}
          </View>

          {/* Empowerment glow box */}
          {!streaming && !error && (
            <View style={[
              styles.glowBox,
              {
                backgroundColor: `${color}14`,
                borderColor: `${color}44`,
                shadowColor: color!,
              },
            ]}>
              <Text style={[styles.glowLabel, { color: `${color}dd` }]}>
                {isGrowth ? "YOUR EMPOWERMENT" : "YOUR NEW BELIEF"}
              </Text>
              <Text style={styles.glowText}>
                {isGrowth && growthData ? growthData.empowerment_sentence : newBelief}
              </Text>
            </View>
          )}

          {/* Actions */}
          {!streaming && !error && (
            <View style={styles.actions}>
              {!saved ? (
                <TouchableOpacity
                  style={[styles.btnPrimary, { backgroundColor: C.primaryContainer, shadowColor: C.primaryContainer }]}
                  onPress={handleSave}
                  activeOpacity={0.85}
                >
                  <Text style={styles.btnPrimaryText}>🔖  Save to History</Text>
                </TouchableOpacity>
              ) : (
                <View style={[styles.btnPrimary, { backgroundColor: `${C.surfaceContainer}`, shadowOpacity: 0 }]}>
                  <Text style={[styles.btnPrimaryText, { color: C.onSurfaceVariant }]}>Saved ✓</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => router.replace("/")}
                activeOpacity={0.7}
              >
                <Text style={styles.btnSecondaryText}>↺  Start Over</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surfaceLowest },
  safe: { flex: 1 },
  glow: {
    position: "absolute",
    top: "5%", left: "5%", right: "5%",
    height: 500,
    borderRadius: 999,
    opacity: 0.3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: `${C.outlineVariant}15`,
    backgroundColor: `${C.surfaceLowest}90`,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: C.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { color: C.primary, fontSize: 18 },
  headerTitle: { flex: 1, textAlign: "center", fontFamily: "Manrope_700Bold", fontSize: 17, color: "#fff" },
  spacer: { width: 40 },
  content: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 48 },
  pillWrap: { alignItems: "center", marginBottom: 32 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillDot: {
    width: 8, height: 8, borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  pillText: { fontFamily: "Manrope_700Bold", fontSize: 12, color: "#fff", letterSpacing: 2 },
  glassCard: {
    backgroundColor: `${C.surfaceVariant}55`,
    borderRadius: 28,
    borderWidth: 1,
    padding: 28,
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.06,
    shadowRadius: 60,
    elevation: 8,
    gap: 12,
  },
  cardLabel: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  cardLabelIcon: { color: C.primary, fontSize: 12 },
  cardLabelText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 11,
    color: C.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  insightText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 22,
    color: "#f4f1ff",
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  encouragement: {
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    color: C.onSurfaceVariant,
    fontStyle: "italic",
    lineHeight: 22,
  },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  loadingText: { fontFamily: "Manrope_400Regular", fontSize: 15, color: C.onSurfaceVariant },
  glowBox: {
    marginTop: 16,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 6,
  },
  glowLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 10,
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  glowText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 17,
    color: "#f4f1ff",
    lineHeight: 26,
  },
  actions: { gap: 12, marginTop: 28 },
  btnPrimary: {
    height: 58,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 8,
  },
  btnPrimaryText: { fontFamily: "Manrope_700Bold", fontSize: 16, color: "#fff", letterSpacing: 0.3 },
  btnSecondary: {
    height: 58,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: `${C.outlineVariant}40`,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${C.surfaceContainer}80`,
    flexDirection: "row",
    gap: 8,
  },
  btnSecondaryText: { fontFamily: "Manrope_600SemiBold", fontSize: 16, color: C.onSurfaceVariant },
});
