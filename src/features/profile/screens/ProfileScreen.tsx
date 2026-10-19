import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileSection } from "../components/ProfileSection";
import { ProfileMenuItem } from "../components/ProfileMenuItem";
import { authService } from "../../auth/services/auth.service";
import { clearAuthSession } from "../../auth/services/authStorage";
import {
  unregisterDeviceToken,
  withDeviceTokenSessionLock,
} from "../../auth/services/deviceToken";
import { deviceTokenStorage } from "../../../shared/storage/deviceTokenStorage";
import { getAuthSession } from "../../auth/services/authStorage";
import { useProfileSummary } from "../hooks/useProfileSummary";
import { useToast } from "../../../shared/components/ToastProvider";
import { AppearanceModal } from "../components/AppearanceModal";
import { LogoutConfirmationModal } from "../components/LogoutConfirmationModal";
import { AppReviewPrompt } from "../../appReview/components/AppReviewPrompt";
import { useSubmitAppReview } from "../../appReview/hooks/useSubmitAppReview";

export function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { summary, isLoading, error, refetch } = useProfileSummary();
  const { theme } = useUnistyles();
  const [isAppearanceModalVisible, setAppearanceModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAppReviewVisible, setAppReviewVisible] = useState(false);
  const submitAppReview = useSubmitAppReview();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    let tokenUnregisterError: unknown;

    await withDeviceTokenSessionLock(async () => {
      try {
        const session = await getAuthSession();
        const deviceToken = await deviceTokenStorage.get();
        if (session && deviceToken) {
          try {
            await unregisterDeviceToken(deviceToken, session.user.id);
          } catch (error) {
            tokenUnregisterError = error;
          }
        }

        try {
          await authService.logOut();
        } catch (error) {
          console.warn("Backend logout request failed:", error);
        }
      } catch (error) {
        console.warn("Pre-logout cleanup error:", error);
      } finally {
        await clearAuthSession();
      }

      setIsLoggingOut(false);
      setLogoutModalVisible(false);
      queryClient.clear();
      router.replace("/(auth)/login");

      if (tokenUnregisterError) {
        showToast(
          "You are logged out, but this device may still receive notifications for your account.",
          { title: "Notification token was not removed", variant: "error" },
        );
      }
    });
  };

  const handleAppearancePress = () => {
    setAppearanceModalVisible(true);
  };

  const handleSubmitAppReview = async (rating: number, comment?: string) => {
    try {
      await submitAppReview.mutateAsync({ rating, comment });
      setAppReviewVisible(false);
      showToast("Thank you for reviewing RouteBuddy.", {
        title: "Review submitted",
        variant: "success",
      });
    } catch (failure) {
      showToast(
        failure instanceof Error
          ? failure.message
          : "Unable to submit your review. Please try again.",
        { title: "Review not submitted", variant: "error" },
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.text} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !summary) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error ?? "Profile summary is unavailable."}
          </Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => void refetch()}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          displayName={summary.displayName}
          rating={summary.rating}
          photoUrl={summary.photoUrl}
        />

        <ProfileSection title="ACCOUNT">
          <ProfileMenuItem
            isFirst
            iconName="account-outline"
            title="Personal Information"
            subtitle="Name, email, phone"
            onPress={() => router.push("/(modals)/personal-information")}
          />
          <ProfileMenuItem
            iconName="account-group-outline"
            title="Community"
            subtitle="Browse and join communities"
            onPress={() => router.push("/(modals)/community")}
          />
          <ProfileMenuItem
            iconName="map-marker-outline"
            title="Saved Addresses"
            subtitle="View your saved addresses"
            onPress={() => router.push("/(modals)/saved-addresses")}
          />
          <ProfileMenuItem
            iconName="credit-card-outline"
            title="Payment Methods"
            subtitle="Cards & accounts"
            onPress={() => router.push("/(tabs)/payment-methods")}
          />
        </ProfileSection>

        <ProfileSection title="WALLET">
          <ProfileMenuItem
            isFirst
            iconName="wallet-outline"
            title="Wallet"
            subtitle="Balance & withdrawals"
            onPress={() => router.push("/wallet")}
          />
        </ProfileSection>

        <ProfileSection title="PREFERENCES">
          <ProfileMenuItem
            isFirst
            iconName="brightness-6"
            title="Appearance"
            subtitle="Light/dark mode"
            onPress={handleAppearancePress}
          />
          <ProfileMenuItem
            iconName="tune-variant"
            title="Notification Preferences"
            subtitle="Choose which alerts you receive"
            onPress={() => router.push("/(modals)/notification-preferences")}
          />
          <ProfileMenuItem
            iconName="star-outline"
            title="Review App"
            subtitle="Rate your experience"
            onPress={() => setAppReviewVisible(true)}
          />
          <ProfileMenuItem
            iconName="logout"
            title="Log Out"
            subtitle="Sign out of your account"
            onPress={() => setLogoutModalVisible(true)}
          />
        </ProfileSection>
        <ProfileSection title="Security">
          <ProfileMenuItem
            isFirst
            iconName="lock-outline"
            title="Change Password"
            subtitle="Change your password"
            onPress={() => router.push("/(modals)/change-password")}
          />
          <ProfileMenuItem
            iconName="email-outline"
            title="Change Email"
            subtitle="Change your email"
            onPress={() => router.push("/(modals)/change-email")}
          />
          <ProfileMenuItem
            iconName="delete-outline"
            title="Delete Account"
            subtitle="Permanently remove your account"
            onPress={() => router.push("/(modals)/delete-account")}
          />
        </ProfileSection>
      </ScrollView>

      <AppearanceModal
        visible={isAppearanceModalVisible}
        onClose={() => setAppearanceModalVisible(false)}
      />
      <LogoutConfirmationModal
        visible={isLogoutModalVisible}
        isLoggingOut={isLoggingOut}
        onCancel={() => setLogoutModalVisible(false)}
        onConfirm={handleLogout}
      />

      <AppReviewPrompt
        visible={isAppReviewVisible}
        isSubmitting={submitAppReview.isPending}
        onClose={() => setAppReviewVisible(false)}
        onSubmit={(rating, comment) =>
          void handleSubmitAppReview(rating, comment)
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  retryText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 40,
  },
}));
