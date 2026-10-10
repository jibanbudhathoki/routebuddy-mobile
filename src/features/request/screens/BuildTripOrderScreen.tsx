import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { BuildTripOrderAddressPicker } from "../components/BuildTripOrderAddressPicker";
import { BuildTripOrderAddressSection } from "../components/BuildTripOrderAddressSection";
import { BuildTripOrderEstimateCard } from "../components/BuildTripOrderEstimateCard";
import { BuildTripOrderInstructions } from "../components/BuildTripOrderInstructions";
import { BuildTripOrderLoadState } from "../components/BuildTripOrderLoadState";
import { AddRequestItemModal } from "../components/AddRequestItemModal";
import { RequestItemsEditor } from "../components/RequestItemsEditor";
import { RequestTripPreviewCard } from "../components/RequestTripPreviewCard";
import { useRequestCreation } from "../context/RequestCreationContext";
import { useCreateTripOrder } from "../hooks/useCreateTripOrder";
import { createTripOrderSchema } from "../validations/createTripOrder";
import type { RequestItem } from "../types/request";
import { useAddresses } from "../../../shared/address/hooks/useAddresses";
import type { Address } from "../../../shared/address/types/address";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { calculateEstimate } from "../../../shared/utils/pricing";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { useTripDetails } from "../../trip/hooks/useTripDetails";

export function BuildTripOrderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tripUid: routeTripUid } = useLocalSearchParams<{ tripUid?: string }>();
  const tripUid = typeof routeTripUid === "string" ? routeTripUid : "";
  const { theme } = useUnistyles();
  const { data: trip, error: tripError, isLoading, refetch } =
    useTripDetails(tripUid);
  const {
    addresses,
    isLoading: addressesLoading,
    error: addressError,
    refetch: refetchAddresses,
  } = useAddresses();
  const { updateRequestData, setTripOrderConversation } = useRequestCreation();
  const createTripOrder = useCreateTripOrder();

  const [items, setItems] = useState<RequestItem[]>([]);
  const [notes, setNotes] = useState("");
  const [selectedAddressUid, setSelectedAddressUid] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isChoosingAddress, setIsChoosingAddress] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const selectedAddress = useMemo(
    () => addresses.find((address) => address.uid === selectedAddressUid),
    [addresses, selectedAddressUid],
  );
  const estimate = calculateEstimate(items);

  useEffect(() => {
    if (!selectedAddressUid && addresses.length > 0) {
      setSelectedAddressUid(
        addresses.find((address) => address.isDefault)?.uid ?? addresses[0].uid,
      );
    }
  }, [addresses, selectedAddressUid]);

  const handleAddItem = (newItem: Omit<RequestItem, "id">) => {
    setItems((currentItems) => [
      ...currentItems,
      { ...newItem, id: `${Date.now()}-${Math.random()}` },
    ]);
    setIsAddingItem(false);
  };

  const handleContinue = async () => {
    if (!trip || !selectedAddress) {
      setSubmitError("Choose a delivery address before continuing.");
      return;
    }

    const payload = {
      tripUid: trip.uid,
      stores: trip.stores.map((store) => store.uid),
      items: items.map((item) => ({
        item: item.name,
        description: item.description,
        estimatePrice: Number(item.estimatedPrice),
      })),
      deliveryAddress: selectedAddress.uid,
      notes: notes.trim(),
    };
    const validation = createTripOrderSchema.safeParse(payload);
    if (!validation.success) {
      setSubmitError(
        validation.error.issues[0]?.message ?? "Check your order details.",
      );
      return;
    }

    setSubmitError("");
    try {
      const response = await createTripOrder.mutateAsync(validation.data);
      const checkoutId = response.data.uid;
      if (response.data.status !== "pending" && response.data.status !== "open") {
        throw new Error(
          `The order was created with an unsupported status: ${response.data.status}.`,
        );
      }

      updateRequestData({
        stores: validation.data.stores,
        deliveryAddress: selectedAddress.uid,
        deliveryCityUid: selectedAddress.city.uid,
        itemsInstructions: notes.trim(),
        dayNeeded: trip.departureAt,
        latestDeliveryTime: trip.deliveryLatestBy,
        items,
      });
      setTripOrderConversation({
        orderUid: response.data.uid,
        tripUid: response.data.trip?.uid ?? trip.uid,
        driverUid: response.data.driver?.uid ?? trip.driver.uid,
        items: response.data.items.map((item, index) => ({
          id: `${response.data.uid}-${index}`,
          name: item.item,
          description: item.description,
          estimatedPrice: item.estimatePrice,
        })),
        total: response.data.total,
      });

      if (response.data.status === "pending") {
        router.push({
          pathname: "/(modals)/request/checkout",
          params: { postId: checkoutId },
        });
      } else if (response.data.status === "open") {
        router.push({
          pathname: "/(modals)/request/payment-success",
          params: { orderUid: checkoutId },
        });
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to create your order.",
      );
    }
  };

  const tripStoreName = trip?.stores.map((store) => store.name).join(", ") ?? "";
  const storeNameParts = tripStoreName.split(/\s+/);
  const routeText = trip
    ? `${trip.originAddress.country.name}, ${trip.originAddress.province.name}, ${trip.originAddress.city.name} → ${trip.destinationAddress.country.name}, ${trip.destinationAddress.province.name}, ${trip.destinationAddress.city.name}`
    : "";

  const openAddAddress = () => {
    setIsChoosingAddress(false);
    router.push("/(modals)/request/add-address");
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          paddingTop: getTopSafeAreaInset(insets.top),
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={30}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Build Shopping List</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {isLoading || tripError || !trip ? (
          <BuildTripOrderLoadState
            isLoading={isLoading}
            error={tripError?.message}
            hasTripUid={!!tripUid}
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <RequestTripPreviewCard
              storeName={tripStoreName || "Trip"}
              storeLogoText={storeNameParts[0]?.toUpperCase() || "TRIP"}
              storeLogoSubText={storeNameParts.slice(1).join(" ").toUpperCase()}
              routeText={routeText}
              neededBy={trip.departureAt}
              latestDeliveryTime={trip.deliveryLatestBy}
            />
            <RequestItemsEditor
              items={items}
              onRemoveItem={(id) =>
                setItems((currentItems) =>
                  currentItems.filter((item) => item.id !== id),
                )
              }
              onAddItem={() => setIsAddingItem(true)}
            />
            <BuildTripOrderAddressSection
              isLoading={addressesLoading}
              error={addressError ?? ""}
              selectedAddress={selectedAddress}
              onRetry={() => refetchAddresses()}
              onChooseAddress={() => setIsChoosingAddress(true)}
              onAddAddress={openAddAddress}
            />
            <BuildTripOrderInstructions value={notes} onChange={setNotes} />
            <BuildTripOrderEstimateCard estimate={estimate} />
          </>
        )}
      </ScrollView>

      {trip && !isLoading && !tripError ? (
        <View style={styles.footer}>
          {submitError ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {submitError}
            </Text>
          ) : null}
          <PrimaryButton
            title="Continue to Payment"
            loading={createTripOrder.isPending}
            disabled={
              createTripOrder.isPending ||
              items.length === 0 ||
              !selectedAddress ||
              addressesLoading
            }
            onPress={handleContinue}
          />
        </View>
      ) : null}

      <AddRequestItemModal
        visible={isAddingItem}
        onClose={() => setIsAddingItem(false)}
        onAddItem={handleAddItem}
      />
      <BuildTripOrderAddressPicker
        addresses={addresses}
        selectedUid={selectedAddressUid}
        visible={isChoosingAddress}
        onClose={() => setIsChoosingAddress(false)}
        onAddAddress={openAddAddress}
        onSelect={(address: Address) => {
          setSelectedAddressUid(address.uid);
          setIsChoosingAddress(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 36,
    padding: theme.spacing.xs,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  footer: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    marginBottom: theme.spacing.sm,
  },
}));
