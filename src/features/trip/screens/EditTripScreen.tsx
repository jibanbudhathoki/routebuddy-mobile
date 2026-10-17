import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { AppScreen } from "../../../shared/components/AppScreen";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useToast } from "../../../shared/components/ToastProvider";
import { useCities } from "../../../shared/city/hooks/useCities";
import { useStores } from "../../../shared/store/hooks/useStores";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { EditTripFields } from "../components/EditTripFields";
import { useTripDetails } from "../hooks/useTripDetails";
import { useUpdateTrip } from "../hooks/useUpdateTrip";
import type { EditTripFormValues } from "../types/editTripForm";
import { updateTripSchema } from "../validations/updateTrip";

const emptyForm: EditTripFormValues = {
  originCityUid: "",
  destinationCityUid: "",
  stores: [],
  departureAt: new Date().toISOString(),
  orderCutoffAt: new Date().toISOString(),
  deliveryLatestBy: new Date().toISOString(),
  capacity: 1,
  price: "",
  notes: "",
};

export function EditTripScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { uid } = useLocalSearchParams<{ uid?: string }>();
  const tripUid = typeof uid === "string" ? uid : "";
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const { data: trip, isLoading, error, refetch } = useTripDetails(tripUid);
  const updateTrip = useUpdateTrip();
  const { cities, isLoading: citiesLoading } = useCities({ limit: 100 });
  const { stores, isLoading: storesLoading } = useStores({ limit: 100 });
  const [form, setForm] = useState(emptyForm);
  const [initializedUid, setInitializedUid] = useState("");

  useEffect(() => {
    if (!trip || initializedUid === trip.uid) return;
    setForm({
      originCityUid: trip.originAddress.city.uid,
      destinationCityUid: trip.destinationAddress.city.uid,
      stores: trip.stores.map((store) => store.uid),
      departureAt: trip.departureAt,
      orderCutoffAt: trip.orderCutoffAt,
      deliveryLatestBy: trip.deliveryLatestBy,
      capacity: trip.capacity,
      price: trip.price ?? "",
      notes: trip.notes ?? "",
    });
    setInitializedUid(trip.uid);
  }, [initializedUid, trip]);

  async function handleSave() {
    const validation = updateTripSchema.safeParse({
      ...form,
      price: form.price.trim() ? Number(form.price) : undefined,
    });

    if (!validation.success) {
      showToast(
        validation.error.issues[0]?.message ?? "Check your trip details.",
      );
      return;
    }

    try {
      const response = await updateTrip.mutateAsync({
        uid: tripUid,
        payload: validation.data,
      });
      showToast(response.message || "Trip updated successfully.", {
        variant: "success",
      });
      router.back();
    } catch (failure) {
      showToast(
        failure instanceof Error
          ? failure.message
          : "Unable to update this trip.",
      );
    }
  }

  return (
    <AppScreen>
      <View
        style={[
          styles.screen,
          {
            paddingTop: getTopSafeAreaInset(insets.top),
            paddingBottom: Math.max(insets.bottom, theme.spacing.sm),
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              color={theme.colors.text}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Edit Trip</Text>
          <View style={styles.headerButton} />
        </View>

        {isLoading || !trip ? (
          <View style={styles.state}>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.text} />
            ) : (
              <>
                <Text style={styles.errorText}>
                  {error?.message ?? "Trip details are unavailable."}
                </Text>
                <Pressable onPress={() => refetch()}>
                  <Text style={styles.retry}>Try again</Text>
                </Pressable>
              </>
            )}
          </View>
        ) : (
          <>
            <EditTripFields
              trip={trip}
              form={form}
              cities={cities}
              stores={stores}
              storesLoading={storesLoading}
              onChange={(updates) =>
                setForm((current) => ({ ...current, ...updates }))
              }
            />
            <View style={styles.footer}>
              <PrimaryButton
                title={updateTrip.isPending ? "Saving..." : "Save Changes"}
                onPress={() => void handleSave()}
                disabled={updateTrip.isPending || citiesLoading || storesLoading}
              />
            </View>
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: {
    backgroundColor: theme.colors.surface,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  headerButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
    width: 36,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  state: {
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.sm,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    textAlign: "center",
  },
  retry: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
}));
