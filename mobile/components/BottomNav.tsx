import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { C } from "../lib/colors";

type Tab = "quiet" | "refrain" | "growth" | "vibe";

type Props = { active: Tab };

const TABS: { id: Tab; label: string; icon: string; route: string }[] = [
  { id: "quiet",   label: "Quiet",   icon: "💧", route: "/" },
  { id: "refrain", label: "Refrain", icon: "✦",  route: "/" },
  { id: "growth",  label: "Growth",  icon: "🌱", route: "/history" },
  { id: "vibe",    label: "Vibe",    icon: "👤", route: "/" },
];

export default function BottomNav({ active }: Props) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              {!isActive && <Text style={styles.tabLabel}>{tab.label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 68,
    backgroundColor: `rgba(38,37,37,0.85)`,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: `${C.outlineVariant}15`,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  tabActive: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.primaryContainer,
    flex: 0,
    shadowColor: C.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  tabIcon: { fontSize: 18 },
  tabLabel: {
    fontFamily: "Manrope_700Bold",
    fontSize: 9,
    color: C.onSurfaceVariant,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});
