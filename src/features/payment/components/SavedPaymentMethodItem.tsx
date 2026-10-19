import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PaymentMethodItem } from "../types/paymentMethod.types";
import { CardBrandBadge } from "./CardBrandBadge";

interface SavedPaymentMethodItemProps {
  paymentMethod: PaymentMethodItem;
  onOptionsPress: (item: PaymentMethodItem) => void;
}

export function SavedPaymentMethodItem({
  paymentMethod,
  onOptionsPress,
}: SavedPaymentMethodItemProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.cardContainer}>
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

      <TouchableOpacity
        style={styles.optionsButton}
        onPress={() => onOptionsPress(paymentMethod)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel={`Options for ${paymentMethod.brandDisplayName} ending in ${paymentMethod.last4}`}
      >
        <MaterialCommunityIcons
          name="dots-horizontal"
          size={24}
          color={theme.colors.text}
        />
      </TouchableOpacity>
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
  optionsButton: {
    padding: theme.spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
}));
