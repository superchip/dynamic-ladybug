import { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { C } from "../lib/colors";
import { EmotionCategory } from "../lib/emotions";

export default function BeliefEntry() {
  const router = useRouter();
  const { emotion, emoji, color, category } = useLocalSearchParams<{
    emotion: string; emoji: string; color: string; category: EmotionCategory;
  }>();
  const [text, setText] = useState("");
  const inputRef = useRef<TextInput>(null);
  const isGrowth = category === "growth";

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = () => {
    if (!text.trim()) return;
    router.push({
      pathname: "/insight",
      params: { emotion, emoji, color, category, belief: text.trim() },
    });
  };

  return (
    <View style={styles.root}>
      {/* Ambient glow */}
      <View style={[styles.glow, { backgroundColor: `${C.primaryContainer}18` }]} pointerEvents="none" />

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={0}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
              <Text style={styles.backIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Insight</Text>
            <View style={styles.spacer} />
          </View>

          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {/* Emotion pill */}
            <View style={styles.pillWrap}>
              <View style={[styles.pill, { borderColor: `${color}30`, backgroundColor: `${C.surfaceVariant}50` }]}>
                <View style={[styles.pillDot, { backgroundColor: color, shadowColor: color }]} />
                <Text style={styles.pillText}>{(emotion ?? "").toUpperCase()}</Text>
              </View>
            </View>

            {/* Input area */}
            <View style={[styles.inputArea, { backgroundColor: `${C.surfaceLowest}80` }]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder={
                  isGrowth
                    ? "What are you noticing with this feeling?"
                    : "What is the specific belief driving this feeling?"
                }
                placeholderTextColor="rgba(255,255,255,0.35)"
                multiline
                textAlignVertical="top"
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={handleSubmit}
              />
              <Text style={styles.inputHint}>
                {isGrowth
                  ? "Share openly. Stay with what is present."
                  : "Speak plainly. The deeper you go, the clearer the water."}
              </Text>
            </View>
          </ScrollView>

          {/* CTA */}
          <View style={styles.ctaWrap}>
            <TouchableOpacity
              style={[styles.cta, !text.trim() && styles.ctaDisabled]}
              onPress={handleSubmit}
              disabled={!text.trim()}
              activeOpacity={0.85}
            >
              <View style={styles.ctaGradient}>
                <Text style={styles.ctaText}>
                  {isGrowth ? "Deepen this feeling" : "Get Insight"}{"  →"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surfaceLowest },
  safe: { flex: 1 },
  glow: {
    position: "absolute",
    top: "10%", left: "10%", right: "10%",
    height: 500,
    borderRadius: 999,
    opacity: 0.4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: `${C.outlineVariant}15`,
    backgroundColor: `${C.surfaceLowest}a0`,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: C.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { color: C.onSurfaceVariant, fontSize: 16 },
  headerTitle: { flex: 1, textAlign: "center", fontFamily: "Manrope_700Bold", fontSize: 17, color: "#fff" },
  spacer: { width: 40 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 },
  pillWrap: { alignItems: "center", marginBottom: 40 },
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
  inputArea: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
    padding: 24,
    minHeight: 240,
  },
  input: {
    fontFamily: "Manrope_700Bold",
    fontSize: 26,
    color: "#fff",
    lineHeight: 36,
    letterSpacing: -0.3,
    textAlign: "center",
    minHeight: 160,
  },
  inputHint: {
    fontFamily: "Manrope_500Medium",
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 20,
  },
  ctaWrap: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  cta: {
    borderRadius: 999,
    height: 60,
    overflow: "hidden",
    shadowColor: C.primaryContainer,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 10,
  },
  ctaDisabled: { opacity: 0.35 },
  ctaGradient: {
    flex: 1,
    backgroundColor: C.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaText: { fontFamily: "Manrope_700Bold", fontSize: 17, color: "#fff", letterSpacing: 0.3 },
});
