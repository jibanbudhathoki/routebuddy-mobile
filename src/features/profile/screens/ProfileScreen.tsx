import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ActionSheetIOS,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileSection } from "../components/ProfileSection";
import { ProfileMenuItem } from "../components/ProfileMenuItem";
import { clearAuthSession } from "../../auth/services/authStorage";
import { useProfile } from "../hooks/useProfile";
import { UnistylesRuntime } from "react-native-unistyles";

import { AppearanceModal } from "../components/AppearanceModal";

export function ProfileScreen() {
  const router = useRouter();
  const { profile, isLoading } = useProfile();
  const { theme } = useUnistyles();
  const [isAppearanceModalVisible, setAppearanceModalVisible] = useState(false);

  const handleLogout = async () => {
    await clearAuthSession();
    alert("Logged out! Please restart the app.");
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

  const nameParts = profile?.displayName
    ? profile.displayName.split(" ")
    : ["User", "Name"];
  const firstName = nameParts[0] || "User";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "N";

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="cog-outline"
            size={26}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          photoUrl={profile?.photoUrl}
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
            subtitle="Edit preferences"
          />
          <ProfileMenuItem
            iconName="map-marker-outline"
            title="Saved Addresses"
            subtitle="View your saved addresses"
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
            subtitle="Manage your preferences"
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
  scrollContent: {
    paddingBottom: 40,
  },
}));
