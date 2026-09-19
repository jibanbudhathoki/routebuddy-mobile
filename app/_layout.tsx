import '../src/theme/unistyles';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { TripCreationProvider } from '../src/features/trip/context/TripCreationContext';
import { getAuthSession } from '../src/features/auth/services/authStorage';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TripCreationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Post Trip Flow Modals */}

          <Stack.Screen name="(modals)/select-store" options={{ presentation: 'modal' }} />
          <Stack.Screen name="(modals)/order-cutoff" options={{ presentation: 'modal' }} />
          <Stack.Screen name="(modals)/day-of-departure" options={{ presentation: 'modal' }} />
          <Stack.Screen name="(modals)/latest-delivery-time" options={{ presentation: 'modal' }} />
          <Stack.Screen name="(modals)/location-search" options={{ presentation: 'modal' }} />
          <Stack.Screen name="(modals)/review-trip" options={{ presentation: 'modal' }} />
          <Stack.Screen name="(modals)/post-success" options={{ presentation: 'modal' }} />
        </Stack>
      </TripCreationProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
