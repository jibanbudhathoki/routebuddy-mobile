import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestDetailsResponse } from "../types/request";

export function RequestShoppingList({
  request,
}: {
  request: RequestDetailsResponse;
}) {
  const { theme } = useUnistyles();
  const items = request.items ?? [];
  const stores = request.stores ?? [];

  return (
    <View>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Shopping List</Text>
        <Text style={styles.count}>{items.length} items</Text>
      </View>
      <View style={styles.card}>
        {stores.map((store) => (
          <View key={store.uid} style={styles.storeHeading}>
            <MaterialCommunityIcons
              name="store-outline"
              size={14}
              color={theme.colors.primary}
            />
            <Text style={styles.storeName}>{store.name}</Text>
          </View>
        ))}
        {items.length ? (
          items.map((item, index) => (
            <View
              key={`${item.item}-${index}`}
              style={[
                styles.itemRow,
                index < items.length - 1 && styles.itemDivider,
              ]}
            >
              <Text style={styles.itemName} numberOfLines={2}>
                {item.item || "Item"}
              </Text>
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description || "-"}
              </Text>
              <Text style={styles.itemPrice}>
                {item.estimatePrice ? `CAD ${item.estimatePrice}` : "-"}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No items were added to this request.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  headingRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  heading: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  count: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
  },
  storeHeading: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    minHeight: 34,
  },
  storeName: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "700",
  },
  itemRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
    minHeight: 34,
  },
  itemDivider: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  itemName: {
    color: theme.colors.text,
    flex: 1.15,
    fontSize: 9,
    fontWeight: "600",
  },
  itemDescription: {
    color: theme.colors.muted,
    flex: 1,
    fontSize: 8,
  },
  itemPrice: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: "700",
    textAlign: "right",
    width: 60,
  },
  empty: {
    color: theme.colors.muted,
    fontSize: 10,
    paddingVertical: theme.spacing.md,
    textAlign: "center",
  },
}));
