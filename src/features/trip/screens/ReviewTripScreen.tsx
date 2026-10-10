import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useToast } from "../../../shared/components/ToastProvider";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { TripReviewSummary } from "../components/TripReviewSummary";
import { useTripCreation } from "../context/TripCreationContext";
import { useCreateTrip } from "../hooks/useCreateTrip";
import { validateTripData } from "../validations/trip";

export function ReviewTripScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const { tripData, resetTripData } = useTripCreation();
  const { createTrip, isLoading } = useCreateTrip();

  const handlePostTrip = async () => {
    const validation = validateTripData(tripData);
    if (!validation.isValid) {
      showToast(validation.error);
      return;
    }

    const payload = validation.data;
    const result = await createTrip(payload);
    if (result.success) {
      resetTripData();
      router.replace({
        pathname: "/(modals)/trip/post-success",
        params: {
          originCityName: payload.originCityName || "Origin",
          destinationCityName: payload.destinationCityName || "Destination",
          departureAt: payload.departureAt,
          orderCutoffAt: payload.orderCutoffAt,
          deliveryLatestBy: payload.deliveryLatestBy,
          storesCount: String(payload.stores.length),
          capacity: String(payload.capacity),
        },
      } as never);
    } else {
      showToast(result.error ?? "Failed to post trip. Please try again.");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: getTopSafeAreaInset(insets.top),
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Trip</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            resetTripData();
            router.replace("/(tabs)/index");
          }}
        >
          <MaterialCommunityIcons
            name="close"
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            Review your trip details{"\n"}before posting.
          </Text>
          <Text style={styles.subtitle}>
            Please review all information below.{"\n"}You can go back to edit any
            details.
          </Text>
        </View>
        <TripReviewSummary trip={tripData} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={isLoading ? "Posting..." : "Post Trip"}
          onPress={handlePostTrip}
          disabled={isLoading}
        />
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
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
    color: theme.colors.text,
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
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
    lineHeight: 24,
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
    fontWeight: "bold",
    color: theme.colors.text,
  },
}));
