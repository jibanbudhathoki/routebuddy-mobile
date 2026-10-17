import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { ProfileNotificationPreferences } from "../types/profile";
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "../hooks/useNotificationPreferences";

const notificationOptions: {
  key: keyof ProfileNotificationPreferences;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  section: "push" | "email" | "sound";
}[] = [
  {
    key: "pushNewTripRequests",
    title: "New trip requests",
    description: "Get notified when someone requests to join your trip.",
    icon: "briefcase-plus-outline",
    section: "push",
  },
  {
    key: "pushNewMessages",
    title: "New messages",
    description: "Get notified when you receive a chat message.",
    icon: "message-outline",
    section: "push",
  },
  {
    key: "pushTripUpdates",
    title: "Trip updates",
    description: "Updates about trip and delivery status changes.",
    icon: "map-marker-path",
    section: "push",
  },
  {
    key: "pushPaymentsEscrow",
    title: "Payments & escrow",
    description: "Payment activity, escrow changes, and payouts.",
    icon: "credit-card-outline",
    section: "push",
  },
  {
    key: "pushCommunityAnnouncements",
    title: "Community announcements",
    description: "News and announcements from your communities.",
    icon: "account-group-outline",
    section: "push",
  },
  {
    key: "emailNotifications",
    title: "Email notifications",
    description: "Receive important updates in your email inbox.",
    icon: "email-outline",
    section: "email",
  },
  {
    key: "notificationSound",
    title: "Notification sounds",
    description: "Play a sound when a notification arrives.",
    icon: "volume-high",
    section: "sound",
  },
];

const sections = [
  { key: "push", title: "PUSH NOTIFICATIONS" },
  { key: "email", title: "EMAIL" },
  { key: "sound", title: "SOUND" },
] as const;

export function NotificationPreferencesScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const preferencesQuery = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();
  const preferences = preferencesQuery.data;

  const togglePreference = (
    key: keyof ProfileNotificationPreferences,
    value: boolean,
  ) => {
    if (!preferences) return;
    updatePreferences.mutate({ ...preferences, [key]: value });
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Choose which RouteBuddy updates you’d like to receive.
        </Text>
        <View style={styles.previewNotice}>
          {preferencesQuery.isLoading || updatePreferences.isPending ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.text}
              accessibilityLabel={
                preferencesQuery.isLoading
                  ? "Loading notification preferences"
                  : "Saving notification preferences"
              }
            />
          ) : (
            <MaterialCommunityIcons
              name={
                preferencesQuery.isError || updatePreferences.isError
                  ? "alert-circle-outline"
                  : "information-outline"
              }
              size={18}
              color={
                preferencesQuery.isError || updatePreferences.isError
                  ? theme.colors.error
                  : theme.colors.text
              }
            />
          )}
          <Text style={styles.previewText}>
            {preferencesQuery.isLoading
              ? "Loading your saved preferences..."
              : preferencesQuery.isError
                ? preferencesQuery.error instanceof Error
                  ? preferencesQuery.error.message
                  : "Unable to load notification preferences."
                : updatePreferences.isError
                  ? updatePreferences.error instanceof Error
                    ? updatePreferences.error.message
                    : "Unable to save your notification preferences."
                  : updatePreferences.isPending
                    ? "Saving your preferences..."
                    : "Changes are saved to your account."}
          </Text>
          {preferencesQuery.isError ? (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => void preferencesQuery.refetch()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {preferences
          ? sections.map((section) => (
              <View key={section.key} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.card}>
                  {notificationOptions
                    .filter((option) => option.section === section.key)
                    .map((option, index) => (
                      <View
                        key={option.key}
                        style={[
                          styles.optionRow,
                          index > 0 && styles.optionDivider,
                        ]}
                      >
                        <View style={styles.optionIcon}>
                          <MaterialCommunityIcons
                            name={option.icon}
                            size={21}
                            color={theme.colors.text}
                          />
                        </View>
                        <View style={styles.optionCopy}>
                          <Text style={styles.optionTitle}>
                            {option.title}
                          </Text>
                          <Text style={styles.optionDescription}>
                            {option.description}
                          </Text>
                        </View>
                        <Switch
                          accessibilityLabel={option.title}
                          value={preferences[option.key]}
                          onValueChange={(value) =>
                            togglePreference(option.key, value)
                          }
                          disabled={updatePreferences.isPending}
                          trackColor={{
                            false: theme.colors.border,
                            true: theme.colors.primary,
                          }}
                          thumbColor={
                            preferences[option.key]
                              ? theme.colors.onPrimary
                              : theme.colors.surface
                          }
                        />
                      </View>
                    ))}
                </View>
              </View>
            ))
          : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 40,
  },
  headerTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  content: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  intro: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  previewNotice: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  previewText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  retryText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  section: {
    gap: theme.spacing.xs,
  },
  sectionTitle: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
  },
  optionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 76,
    paddingVertical: theme.spacing.sm,
  },
  optionDivider: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  },
  optionIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  optionCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  optionTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  optionDescription: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 16,
  },
}));
