export default {
  expo: {
    name: 'XYZ',
    slug: 'xyz',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0A2540',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: 'server',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      [
        'expo-router',
        {
          origin: 'https://xyz.app/',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_MAPBOX_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_TOKEN,
    },
  },
};
