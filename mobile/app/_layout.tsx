import { Stack } from 'expo-router';
import { View } from 'react-native';
import { theme } from '../src/theme';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'fade',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Full screen modals or separate screens like Validation, Favoris, Recipe Detail will be added here */}
        <Stack.Screen name="validation" options={{ presentation: 'modal' }} />
        <Stack.Screen name="favoris" options={{ presentation: 'modal' }} />
        <Stack.Screen name="recipe" options={{ presentation: 'modal' }} />
      </Stack>
    </View>
  );
}
