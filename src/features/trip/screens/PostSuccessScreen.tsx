import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { PostedTripSummary } from "../components/PostedTripSummary";

export function PostSuccessScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const tripData = useLocalSearchParams<{
    originCityName?: string;
    destinationCityName?: string;
    departureAt?: string;
    orderCutoffAt?: string;
    deliveryLatestBy?: string;
    storesCount?: string;
    capacity?: string;
  }>();

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PostedTripSummary trip={tripData} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="View My Trips"
          onPress={() => router.replace("/(tabs)/trips")}
        />
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => router.replace("/(tabs)/index")}
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
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  outlineButton: {
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
}));
