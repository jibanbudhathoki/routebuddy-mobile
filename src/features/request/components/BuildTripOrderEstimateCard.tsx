import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import type { PricingEstimate } from "../../../shared/utils/pricing";

interface BuildTripOrderEstimateCardProps {
  estimate: PricingEstimate;
}

export function BuildTripOrderEstimateCard({
  estimate,
}: BuildTripOrderEstimateCardProps) {
  return (
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

const styles = StyleSheet.create((theme) => ({
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
}));
