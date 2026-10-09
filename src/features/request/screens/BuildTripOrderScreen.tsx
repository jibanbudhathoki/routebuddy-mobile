import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { useAddresses } from "../../../shared/address/hooks/useAddresses";
import type { Address } from "../../../shared/address/types/address";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { calculateEstimate } from "../../../shared/utils/pricing";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { useTripDetails } from "../../trip/hooks/useTripDetails";
import { useRequestCreation } from "../context/RequestCreationContext";
import { AddRequestItemModal } from "../components/AddRequestItemModal";
import { RequestItemsEditor } from "../components/RequestItemsEditor";
import { RequestTripPreviewCard } from "../components/RequestTripPreviewCard";
import { useCreateTripOrder } from "../hooks/useCreateTripOrder";
import { createTripOrderSchema } from "../validations/createTripOrder";
import type { RequestItem } from "../types/request";

export function BuildTripOrderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { tripUid: routeTripUid } = useLocalSearchParams<{ tripUid?: string }>();
  const tripUid = typeof routeTripUid === "string" ? routeTripUid : "";
  const { theme } = useUnistyles();
  const { data: trip, error: tripError, isLoading, refetch } = useTripDetails(tripUid);
  const {
    addresses,
    isLoading: addressesLoading,
    error: addressError,
    refetch: refetchAddresses,
  } = useAddresses();
  const { updateRequestData } = useRequestCreation();
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
      setSubmitError(validation.error.issues[0]?.message ?? "Check your order details.");
      return;
    }

    setSubmitError("");
    try {
      const response = await createTripOrder.mutateAsync(validation.data);
      const checkoutId = response.data.uid;

      updateRequestData({
        stores: validation.data.stores,
        deliveryAddress: selectedAddress.uid,
        deliveryCityUid: selectedAddress.city.uid,
        itemsInstructions: notes.trim(),
        dayNeeded: trip.departureAt,
        latestDeliveryTime: trip.deliveryLatestBy,
        items,
      });

      if (response.data.status === "pending") {
        router.push({
          pathname: "/(modals)/request/checkout",
          params: { postId: checkoutId },
        });
      } else if (response.data.status === "open") {
        router.push("/(modals)/request/payment-success");
      } else {
        throw new Error(
          `The order was created with an unsupported status: ${response.data.status}.`,
        );
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
        {isLoading ? (
          <ActivityIndicator
            color={theme.colors.primary}
            size="large"
            style={styles.loading}
          />
        ) : tripError || !trip ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Could not load trip details</Text>
            <Text style={styles.stateText}>
              {tripError?.message ?? "Trip details are unavailable."}
            </Text>
            {tripUid ? (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => refetch()}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            ) : null}
          </View>
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

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              {addressesLoading ? (
                <ActivityIndicator
                  color={theme.colors.primary}
                  style={styles.addressLoading}
                />
              ) : addressError ? (
                <View style={styles.stateCard}>
                  <Text style={styles.stateText}>{addressError}</Text>
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => refetchAddresses()}
                  >
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : selectedAddress ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  style={styles.addressCard}
                  onPress={() => setIsChoosingAddress(true)}
                >
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={22}
                    color={theme.colors.primary}
                  />
                  <View style={styles.addressDetails}>
                    <Text style={styles.addressTitle}>
                      {selectedAddress.label}
                    </Text>
                    <Text style={styles.addressText}>
                      {formatAddress(selectedAddress)}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={22}
                    color={theme.colors.muted}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.stateCard}>
                  <Text style={styles.stateText}>
                    Add a saved address to continue with this order.
                  </Text>
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => router.push("/(modals)/request/add-address")}
                  >
                    <Text style={styles.retryText}>Add Address</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <TextInput
                accessibilityLabel="Order instructions"
                multiline
                placeholder="Add any notes for the driver"
                placeholderTextColor={theme.colors.muted}
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Estimated Total</Text>
              <SummaryRow label="Items subtotal" value={estimate.subtotal} />
              <SummaryRow label="Service fee" value={estimate.serviceFee} />
              <SummaryRow label="Estimated taxes" value={estimate.taxes} />
              <SummaryRow
                label="Payment processing"
                value={estimate.paymentProcessing}
              />
              <View style={styles.totalDivider} />
              <SummaryRow label="Total" value={estimate.total} bold />
              <Text style={styles.estimateNote}>
                Final charges may vary based on actual item prices.
              </Text>
            </View>
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

      <AddressPickerModal
        addresses={addresses}
        selectedUid={selectedAddressUid}
        visible={isChoosingAddress}
        onClose={() => setIsChoosingAddress(false)}
        onAddAddress={() => {
          setIsChoosingAddress(false);
          router.push("/(modals)/request/add-address");
        }}
        onSelect={(address) => {
          setSelectedAddressUid(address.uid);
          setIsChoosingAddress(false);
        }}
      />
    </View>
  );
}

function AddressPickerModal({
  addresses,
  selectedUid,
  visible,
  onClose,
  onAddAddress,
  onSelect,
}: {
  addresses: Address[];
  selectedUid: string;
  visible: boolean;
  onClose: () => void;
  onAddAddress: () => void;
  onSelect: (address: Address) => void;
}) {
  const { theme } = useUnistyles();

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose delivery address</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close address picker"
              onPress={onClose}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {addresses.map((address) => {
              const isSelected = selectedUid === address.uid;
              return (
                <TouchableOpacity
                  accessibilityRole="button"
                  key={address.uid}
                  style={[
                    styles.addressOption,
                    isSelected && styles.addressOptionSelected,
                  ]}
                  onPress={() => onSelect(address)}
                >
                  <View style={styles.addressDetails}>
                    <Text style={styles.addressTitle}>{address.label}</Text>
                    <Text style={styles.addressText}>
                      {formatAddress(address)}
                    </Text>
                  </View>
                  {isSelected ? (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={22}
                      color={theme.colors.primary}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.addAddressButton}
            onPress={onAddAddress}
          >
            <Text style={styles.retryText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, bold && styles.totalText]}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.totalText]}>
        ${value.toFixed(2)}
      </Text>
    </View>
  );
}

function formatAddress(address: Address) {
  return [
    address.line1,
    address.line2,
    address.city.name,
    address.province.name,
    address.postalCode,
    address.country.name,
  ]
    .filter(Boolean)
    .join(", ");
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
  loading: {
    marginTop: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },
  addressLoading: {
    marginVertical: theme.spacing.md,
  },
  addressCard: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  addressDetails: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  addressTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  addressText: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  notesInput: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    minHeight: 90,
    padding: theme.spacing.md,
    textAlignVertical: "top",
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  summaryTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    color: theme.colors.muted,
    flex: 1,
    fontSize: 14,
  },
  summaryValue: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  totalDivider: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginVertical: theme.spacing.sm,
  },
  totalText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  estimateNote: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: theme.spacing.xs,
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
  stateCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  stateTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
  retryText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
    padding: theme.spacing.xs,
  },
  modalOverlay: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    maxHeight: "75%",
    padding: theme.spacing.lg,
  },
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  addressOption: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  addressOptionSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  addAddressButton: {
    alignItems: "center",
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
}));
