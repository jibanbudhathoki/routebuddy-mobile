import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestDetailsResponse } from "../types/request";

export function MarketplaceRequestItems({
  request,
}: {
  request: RequestDetailsResponse;
}) {
  const { theme } = useUnistyles();
  const stores = request.stores ?? [];
  const items = request.items ?? [];
  const storeTitle =
    stores.length > 1
      ? `${stores.length} Stores`
      : stores[0]?.name || "Shopping Request";

  return (
    <>
      <View style={styles.storeCard}>
        <View style={styles.storeTopRow}>
          <View style={styles.storeIdentity}>
            <View style={styles.storeIcon}>
              <MaterialCommunityIcons
                name="storefront-outline"
                size={26}
                color={theme.colors.onPrimary}
              />
            </View>
            <View style={styles.storeDetails}>
              <Text style={styles.storeName} numberOfLines={1}>
                {storeTitle}
              </Text>
              <Text style={styles.itemCount}>{items.length} items</Text>
            </View>
          </View>
          <View style={styles.estimatedTotal}>
            <Text style={styles.totalAmount}>{request.total ?? "-"}</Text>
            <Text style={styles.totalCaption}>Estimated Total</Text>
          </View>
        </View>

        <View style={styles.noteRow}>
          <View style={styles.cartIcon}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.note}>
            Please shop for these items and deliver together
            {stores.length > 1 ? " with items from other stores." : "."}
          </Text>
        </View>
      </View>

      <View style={styles.itemsSection}>
        <Text style={styles.sectionHeading}>Items to Buy ({items.length})</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.numberColumn]}>#</Text>
            <Text style={[styles.headerText, styles.itemColumn]}>Item</Text>
            <Text style={[styles.headerText, styles.descriptionColumn]}>
              Description
            </Text>
            <Text style={[styles.headerText, styles.priceColumn]}>
              Est. Price{"\n"}(CAD)
            </Text>
          </View>
          {items.length ? (
            items.map((item, index) => (
              <View
                key={`${item.item}-${index}`}
                style={[
                  styles.itemRow,
                  index < items.length - 1 && styles.itemDivider,
                ]}
              >
                <Text style={[styles.number, styles.numberColumn]}>
                  {index + 1}
                </Text>
                <Text style={[styles.itemName, styles.itemColumn]}>
                  {item.item || "Item"}
                </Text>
                <Text style={[styles.description, styles.descriptionColumn]}>
                  {item.description || "-"}
                </Text>
                <Text style={[styles.price, styles.priceColumn]}>
                  {formatEstimatedPrice(item.estimatePrice)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyItems}>
              No items were added to this request.
            </Text>
          )}
        </View>
      </View>

      <View style={styles.subtotalCard}>
        <View style={styles.tagIcon}>
          <MaterialCommunityIcons
            name="tag"
            size={17}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.subtotalDetails}>
          <Text style={styles.subtotalLabel}>
            {stores.length > 1 ? "Shopping subtotal" : `${storeTitle} Subtotal`}{" "}
            <Text style={styles.subtotalCount}>({items.length} items)</Text>
          </Text>
          <Text style={styles.estimateNote}>
            This is an estimated total. Actual total may vary.
          </Text>
        </View>
        <Text style={styles.subtotalAmount}>{request.itemSubtotal ?? "-"}</Text>
      </View>
    </>
  );
}

function formatEstimatedPrice(value: string | null | undefined) {
  if (!value) return "-";
  return /^CAD\b/i.test(value) ? value : `CAD ${value}`;
}

const styles = StyleSheet.create((theme) => ({
  storeCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    overflow: "hidden",
  },
  storeTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 76,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  storeIdentity: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minWidth: 0,
  },
  storeIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    height: 56,
    justifyContent: "center",
    width: 50,
  },
  storeDetails: {
    flex: 1,
    gap: 5,
    minWidth: 0,
  },
  storeName: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  itemCount: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  estimatedTotal: {
    alignItems: "flex-end",
    marginLeft: theme.spacing.xs,
    maxWidth: "38%",
  },
  totalAmount: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "800",
  },
  totalCaption: {
    color: theme.colors.muted,
    fontSize: 9,
    marginTop: 5,
  },
  noteRow: {
    alignItems: "center",
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 58,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  cartIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  note: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 9,
    lineHeight: 14,
  },
  itemsSection: {
    gap: theme.spacing.xs,
  },
  sectionHeading: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  table: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableHeader: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    flexDirection: "row",
    minHeight: 38,
    paddingHorizontal: theme.spacing.xs,
  },
  headerText: {
    color: theme.colors.text,
    fontSize: 8,
    fontWeight: "700",
    textAlign: "center",
  },
  numberColumn: {
    width: 26,
  },
  itemColumn: {
    flex: 0.85,
    paddingHorizontal: theme.spacing.xs,
  },
  descriptionColumn: {
    flex: 1.35,
    paddingHorizontal: theme.spacing.xs,
  },
  priceColumn: {
    width: 66,
  },
  itemRow: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 43,
    paddingHorizontal: theme.spacing.xs,
  },
  itemDivider: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  number: {
    color: theme.colors.text,
    fontSize: 9,
    textAlign: "center",
  },
  itemName: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: "600",
  },
  description: {
    color: theme.colors.text,
    fontSize: 8,
    lineHeight: 12,
  },
  price: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: "700",
    textAlign: "right",
  },
  emptyItems: {
    color: theme.colors.muted,
    fontSize: 10,
    padding: theme.spacing.md,
    textAlign: "center",
  },
  subtotalCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    minHeight: 52,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  tagIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 18,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  subtotalDetails: {
    flex: 1,
    gap: 3,
  },
  subtotalLabel: {
    color: theme.colors.text,
    fontSize: 8,
    fontWeight: "700",
  },
  subtotalCount: {
    color: theme.colors.muted,
    fontWeight: "400",
  },
  estimateNote: {
    color: theme.colors.muted,
    fontSize: 7,
  },
  subtotalAmount: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
}));
