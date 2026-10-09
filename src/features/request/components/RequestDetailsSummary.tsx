import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestDetailsResponse } from "../types/request";

export function RequestDetailsSummary({
  request,
}: {
  request: RequestDetailsResponse;
}) {
  const { theme } = useUnistyles();
  const itemsCount = request.items?.length ?? 0;
  const estimatedSubtotal = request.itemSubtotal ?? "-";
  const total = request.total ?? "-";

  return (
    <>
      {request.notes?.trim() ? (
        <View style={styles.instructions}>
          <MaterialCommunityIcons
            name="chat-outline"
            size={18}
            color={theme.colors.primary}
          />
          <View style={styles.instructionsContent}>
            <Text style={styles.instructionsTitle}>Special Instructions</Text>
            <Text style={styles.instructionsText}>{request.notes}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.summaryCard}>
        <Text style={styles.heading}>Request Summary</Text>
        <View style={styles.metrics}>
          <Metric label="Items" value={String(itemsCount)} />
          <View style={styles.divider} />
          <Metric label="Offers" value={String(request.offers?.length ?? 0)} />
          <View style={styles.divider} />
          <Metric label="Est. Subtotal" value={estimatedSubtotal} />
          <View style={styles.divider} />
          <Metric label="Est. Total" value={total} />
        </View>
        <View style={styles.costRows}>
          <CostRow label="Item subtotal" value={request.itemSubtotal} />
          <CostRow label="Service fee" value={request.serviceFee} />
          <CostRow label="Driver fee" value={request.driverFee} />
          <CostRow label="Platform fee" value={request.platformFee} />
          <CostRow label="Tax" value={request.tax} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function CostRow({ label, value }: { label: string; value: string | null }) {
  if (value === null) return null;

  return (
    <View style={styles.costRow}>
      <Text style={styles.costLabel}>{label}</Text>
      <Text style={styles.costValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  instructions: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  instructionsContent: {
    flex: 1,
    gap: 3,
  },
  instructionsTitle: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "700",
  },
  instructionsText: {
    color: theme.colors.muted,
    fontSize: 8,
    lineHeight: 12,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    padding: theme.spacing.sm,
  },
  heading: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "700",
  },
  metrics: {
    alignItems: "stretch",
    flexDirection: "row",
    marginTop: theme.spacing.sm,
  },
  metric: {
    alignItems: "center",
    flex: 1,
    gap: 3,
    justifyContent: "center",
    minWidth: 0,
  },
  metricLabel: {
    color: theme.colors.muted,
    fontSize: 7,
    textAlign: "center",
  },
  metricValue: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  divider: {
    backgroundColor: theme.colors.border,
    width: 1,
  },
  costRows: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
  },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  costLabel: {
    color: theme.colors.muted,
    fontSize: 8,
  },
  costValue: {
    color: theme.colors.text,
    fontSize: 8,
  },
  totalRow: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    paddingTop: theme.spacing.xs,
  },
  totalLabel: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "700",
  },
  totalValue: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },
}));
