import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useRequestCreation } from "../context/RequestCreationContext";
import { useStores } from "../../../shared/store/hooks/useStores";
import { useCities } from "../../../shared/city/hooks/useCities";
import { useCreateRequest } from "../hooks/useRequests";
import { calculateEstimate, PRICING_RATES } from "../../../shared/utils/pricing";

export function OrderSummaryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { requestData, updateRequestData } = useRequestCreation();
  const { createRequest, isLoading: isCreatingRequest } = useCreateRequest();

  const items = requestData.items || [];

  
  const handleContinue = async () => {
    try {
      const payload = {
        stores: requestData.stores || [],
        items: (requestData.items || []).map((i) => ({
          item: i.name,
          description: i.description,
          estimatePrice: parseFloat(i.estimatedPrice) || 0,
        })),
        deliveryAddress: requestData.deliveryAddress || "",
        deliveryCityUid: requestData.deliveryCityUid || "",
        neededBy: requestData.dayNeeded || new Date().toISOString(),
        latestDeliveryBy: requestData.latestDeliveryTime || new Date().toISOString(),
        notes: requestData.itemsInstructions || "",
      };

      const response: any = await createRequest(payload);

      if (response?.data?.status === "pending") {
        router.push({
          pathname: "/(modals)/request/checkout",
          params: { postId: response.data.postId }
        });
      } else if (response?.success || response?.data?.status === "open") {
        router.push("/(modals)/request/payment-success");
      } else {
        throw new Error(response?.message || "Failed to create request");
      }
    } catch (e) {
      console.error("Failed to create request:", e);
    }
  };


  const handleRemoveItem = (id: string) => {
    updateRequestData({
      items: items.filter((item) => item.id !== id),
    });
  };

  const { subtotal, serviceFee, taxes, paymentProcessing, total } = calculateEstimate(items);

  // Real Data mapping
  const { stores } = useStores({ limit: 100 });
  const { cities } = useCities();

  const selectedStore = stores.find(s => requestData.stores?.includes(s.uid));
  const storeName = selectedStore?.name || "Unknown Store";
  const storeLogoText = storeName.split(' ')[0]?.toUpperCase() || "STORE";
  const storeLogoSubText = storeName.split(' ').slice(1).join(' ').toUpperCase() || "";

  const originCity = cities.find(c => c.uid === selectedStore?.cityUid);
  const destCity = cities.find(c => c.uid === requestData.deliveryCityUid);

  const routeText = `${originCity?.name || "Origin"}, ${originCity?.provinceCode || ""}  →  ${destCity?.name || "Destination"}, ${destCity?.provinceCode || ""}`;
  
  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };


  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom, paddingTop: insets.top },
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
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Items</Text>
        <TouchableOpacity style={styles.headerButton}>
          <View>
            <MaterialCommunityIcons
              name="bell-outline"
              size={28}
              color={theme.colors.primary}
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Review your items and estimated total before continuing.
        </Text>

        {/* Mock Trip Info Card */}
        <View style={styles.tripCard}>
          <View style={styles.storeLogoContainer}>
            <Text style={styles.storeLogoText} numberOfLines={1}>{storeLogoText}</Text>
            {!!storeLogoSubText && <Text style={styles.storeLogoSubText} numberOfLines={1}>{storeLogoSubText}</Text>}
          </View>
          <View style={styles.tripCardInfo}>
            <Text style={styles.tripCardTitle}>{storeName} Run</Text>
            <Text style={styles.tripCardRoute}>{routeText}</Text>
            <View style={styles.tripCardDetails}>
              <View style={styles.tripCardDetailItem}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={14}
                  color={theme.colors.text}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.tripCardDetailText}>{formatDate(requestData.dayNeeded)}</Text>
              </View>
              <Text style={styles.tripCardDetailDivider}>|</Text>
              <View style={styles.tripCardDetailItem}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color={theme.colors.text}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.tripCardDetailText}>Delivery by {formatTime(requestData.latestDeliveryTime)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemNumberBadge}>
                <Text style={styles.itemNumberText}>{index + 1}</Text>
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                {!!item.description && (
                  <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceSymbol}>$</Text>
                <Text style={styles.priceText}>
                  {parseFloat(item.estimatedPrice).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={22}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addAnotherButton}
          onPress={() => router.push("/(modals)/request/build-shopping-list")}
        >
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.addAnotherText}>Add another item</Text>
        </TouchableOpacity>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Estimated Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Items Subtotal ({items.length} items)
            </Text>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summarySymbol}>$</Text>
              <Text style={styles.summaryValue}>{subtotal.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelWithIcon}>
              <Text style={styles.summaryLabel}>Service Fee ({parseFloat((PRICING_RATES.SERVICE_FEE_RATE * 100).toFixed(2))}%)</Text>
              <MaterialCommunityIcons
                name="information-outline"
                size={14}
                color={theme.colors.text}
                style={styles.infoIcon}
              />
            </View>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summarySymbol}>$</Text>
              <Text style={styles.summaryValue}>{serviceFee.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelWithIcon}>
              <Text style={styles.summaryLabel}>Estimated Taxes ({parseFloat((PRICING_RATES.TAX_RATE * 100).toFixed(2))}%)</Text>
              <MaterialCommunityIcons
                name="information-outline"
                size={14}
                color={theme.colors.text}
                style={styles.infoIcon}
              />
            </View>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summarySymbol}>$</Text>
              <Text style={styles.summaryValue}>{taxes.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelWithIcon}>
              <Text style={styles.summaryLabel}>
                Payment Processing ({parseFloat((PRICING_RATES.PAYMENT_PROCESSING_RATE * 100).toFixed(2))}% + ${PRICING_RATES.PAYMENT_PROCESSING_FIXED.toFixed(2)})
              </Text>
              <MaterialCommunityIcons
                name="information-outline"
                size={14}
                color={theme.colors.text}
                style={styles.infoIcon}
              />
            </View>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summarySymbol}>$</Text>
              <Text style={styles.summaryValue}>
                {items.length > 0 ? paymentProcessing.toFixed(2) : "0.00"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.totalSymbol}>$</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.disclaimerBanner}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={theme.colors.primary}
              style={styles.disclaimerIcon}
            />
            <Text style={styles.disclaimerText}>
              Final total may vary based on actual store prices, taxes, and any
              substitutions.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Publish Request"
          onPress={handleContinue}
          loading={isCreatingRequest}
          disabled={isCreatingRequest}
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
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  notificationText: {
    color: theme.colors.surface,
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.xs,
  },
  tripCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  storeLogoContainer: {
    width: 70,
    height: 70,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  storeLogoText: {
    color: theme.colors.surface,
    fontWeight: "900",
    fontSize: 14,
    fontStyle: "italic",
  },
  storeLogoSubText: {
    color: theme.colors.surface,
    fontWeight: "bold",
    fontSize: 8,
    marginTop: 2,
  },
  tripCardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  tripCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  tripCardRoute: {
    fontSize: 13,
    color: theme.colors.text,
    marginBottom: 8,
  },
  tripCardDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripCardDetailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripCardDetailText: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.6,
    marginLeft: 4,
  },
  tripCardDetailDivider: {
    fontSize: 12,
    color: theme.colors.border,
    marginHorizontal: 8,
  },

  // Items List
  itemsList: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  itemNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  itemDetails: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    color: theme.colors.text,
    opacity: 0.8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 60,
    justifyContent: "flex-end",
    marginRight: theme.spacing.md,
  },
  priceSymbol: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginRight: 4,
  },
  priceText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },

  addAnotherButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.xl,
  },
  addAnotherText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  summaryLabelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.8,
  },
  infoIcon: {
    marginLeft: 6,
    opacity: 0.6,
  },
  summaryValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  summarySymbol: {
    fontSize: 14,
    color: theme.colors.text,
    marginRight: 6,
    opacity: 0.8,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text,
    minWidth: 45,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  totalSymbol: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginRight: 6,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
    minWidth: 55,
    textAlign: "right",
  },
  disclaimerBanner: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    alignItems: "flex-start",
  },
  disclaimerIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.text,
    lineHeight: 18,
  },

  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
}));
