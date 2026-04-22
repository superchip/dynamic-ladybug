import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Sanctuary",
  slug: "sanctuary",
  extra: {
    groqApiKey: process.env.GROQ_API_KEY ?? "",
  },
});
