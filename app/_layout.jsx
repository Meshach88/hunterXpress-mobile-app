import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {
  Sora_100Thin,
  Sora_200ExtraLight,
  Sora_300Light,
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from '@expo-google-fonts/sora';

import { useColorScheme } from '@/hooks/use-color-scheme';

//Keep splash screen visible while fetching resources
// SplashScreen.preventAutoHideAsync();

//Set animation options
// SplashScreen.setOptions({
//   duration: 400,
//   fade: true
// })

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  // console.log("user", user);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && !inAuthGroup) {
      // Redirect to welcome/login if not authenticated
      router.replace('/');
    } else if (user && inAuthGroup) {
      // Redirect to main app if authenticated
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="login" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}


export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // const [fontsLoaded] = useFonts({
  //   Sora_100Thin,
  //   Sora_200ExtraLight,
  //   Sora_300Light,
  //   Sora_400Regular,
  //   Sora_500Medium,
  //   Sora_600SemiBold,
  //   Sora_700Bold,
  //   Sora_800ExtraBold,
  // });

  // useEffect(() => {
  //   if (fontsLoaded) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <SafeAreaProvider>
            <ThemeProvider>
                <AuthProvider>
                    <StatusBar style="light" />
                    <RootLayoutNav />
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
  );
}
