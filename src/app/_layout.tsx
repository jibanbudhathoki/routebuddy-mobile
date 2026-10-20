import "../theme/unistyles";
import { Stack, usePathname, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { getApp } from "@react-native-firebase/app";
import { getMessaging, onTokenRefresh } from "@react-native-firebase/messaging";

import { TripCreationProvider } from "../features/trip/context/TripCreationContext";
import { RequestCreationProvider } from "../features/request/context/RequestCreationContext";
import { getAuthSession } from "../features/auth/services/authStorage";
import {
  registerDeviceToken,
  withDeviceTokenSessionLock,
} from "../features/auth/services/deviceToken";
import { ToastProvider, useToast } from "../shared/components/ToastProvider";
import { deviceTokenStorage } from "../shared/storage/deviceTokenStorage";

import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const queryClient = new QueryClient();

function DeviceTokenRefreshListener() {
  const { showToast } = useToast();

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    const messaging = getMessaging(getApp());
    const reportRegistrationError = (error: unknown) => {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to update notification registration.",
        { title: "Notification registration failed", variant: "error" },
      );
    };

    const unsubscribe = onTokenRefresh(messaging, (token) => {
      void withDeviceTokenSessionLock(async () => {
        const session = await getAuthSession();
        if (session) {
          await registerDeviceToken(token, session.user.id);
        }
      }).catch(reportRegistrationError);
    });

    void withDeviceTokenSessionLock(async () => {
      const [session, token] = await Promise.all([
        getAuthSession(),
        deviceTokenStorage.get(),
      ]);
      if (session && token) {
        await registerDeviceToken(token, session.user.id);
      }
    }).catch(reportRegistrationError);

    return unsubscribe;
  }, [showToast]);

  return null;
}

export default function RootLayout() {
  const pathname = usePathname();
  const stripePublishableKey =
    process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_TYooMQauvdEDq54NiTphI7jx";
  const isKeyboardControllerScreen = pathname.startsWith("/chat/");

  return (
    <StripeProvider publishableKey={stripePublishableKey}>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <SafeAreaProvider>
              <RequestCreationProvider>
                <TripCreationProvider>
                  <ToastProvider>
                    <DeviceTokenRefreshListener />
                    <KeyboardAvoidingView
                      style={{ flex: 1 }}
                      behavior={
                        Platform.OS === "ios" && !isKeyboardControllerScreen
                          ? "padding"
                          : undefined
                      }
                    >
                      <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                      <Stack.Screen name="(modals)/community" options={{ presentation: 'fullScreenModal' }} />
                      <Stack.Screen name="(modals)/saved-addresses" options={{ presentation: 'modal' }} />
                      <Stack.Screen name="(modals)/notification-preferences" options={{ presentation: 'modal' }} />
                      <Stack.Screen name="(modals)/profile-address" options={{ presentation: 'modal' }} />
                      <Stack.Screen name="request-details" options={{ headerShown: false }} />
                      <Stack.Screen name="edit-trip" options={{ headerShown: false }} />

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
                      <Stack.Screen name="(modals)/request/build-trip-order" options={{ presentation: 'fullScreenModal' }} />
                      <Stack.Screen name="(modals)/request/order-summary" options={{ presentation: 'fullScreenModal' }} />
                      <Stack.Screen name="(modals)/request/checkout" options={{ presentation: 'fullScreenModal' }} />
                      <Stack.Screen name="(modals)/request/payment-success" options={{ presentation: 'fullScreenModal' }} />

                      {/* Profile Security Screens */}
                      <Stack.Screen
                        name="(modals)/change-password"
                        options={{ presentation: "card", headerShown: false }}
                      />
                      <Stack.Screen
                        name="(modals)/change-email"
                        options={{ presentation: "card", headerShown: false }}
                      />
                      <Stack.Screen
                        name="(modals)/delete-account"
                        options={{ presentation: "card", headerShown: false }}
                      />

                      {/* Wallet Flow */}
                      <Stack.Screen
                        name="wallet/index"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="wallet/withdraw"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="wallet/withdraw-success"
                        options={{ headerShown: false }}
                      />
                      </Stack>
                    </KeyboardAvoidingView>
                  </ToastProvider>
                </TripCreationProvider>
              </RequestCreationProvider>
              <StatusBar style="auto" />
            </SafeAreaProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </StripeProvider>
  );
}
