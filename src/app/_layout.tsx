import '../theme/unistyles';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { TripCreationProvider } from '../features/trip/context/TripCreationContext';
import { RequestCreationProvider } from '../features/request/context/RequestCreationContext';
import { getAuthSession } from '../features/auth/services/authStorage';

import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  return (
    <StripeProvider publishableKey="pk_test_TYooMQauvdEDq54NiTphI7jx">
      <SafeAreaProvider>
        <RequestCreationProvider>
          <TripCreationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Post Trip Flow Modals */}

            <Stack.Screen name="(modals)/trip/select-store" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/trip/order-cutoff" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/trip/day-of-departure" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/trip/latest-delivery-time" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/trip/location-search" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/trip/review-trip" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/trip/post-success" options={{ presentation: 'modal' }} />

            {/* Post Request Flow Modals */}
            <Stack.Screen name="(modals)/request/select-store" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/request/delivery-address" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/request/add-address" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/request/select-day" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/request/latest-delivery-time" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(modals)/request/add-items" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="(modals)/request/build-shopping-list" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="(modals)/request/order-summary" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="(modals)/request/checkout" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="(modals)/request/payment-success" options={{ presentation: 'fullScreenModal' }} />
          </Stack>
        </TripCreationProvider>
      </RequestCreationProvider>
      <StatusBar style="auto" />
      </SafeAreaProvider>
    </StripeProvider>
  );
}
