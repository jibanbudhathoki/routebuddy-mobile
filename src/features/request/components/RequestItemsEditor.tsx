import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestItem } from "../types/request";

interface RequestItemsEditorProps {
  items: RequestItem[];
  onRemoveItem: (id: string) => void;
  onAddItem: () => void;
}

export function RequestItemsEditor({
  items,
  onRemoveItem,
  onAddItem,
}: RequestItemsEditorProps) {
  const { theme } = useUnistyles();

  return (
    <View>
      <Text style={styles.sectionTitle}>1. Add Items</Text>
      <Text style={styles.sectionSubtitle}>
        List the items you need and an estimated price for each.
      </Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>#</Text>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Item</Text>
          <Text style={[styles.tableHeaderText, { flex: 3 }]}>
            Description (brand, size, etc.)
          </Text>
          <Text
            style={[
              styles.tableHeaderText,
              { flex: 1.5, textAlign: "right" },
            ]}
          >
            Est. Price (CAD)
          </Text>
          <Text
            style={[
              styles.tableHeaderText,
              { flex: 1, textAlign: "center" },
            ]}
          >
            Action
          </Text>
        </View>

        {items.map((item, index) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={3}>
              {item.description}
            </Text>
            <View style={[styles.priceCell, { flex: 1.5 }]}>
              <Text style={styles.priceSymbol}>$</Text>
              <Text
                style={[styles.tableCell, { textAlign: "right", flex: 1 }]}
              >
                {item.estimatedPrice}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.name}`}
              style={[styles.actionCell, { flex: 1 }]}
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
        style={styles.addButton}
        onPress={onAddItem}
      >
        <MaterialCommunityIcons
          name="plus-circle-outline"
          size={20}
          color={theme.colors.primary}
        />
        <Text style={styles.addButtonText}>Add another item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.primary,
    opacity: 0.8,
    marginBottom: theme.spacing.md,
  },
  table: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tableCell: {
    fontSize: 13,
    color: theme.colors.text,
    paddingHorizontal: 2,
  },
  priceCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: theme.spacing.xs,
  },
  priceSymbol: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  actionCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
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
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
}));
