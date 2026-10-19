import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import type { PaymentMethodItem } from "../types/paymentMethod.types";

interface CheckoutPaymentMethodSelectorProps {
  savedMethods: PaymentMethodItem[];
  selectedMethodId: string | null;
  onSelectMethod: (id: string | null) => void;
  isLoading?: boolean;
}

export function CheckoutPaymentMethodSelector({
  savedMethods,
  selectedMethodId,
  onSelectMethod,
  isLoading = false,
}: CheckoutPaymentMethodSelectorProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Payment Method</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading saved payment methods...</Text>
        </View>
      ) : (
        <>
          {savedMethods.map((method) => {
            const isSelected = selectedMethodId === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.selector,
                  isSelected && styles.selectorSelected,
                ]}
                onPress={() => onSelectMethod(method.id)}
                activeOpacity={0.7}
              >
                <View
                  style={isSelected ? styles.radioSelected : styles.radioUnselected}
                >
                  {isSelected ? <View style={styles.radioInner} /> : null}
                </View>

                <MaterialCommunityIcons
                  name="credit-card-outline"
                  size={20}
                  color={theme.colors.primary}
                  style={styles.methodIcon}
                />

                <View style={styles.methodInfo}>
                  <Text style={styles.methodText}>
                    {method.brandDisplayName} •••• {method.last4}
                  </Text>
                  <Text style={styles.expiryText}>
                    Expires {method.expiryMonth}/{method.expiryYear}
                    {method.isDefault ? " • Default" : ""}
                  </Text>
                </View>

                {isSelected ? (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={theme.colors.primary}
                  />
                ) : null}
              </TouchableOpacity>
            );
          })}

          {/* New Card Option */}
          <TouchableOpacity
            style={[
              styles.selector,
              selectedMethodId === null && styles.selectorSelected,
            ]}
            onPress={() => onSelectMethod(null)}
            activeOpacity={0.7}
          >
            <View
              style={
                selectedMethodId === null
                  ? styles.radioSelected
                  : styles.radioUnselected
              }
            >
              {selectedMethodId === null ? (
                <View style={styles.radioInner} />
              ) : null}
            </View>

            <MaterialCommunityIcons
              name="credit-card-plus-outline"
              size={20}
              color={theme.colors.text}
              style={styles.methodIcon}
            />

            <Text style={styles.methodText}>
              {savedMethods.length > 0
                ? "Use a new Credit or Debit Card"
                : "Credit or Debit Card"}
            </Text>

            <View style={styles.cardLogos}>
              <Text
                style={[styles.cardLogoText, { color: theme.colors.primary }]}
              >
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
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  loadingText: {
    color: theme.colors.muted,
    fontSize: 13,
  },
  selector: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  selectorSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
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
  radioUnselected: {
    borderColor: theme.colors.muted,
    borderRadius: 10,
    borderWidth: 2,
    height: 20,
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
  methodInfo: {
    flex: 1,
  },
  methodText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  expiryText: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 2,
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
