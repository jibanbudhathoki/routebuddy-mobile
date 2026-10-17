import React from "react";
import { View, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { CardBrand } from "../types/paymentMethod.types";

interface CardBrandBadgeProps {
  brand: CardBrand;
  last4: string;
}

export function CardBrandBadge({ brand, last4 }: CardBrandBadgeProps) {
  const { theme } = useUnistyles();

  const getCardBg = () => {
    switch (brand) {
      case "visa":
        return theme.colors.cardVisa;
      case "mastercard":
        return theme.colors.cardMastercard;
      case "amex":
        return theme.colors.cardAmex;
      case "discover":
        return theme.colors.cardDiscover;
      default:
        return theme.colors.cardVisa;
    }
  };

  const renderBrandLogo = () => {
    switch (brand) {
      case "visa":
        return (
          <Text style={styles.visaText} numberOfLines={1}>
            VISA
          </Text>
        );
      case "mastercard":
        return (
          <View style={styles.mastercardContainer}>
            <View
              style={[
                styles.mastercardCircle,
                { backgroundColor: theme.colors.cardCircleRed },
              ]}
            />
            <View
              style={[
                styles.mastercardCircle,
                styles.mastercardCircleOverlap,
                { backgroundColor: theme.colors.cardCircleOrange },
              ]}
            />
          </View>
        );
      case "amex":
        return (
          <Text style={styles.amexText} numberOfLines={1}>
            AMEX
          </Text>
        );
      case "discover":
        return (
          <View style={styles.discoverRow}>
            <Text style={styles.discoverText}>DISC</Text>
            <View
              style={[
                styles.discoverDot,
                { backgroundColor: theme.colors.cardDiscoverOrange },
              ]}
            />
            <Text style={styles.discoverText}>VER</Text>
          </View>
        );
      default:
        return <Text style={styles.genericText}>CARD</Text>;
    }
  };

  return (
    <View style={[styles.cardContainer, { backgroundColor: getCardBg() }]}>
      <View style={styles.logoRow}>{renderBrandLogo()}</View>
      <Text style={styles.cardNumberText} numberOfLines={1}>
        •••• {last4}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  cardContainer: {
    width: 68,
    height: 44,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 4,
    justifyContent: "space-between",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  visaText: {
    color: theme.colors.white,
    fontWeight: "900",
    fontStyle: "italic",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  mastercardContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mastercardCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  mastercardCircleOverlap: {
    marginLeft: -6,
    opacity: 0.9,
  },
  amexText: {
    color: theme.colors.white,
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 0.8,
  },
  discoverRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  discoverText: {
    color: theme.colors.white,
    fontWeight: "800",
    fontSize: 8,
    letterSpacing: 0.3,
  },
  discoverDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  genericText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 9,
  },
  cardNumberText: {
    color: theme.colors.white,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.5,
    alignSelf: "flex-end",
  },
}));
