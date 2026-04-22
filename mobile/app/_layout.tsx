import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { View, ActivityIndicator } from "react-native";
import { C } from "../lib/colors";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: C.surfaceLowest, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={C.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.surfaceLowest } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="belief" />
        <Stack.Screen name="insight" />
        <Stack.Screen name="history" />
      </Stack>
    </>
  );
}
