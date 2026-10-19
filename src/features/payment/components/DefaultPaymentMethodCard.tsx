import React from "react";
import { View, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PaymentMethodItem } from "../types/paymentMethod.types";
import { CardBrandBadge } from "./CardBrandBadge";

interface DefaultPaymentMethodCardProps {
  paymentMethod?: PaymentMethodItem;
}

export function DefaultPaymentMethodCard({
  paymentMethod,
}: DefaultPaymentMethodCardProps) {
  const { theme } = useUnistyles();

  if (!paymentMethod) {
    return (
      <View style={styles.cardContainer}>
        <Text style={styles.emptyText}>No default payment method set.</Text>
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.mainRow}>
        <CardBrandBadge
          brand={paymentMethod.brand}
          last4={paymentMethod.last4}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {paymentMethod.brandDisplayName} ending in {paymentMethod.last4}
          </Text>
          <Text style={styles.subtitle}>
            Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
          </Text>
        </View>

        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.starCircle}>
          <MaterialCommunityIcons
            name="star"
            size={12}
            color={theme.colors.white}
          />
        </View>
        <Text style={styles.footerText}>
          This is your default payment method.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  cardContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
  },
  defaultBadge: {
    backgroundColor: theme.colors.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.success,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: theme.spacing.xs,
  },
  starCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  footerText: {
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.muted,
    textAlign: "center",
    paddingVertical: theme.spacing.sm,
  },
}));
