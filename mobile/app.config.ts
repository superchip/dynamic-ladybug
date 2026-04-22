import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Sanctuary",
  slug: "sanctuary",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  scheme: "sanctuary",
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#0e0e0e",
  },
  android: {
    package: "com.sanctuary.mindful",
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0e0e0e",
    },
    edgeToEdgeEnabled: true,
    permissions: ["android.permission.INTERNET"],
  },
  ios: {
    bundleIdentifier: "com.sanctuary.mindful",
    supportsTablet: false,
  },
  plugins: ["expo-router", "expo-font"],
  extra: {
    eas: {
      projectId: "",
    },
  },
});
