module.exports = {
  expo: {
    name: "Trippo",
    slug: "trippoapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "trippo",
    userInterfaceStyle: "automatic",
    runtimeVersion: "1.0.0",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.trippo.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#7DD3C0"
      },
      package: "com.trippo.app",
      versionCode: 1,
      permissions: []
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "b4059dce-2052-4a6c-9ece-57c4bacae6dd"
      },
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://haiiwytkyojxspaslqqa.supabase.co",
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhaWl3eXRreW9qeHNwYXNscXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MzM4MDEsImV4cCI6MjA3ODUwOTgwMX0.0vcUTeWAzQD5Nd0OVKQvLRw35ILLsmZcy4kaxgMJGk0"
    }
  }
};
