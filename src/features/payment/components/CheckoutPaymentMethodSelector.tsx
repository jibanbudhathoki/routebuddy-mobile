import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export function CheckoutPaymentMethodSelector() {
  const { theme } = useUnistyles();

  return (
    <>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.selector}>
        <View style={styles.radioSelected}>
          <View style={styles.radioInner} />
        </View>
        <MaterialCommunityIcons
          name="credit-card-outline"
          size={20}
          color={theme.colors.text}
          style={styles.methodIcon}
        />
        <Text style={styles.methodText}>Credit or Debit Card</Text>
        <View style={styles.cardLogos}>
          <Text style={[styles.cardLogoText, { color: theme.colors.primary }]}>
            VISA
          </Text>
          <View style={styles.mcLogo}>
            <View style={styles.mcRed} />
            <View style={styles.mcOrange} />
          </View>
          <View style={styles.amexLogo}>
            <Text style={styles.amexText}>AMEX</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
  },
  selector: {
    alignItems: "center",
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  radioSelected: {
    alignItems: "center",
    borderColor: theme.colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
    justifyContent: "center",
    marginRight: theme.spacing.sm,
    width: 20,
  },
  radioInner: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  methodIcon: {
    marginRight: theme.spacing.sm,
  },
  methodText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
  },
  cardLogos: {
    alignItems: "center",
    flexDirection: "row",
  },
  cardLogoText: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 8,
  },
  mcLogo: {
    flexDirection: "row",
    marginRight: 8,
  },
  mcRed: {
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    height: 12,
    marginRight: -4,
    width: 12,
    zIndex: 2,
  },
  mcOrange: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 6,
    height: 12,
    width: 12,
    zIndex: 1,
  },
  amexLogo: {
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  amexText: {
    color: theme.colors.surface,
    fontSize: 8,
    fontWeight: "bold",
  },
}));
