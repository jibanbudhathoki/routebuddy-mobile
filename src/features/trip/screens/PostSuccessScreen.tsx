import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

interface SummaryRowProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
}

function SummaryRow({ icon, label, value }: SummaryRowProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryRowLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={theme.colors.primary}
          style={styles.summaryIcon}
        />
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

import { useTripCreation } from "../context/TripCreationContext";

export function PostSuccessScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { tripData } = useTripCreation();

  // Helper to format Date string
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successSection}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={12}
              color="#0B2447"
              style={[styles.confetti, { top: -10, left: 20 }]}
            />
            <MaterialCommunityIcons
              name="star-four-points"
              size={16}
              color="#2A9D8F"
              style={[styles.confetti, { top: 10, left: -20 }]}
            />
            <MaterialCommunityIcons
              name="star-four-points"
              size={10}
              color="#2A9D8F"
              style={[styles.confetti, { top: 50, right: -15 }]}
            />
            <MaterialCommunityIcons
              name="star-four-points"
              size={14}
              color="#0B2447"
              style={[styles.confetti, { top: -5, right: 10 }]}
            />
            <MaterialCommunityIcons
              name="star-four-points"
              size={12}
              color="#0B2447"
              style={[styles.confetti, { bottom: -10, right: 25 }]}
            />

            <View style={styles.checkCircle}>
              <MaterialCommunityIcons
                name="check-bold"
                size={40}
                color="#2A9D8F"
              />
            </View>
          </View>

          <Text style={styles.title}>
            Your trip has been{"\n"}posted successfully!
          </Text>
          <Text style={styles.subtitle}>
            Shoppers in your area will see your trip{"\n"}and can start placing
            requests.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderLocation}>
              {tripData.originCityName || "Origin"}
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color={theme.colors.muted}
              style={styles.cardHeaderIcon}
            />
            <Text style={styles.cardHeaderLocation}>
              {tripData.destinationCityName || "Destination"}
            </Text>
          </View>

          <SummaryRow
            icon="calendar-blank-outline"
            label="Day of Departure"
            value={formatDate(tripData.departureAt)}
          />
          <View style={styles.divider} />

          <SummaryRow
            icon="clock-outline"
            label="Ordering Cut-off"
            value={formatDate(tripData.orderCutoffAt)}
          />
          <View style={styles.divider} />

          <SummaryRow
            icon="calendar-check-outline"
            label="Delivery Latest By"
            value={formatDate(tripData.deliveryLatestBy)}
          />
          <View style={styles.divider} />

          <SummaryRow
            icon="shopping-outline"
            label="Store(s)"
            value={
              tripData.stores?.length
                ? `${tripData.stores.length} store(s)`
                : "None"
            }
          />
          <View style={styles.divider} />

          <SummaryRow
            icon="account-group-outline"
            label="Maximum Number of Orders"
            value={tripData.capacity?.toString() || "1"}
          />
        </View>

        <View style={styles.infoBanner}>
          <MaterialCommunityIcons
            name="information-outline"
            size={24}
            color={theme.colors.primary}
            style={styles.infoIcon}
          />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>What's next?</Text>
            <Text style={styles.infoText}>
              Once shoppers place requests, you'll be notified and can review
              them in My Trips.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="View My Trips"
          onPress={() => {
            // Navigate to My Trips tab
            router.push("My Trips" as never);
          }}
        />
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => {
            // Reset to HomeMain
            router.push("HomeMain" as never);
          }}
        >
          <Text style={styles.outlineButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  successSection: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
    position: "relative",
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E6F5F3", // Light green tint
    borderWidth: 2,
    borderColor: "#2A9D8F",
    justifyContent: "center",
    alignItems: "center",
  },
  confetti: {
    position: "absolute",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: "center",
    lineHeight: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  cardHeaderLocation: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  cardHeaderIcon: {
    marginHorizontal: theme.spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  summaryRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: theme.spacing.md,
  },
  summaryIcon: {
    marginRight: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xl,
  },
  infoIcon: {
    marginRight: theme.spacing.sm,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.primary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  outlineButton: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 12,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
}));
