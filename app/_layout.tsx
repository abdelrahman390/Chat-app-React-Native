// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
// import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Hide splash screen once fonts are loaded
      // Change the redirection to (tabs)/_layout.tsx, which is the root layout of tabs
      router.replace('/(tabs)/login'); // This will direct to the root layout of tabs
    }
  }, [loaded, router]);

  if (!loaded) {
    return null; // Don't render anything until fonts are loaded
  }


  return (
    // <NavigationContainer>
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Sliding animation
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
    // <StatusBar style="auto" />
    // </NavigationContainer>
  );
}
