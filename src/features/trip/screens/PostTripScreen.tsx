import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

import { ListItem } from "../../../shared/components/ListItem";

import { useTripCreation } from "../context/TripCreationContext";

import { validateTripData } from "../validations/trip";

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

  const handleContinue = () => {
    const { isValid, error } = validateTripData(tripData);

    if (!isValid) {
      return alert(error);
    }

    router.push("/(modals)/review-trip");
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
          rightText={formatDate(tripData.orderCutoffAt) || "Select date"}
          rightIcon="calendar-blank-outline"
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
        <PrimaryButton title="Continue" onPress={handleContinue} />
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
