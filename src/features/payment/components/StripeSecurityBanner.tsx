import React from "react";
import { View, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function StripeSecurityBanner() {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <View style={styles.lockCircle}>
        <MaterialCommunityIcons
          name="lock"
          size={20}
          color={theme.colors.white}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Your payment information is secure.</Text>
        <Text style={styles.subtitle}>
          We use Stripe to securely process and store your payment details.
        </Text>
      </View>

      <View style={styles.stripeBadge}>
        <Text style={styles.poweredByText}>Powered by</Text>
        <Text style={styles.stripeText}>stripe</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  lockCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.xs,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.muted,
    marginTop: 3,
    lineHeight: 16,
  },
  stripeBadge: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingLeft: theme.spacing.xs,
  },
  poweredByText: {
    fontSize: 10,
    color: theme.colors.muted,
    fontWeight: "500",
  },
  stripeText: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.stripe,
    letterSpacing: -0.5,
  },
}));
