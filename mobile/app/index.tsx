import { useState, useRef, useCallback } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { C } from "../lib/colors";
import { EMOTION_BATCHES, Emotion, EmotionCategory } from "../lib/emotions";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

const { width: W } = Dimensions.get("window");
const CARD_W = W * 0.62;
const CARD_H = CARD_W * 1.35;
const SIDE_W = (W - CARD_W) / 2;

export default function EmotionPicker() {
  const router = useRouter();
  const [batchIdx, setBatchIdx] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList>(null);

  const batch = EMOTION_BATCHES[batchIdx];
  const emotions = batch.emotions;

  const handleBatchSwitch = (idx: number) => {
    setBatchIdx(idx);
    setActiveIdx(0);
    listRef.current?.scrollToIndex({ index: 0, animated: false });
  };

  const onMomentumScrollEnd = useCallback(
    (e: any) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / CARD_W);
      setActiveIdx(idx);
    },
    []
  );

  const handleSelect = () => {
    const emotion = emotions[activeIdx];
    router.push({
      pathname: "/belief",
      params: {
        emotion: emotion.name,
        emoji: emotion.emoji,
        color: emotion.color,
        category: batch.category,
      },
    });
  };

  const renderCard = ({ item, index }: { item: Emotion; index: number }) => {
    const inputRange = [(index - 1) * CARD_W, index * CARD_W, (index + 1) * CARD_W];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.45, 1, 0.45],
      extrapolate: "clamp",
    });
    const isActive = index === activeIdx;

    return (
      <Animated.View style={[styles.cardWrap, { opacity }]}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale }],
              backgroundColor: isActive ? `${item.color}22` : `${C.surfaceVariant}60`,
              borderColor: isActive ? `${item.color}44` : `${C.outlineVariant}22`,
              shadowColor: isActive ? item.color : "transparent",
            },
          ]}
        >
          {/* Inner glow for active */}
          {isActive && (
            <View
              style={[
                styles.innerGlow,
                { backgroundColor: `${item.color}10` },
              ]}
              pointerEvents="none"
            />
          )}
          <View
            style={[
              styles.emojiWrap,
              {
                backgroundColor: isActive ? `${item.color}22` : `${C.surfaceContainerHigh}88`,
                shadowColor: isActive ? item.color : "transparent",
                shadowOpacity: isActive ? 0.4 : 0,
                shadowRadius: isActive ? 20 : 0,
              },
            ]}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          {isActive && (
            <TouchableOpacity style={[styles.selectBtn, { backgroundColor: C.primaryContainer }]} onPress={handleSelect} activeOpacity={0.85}>
              <Text style={styles.selectBtnText}>Select  →</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.root}>
      {/* Ambient light pool */}
      <View style={styles.ambientGlow} pointerEvents="none" />

      <SafeAreaView style={styles.safe} edges={["top"]}>
        <TopBar />

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>How are{"\n"}you feeling?</Text>
          <Text style={styles.heroSub}>Select the emotion that resonates{"\n"}with your current state.</Text>
        </View>

        {/* Category tabs */}
        <View style={styles.tabs}>
          {EMOTION_BATCHES.map((b, i) => (
            <TouchableOpacity
              key={b.label}
              onPress={() => handleBatchSwitch(i)}
              style={[styles.tab, i === batchIdx && styles.tabActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, i === batchIdx && styles.tabTextActive]}>
                {b.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Carousel */}
        <Animated.FlatList
          ref={listRef}
          data={emotions}
          keyExtractor={(item) => `${batchIdx}-${item.name}`}
          renderItem={renderCard}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_W}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: SIDE_W }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: true,
          })}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          style={styles.carousel}
        />

        {/* Dot indicators */}
        <View style={styles.dots}>
          {emotions.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIdx && { width: 20, backgroundColor: C.primary },
              ]}
            />
          ))}
        </View>
      </SafeAreaView>

      <BottomNav active="refrain" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surfaceLowest },
  safe: { flex: 1 },
  ambientGlow: {
    position: "absolute",
    top: "20%",
    left: "10%",
    right: "10%",
    height: 400,
    backgroundColor: `${C.primaryContainer}18`,
    borderRadius: 999,
    transform: [{ scaleX: 1.5 }],
    ...Platform.select({ ios: { filter: "blur(80px)" } }),
  },
  hero: { paddingHorizontal: 28, marginTop: 24, marginBottom: 20 },
  heroTitle: {
    fontFamily: "Manrope_800ExtraBold",
    fontSize: 40,
    color: "#fff",
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  heroSub: {
    fontFamily: "Manrope_400Regular",
    fontSize: 15,
    color: C.onSurfaceVariant,
    marginTop: 8,
    lineHeight: 22,
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 28,
    backgroundColor: `${C.surfaceVariant}40`,
    borderRadius: 999,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: `${C.outlineVariant}20`,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
  },
  tabActive: { backgroundColor: `${C.surfaceContainerHighest}cc` },
  tabText: { fontFamily: "Manrope_600SemiBold", fontSize: 13, color: `${C.onSurfaceVariant}80` },
  tabTextActive: { color: "#fff" },
  carousel: { flexGrow: 0 },
  cardWrap: { width: CARD_W, alignItems: "center", justifyContent: "center" },
  card: {
    width: CARD_W - 16,
    height: CARD_H,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 40,
    elevation: 8,
    overflow: "hidden",
  },
  innerGlow: {
    position: "absolute",
    inset: 0,
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 32,
  },
  emojiWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 4,
  },
  emoji: { fontSize: 44 },
  cardName: {
    fontFamily: "Manrope_700Bold",
    fontSize: 26,
    color: "#fff",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: C.onSurfaceVariant,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  selectBtn: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
  },
  selectBtnText: { fontFamily: "Manrope_700Bold", color: "#fff", fontSize: 15, letterSpacing: 0.5 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 16, marginBottom: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: `${C.onSurfaceVariant}40` },
});
