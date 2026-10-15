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
import { clearAuthSession } from "../../auth/services/authStorage";
import { useProfileSummary } from "../hooks/useProfileSummary";
import { useToast } from "../../../shared/components/ToastProvider";

import { AppearanceModal } from "../components/AppearanceModal";

export function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { summary, isLoading, error, refetch } = useProfileSummary();
  const { theme } = useUnistyles();
  const [isAppearanceModalVisible, setAppearanceModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await clearAuthSession();
      queryClient.clear();
      router.replace("/(auth)/login");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to log out. Please try again.",
        { title: "Logout failed", variant: "error" },
      );
    }
  };

  const handleAppearancePress = () => {
    setAppearanceModalVisible(true);
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
          />
        </ProfileSection>

        <ProfileSection title="WALLET">
          <ProfileMenuItem
            isFirst
            iconName="wallet-outline"
            title="Wallet"
            subtitle="Balance & withdrawals"
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
            iconName="bell-outline"
            title="Notifications"
            subtitle="View recent notifications"
            onPress={() => router.push("/notifications")}
          />
          <ProfileMenuItem
            iconName="help-circle-outline"
            title="Help & Support"
            subtitle="FAQs, contact support"
          />
          <ProfileMenuItem
            iconName="logout"
            title="Log Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
          />
        </ProfileSection>
        <ProfileSection title="Security">
          <ProfileMenuItem
            isFirst
            iconName="lock-outline"
            title="Change Password"
            subtitle="Change your password"
          />
          <ProfileMenuItem
            iconName="email-outline"
            title="Change Email"
            subtitle="Change your email"
          />
          <ProfileMenuItem
            iconName="delete-outline"
            title="Delete Account"
            subtitle="Delete your account"
            // onPress={handleLogout}
          />
        </ProfileSection>
      </ScrollView>

      <AppearanceModal 
        visible={isAppearanceModalVisible}
        onClose={() => setAppearanceModalVisible(false)}
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
    fontSize: 26,
    fontWeight: "700",
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  retryText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 40,
  },
}));
