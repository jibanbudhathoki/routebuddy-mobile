import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AddPaymentMethodCardProps {
  onPress: () => void;
}

export function AddPaymentMethodCard({ onPress }: AddPaymentMethodCardProps) {
  const { theme } = useUnistyles();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Add a new card"
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={24}
          color={theme.colors.text}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>Add a new card</Text>
        <Text style={styles.subtitle}>
          Visa, Mastercard, American Express, Discover
        </Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={theme.colors.text}
      />
    </TouchableOpacity>
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
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
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
}));
