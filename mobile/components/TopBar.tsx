import { View, Text, StyleSheet } from "react-native";
import { C } from "../lib/colors";

export default function TopBar() {
  return (
    <View style={styles.bar}>
      <Text style={styles.icon}>🌿</Text>
      <Text style={styles.title}>Sanctuary</Text>
      <View style={styles.avatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: `${C.outlineVariant}15`,
    backgroundColor: `rgba(9,9,9,0.6)`,
  },
  icon: { fontSize: 20 },
  title: { fontFamily: "Manrope_700Bold", fontSize: 18, color: "#fff", letterSpacing: 0.3 },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: C.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: `${C.outlineVariant}20`,
  },
});
