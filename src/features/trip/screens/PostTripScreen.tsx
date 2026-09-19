import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

interface ListItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  rightText?: string;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
  isCounter?: boolean;
  counterValue?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

function ListItem({
  icon,
  title,
  subtitle,
  rightText,
  rightIcon = "chevron-right",
  onPress,
  isCounter,
  counterValue,
  onIncrement,
  onDecrement,
}: ListItemProps) {
  const { theme } = useUnistyles();

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.listItemLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={28}
          color={theme.colors.primary}
        />
        <View style={styles.listItemTextContainer}>
          <Text style={styles.listItemTitle}>{title}</Text>
          <Text style={styles.listItemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {isCounter ? (
        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.counterButton} onPress={onDecrement}>
            <MaterialCommunityIcons
              name="minus"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.counterText}>{counterValue}</Text>
          <TouchableOpacity style={styles.counterButton} onPress={onIncrement}>
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listItemRight}>
          {rightText && (
            <Text style={styles.listItemRightText}>{rightText}</Text>
          )}
          <MaterialCommunityIcons
            name={rightIcon}
            size={24}
            color={theme.colors.primary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

import { useTripCreation } from "../context/TripCreationContext";

export function PostTripScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { tripData, updateTripData } = useTripCreation();

  const handleIncrement = () => {
    updateTripData({ capacity: (tripData.capacity || 0) + 1 });
  };

  const handleDecrement = () => {
    if ((tripData.capacity || 0) > 1) {
      updateTripData({ capacity: (tripData.capacity || 0) - 1 });
    }
  };

  // Helper to format Date string or return placeholder
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Trip</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="close"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroIconCircle}>
            <MaterialCommunityIcons
              name="car-estate"
              size={48}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.heroTitle}>
            Let others know{"\n"}you're making a trip.
          </Text>
          <Text style={styles.heroSubtitle}>
            Fill in a few details to get started.
          </Text>
        </View>

        <ListItem
          icon="shopping-outline"
          title="Store(s)"
          subtitle="Select the store(s) you plan to visit"
          rightText={
            tripData.stores && tripData.stores.length > 0
              ? `${tripData.stores.length} Selected`
              : undefined
          }
          onPress={() => router.push("/(modals)/select-store")}
        />

        <ListItem
          icon="clipboard-text-outline"
          title="Ordering Cut-off"
          subtitle="The last time requests can be placed"
          rightText={formatDate(tripData.orderCutoffAt)}
          onPress={() => router.push("/(modals)/order-cutoff")}
        />

        <ListItem
          icon="calendar-month-outline"
          title="Day of Departure"
          subtitle="When you'll be leaving"
          rightText={formatDate(tripData.departureAt) || "Select date"}
          rightIcon="calendar-blank-outline"
          onPress={() => router.push("/(modals)/day-of-departure")}
        />

        <ListItem
          icon="calendar-check-outline"
          title="Delivery Latest By"
          subtitle="The latest you can deliver"
          rightText={formatDate(tripData.deliveryLatestBy) || "Select date"}
          rightIcon="calendar-blank-outline"
          onPress={() => router.push("/(modals)/latest-delivery-time")}
        />

        <ListItem
          icon="map-marker-outline"
          title="From"
          subtitle="Starting city"
          rightText={tripData.originCityName || undefined}
          onPress={() =>
            router.push({
              pathname: "/(modals)/location-search",
              params: { type: "From" },
            })
          }
        />

        <ListItem
          icon="map-marker-outline"
          title="To"
          subtitle="Destination city"
          rightText={tripData.destinationCityName || undefined}
          onPress={() =>
            router.push({
              pathname: "/(modals)/location-search",
              params: { type: "To" },
            })
          }
        />

        <ListItem
          icon="account-group-outline"
          title="Number of Orders Allowed"
          subtitle="Maximum requests you can take"
          isCounter={true}
          counterValue={tripData.capacity || 0}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />

        <View style={styles.infoBanner}>
          <MaterialCommunityIcons
            name="information-outline"
            size={24}
            color={theme.colors.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            You can add more details, pricing and availability after you post
            your trip.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue"
          onPress={() => router.push("/(modals)/review-trip")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  heroSection: {
    alignItems: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  listItemTextContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  listItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemRightText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
  },
  counterButton: {
    padding: theme.spacing.xs,
  },
  counterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginHorizontal: theme.spacing.md,
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  infoIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.primary,
    lineHeight: 20,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
