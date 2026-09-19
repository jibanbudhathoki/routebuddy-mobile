import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

interface SummaryRowProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  sublabel?: string;
}

function SummaryRow({ icon, label, value, sublabel }: SummaryRowProps) {
  const { theme } = useUnistyles();
  
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryRowLeft}>
        <MaterialCommunityIcons name={icon} size={20} color={theme.colors.primary} style={styles.summaryIcon} />
        <View>
          <Text style={styles.summaryLabel}>{label}</Text>
          {sublabel && <Text style={styles.summarySublabel}>{sublabel}</Text>}
        </View>
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

import { useTripCreation } from "../context/TripCreationContext";
import { useCreateTrip } from "../hooks/useCreateTrip";
import { CreateTripRequest } from "../types/trip";

export function ReviewTripScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme } = useUnistyles();
  const { tripData } = useTripCreation();
  const { createTrip, isLoading, error } = useCreateTrip();

  const handlePostTrip = async () => {
    // Validate minimal fields before submitting
    if (!tripData.originCityUid || !tripData.destinationCityUid || !tripData.stores?.length) {
      alert("Please fill out required fields (Origin, Destination, Stores) before posting.");
      return;
    }

    const payload: CreateTripRequest = {
      originCityUid: tripData.originCityUid,
      destinationCityUid: tripData.destinationCityUid,
      stores: tripData.stores,
      departureAt: tripData.departureAt || new Date().toISOString(),
      orderCutoffAt: tripData.orderCutoffAt || new Date().toISOString(),
      deliveryLatestBy: tripData.deliveryLatestBy || new Date().toISOString(),
      capacity: tripData.capacity || 5,
      notes: tripData.notes || "",
    };

    const result = await createTrip(payload);
    if (result.success) {
      navigation.navigate("PostSuccess" as never);
    } else {
      alert(result.error);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Trip</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("HomeMain" as never)}>
          <MaterialCommunityIcons name="close" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Review your trip details{"\n"}before posting.</Text>
          <Text style={styles.subtitle}>
            Please review all information below.{"\n"}You can go back to edit any details.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Trip Summary</Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderLocation}>{tripData.originCityUid || "Not set"}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color={theme.colors.muted} style={styles.cardHeaderIcon} />
            <Text style={styles.cardHeaderLocation}>{tripData.destinationCityUid || "Not set"}</Text>
          </View>

          <SummaryRow 
            icon="calendar-blank-outline" 
            label="Day of Departure" 
            value={formatDate(tripData.departureAt)} 
          />
          <SummaryRow 
            icon="clock-outline" 
            label="Ordering Cut-off" 
            value={formatDate(tripData.orderCutoffAt)} 
          />
          <SummaryRow 
            icon="calendar-check-outline" 
            label="Delivery Latest By" 
            value={formatDate(tripData.deliveryLatestBy)} 
          />
          
          <View style={styles.divider} />
          
          <SummaryRow 
            icon="shopping-outline" 
            label="Store(s)" 
            value={tripData.stores?.length ? `${tripData.stores.length} store(s) selected` : "None"} 
          />
          <SummaryRow 
            icon="map-marker-outline" 
            label="From" 
            value={tripData.originCityUid || "Not set"} 
          />
          <SummaryRow 
            icon="map-marker-outline" 
            label="To" 
            value={tripData.destinationCityUid || "Not set"} 
          />
          <SummaryRow 
            icon="account-group-outline" 
            label="Maximum Number of Orders" 
            sublabel="Maximum requests you can take"
            value={tripData.capacity?.toString() || "5"} 
          />
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryRowLeft}>
              <MaterialCommunityIcons name="file-document-outline" size={20} color={theme.colors.primary} style={styles.summaryIcon} />
              <Text style={styles.summaryLabel}>Notes to Shoppers (Optional)</Text>
            </View>
            <Text style={[styles.summaryValue, styles.summaryValueMultiline]}>
              {tripData.notes || "None"}
            </Text>
          </View>
        </View>

        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="information-outline" size={24} color={theme.colors.primary} style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Looks good?</Text>
            <Text style={styles.infoText}>
              Once posted, shoppers in your area will see your trip and can place requests.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          title={isLoading ? "Posting..." : "Post Trip"} 
          onPress={handlePostTrip} 
          disabled={isLoading}
        />
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()} disabled={isLoading}>
          <Text style={styles.secondaryButtonText}>Go Back and Edit</Text>
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
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  titleSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
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
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  summaryRowLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    marginRight: theme.spacing.md,
  },
  summaryIcon: {
    marginTop: 2,
    marginRight: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.muted,
    marginTop: 3,
  },
  summarySublabel: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 2,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "500",
    textAlign: "right",
    marginTop: 3,
  },
  summaryValueMultiline: {
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
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
  secondaryButton: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
}));
