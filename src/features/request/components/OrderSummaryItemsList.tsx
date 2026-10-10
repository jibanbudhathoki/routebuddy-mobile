import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestItem } from "../types/request";

interface OrderSummaryItemsListProps {
  items: RequestItem[];
  onRemoveItem: (id: string) => void;
  onAddAnother: () => void;
}

export function OrderSummaryItemsList({
  items,
  onRemoveItem,
  onAddAnother,
}: OrderSummaryItemsListProps) {
  const { theme } = useUnistyles();

  return (
    <>
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
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.name}`}
              style={styles.deleteButton}
              onPress={() => onRemoveItem(item.id)}
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
        accessibilityRole="button"
        style={styles.addAnotherButton}
        onPress={onAddAnother}
      >
        <MaterialCommunityIcons
          name="plus-circle-outline"
          size={20}
          color={theme.colors.primary}
        />
        <Text style={styles.addAnotherText}>Add another item</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  itemsList: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  itemCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    padding: theme.spacing.md,
  },
  itemNumberBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    height: 32,
    justifyContent: "center",
    marginRight: theme.spacing.md,
    width: 32,
  },
  itemNumberText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDetails: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  itemName: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  itemDescription: {
    color: theme.colors.text,
    fontSize: 13,
    opacity: 0.8,
  },
  priceContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: theme.spacing.md,
    width: 60,
  },
  priceSymbol: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 4,
  },
  priceText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  addAnotherButton: {
    alignItems: "center",
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderStyle: "dashed",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  addAnotherText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: theme.spacing.sm,
  },
}));
