import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useRequestCreation } from "../context/RequestCreationContext";
import { CardField } from "@stripe/stripe-react-native";

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { requestData } = useRequestCreation();

  const items = requestData.items || [];

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + (parseFloat(item.estimatedPrice) || 0),
    0,
  );
  const serviceFee = subtotal * 0.15;
  const taxes = subtotal * 0.05;
  const paymentProcessing = items.length > 0 ? subtotal * 0.029 + 0.3 : 0;
  const total =
    items.length > 0 ? subtotal + serviceFee + taxes + paymentProcessing : 0;

  // Form State
  const [nameOnCard, setNameOnCard] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const isNameValid = nameOnCard.trim().length > 0;
  const isAllValid = isFormValid && isNameValid;

  const handlePay = () => {
    setHasSubmitted(true);
    if (isAllValid) {
      router.push("/(modals)/request/payment-success");
    }
  };

  const hasFailed = hasSubmitted && !isAllValid;

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout & Payment</Text>
        <TouchableOpacity style={styles.headerButton}>
          <View>
            <MaterialCommunityIcons
              name="bell-outline"
              size={28}
              color={theme.colors.primary}
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* <Text style={styles.subtitle}>
          Securely pay to hold your request.{"\n"}
          Funds are held in escrow until delivery is complete.
        </Text> */}

        {hasFailed && (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={40}
              color={theme.colors.error}
              style={styles.errorBannerIcon}
            />
            <View style={styles.errorBannerTextContainer}>
              <Text style={styles.errorBannerTitle}>Payment Failed</Text>
              <Text style={styles.errorBannerText}>
                We couldn't process your payment.
              </Text>
              <Text style={styles.errorBannerText}>
                No charges were made to your card.
              </Text>
            </View>
            <TouchableOpacity onPress={() => setHasSubmitted(false)}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Mock Trip Info Card */}
        <View style={styles.tripCard}>
          <View style={styles.storeLogoContainer}>
            <Text style={styles.storeLogoText}>COSTCO</Text>
            <Text style={styles.storeLogoSubText}>WHOLESALE</Text>
          </View>
          <View style={styles.tripCardInfo}>
            <Text style={styles.tripCardTitle}>Costco Run</Text>
            <Text style={styles.tripCardRoute}>Winnipeg, MB → Brandon, MB</Text>
            <View style={styles.tripCardDetails}>
              <View style={styles.tripCardDetailItem}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={14}
                  color={theme.colors.text}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.tripCardDetailText}>May 24, 2026</Text>
              </View>
              <Text style={styles.tripCardDetailDivider}>|</Text>
              <View style={styles.tripCardDetailItem}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color={theme.colors.text}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.tripCardDetailText}>
                  Delivery by 6:00 PM
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Items Subtotal ({items.length} items)
            </Text>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summarySymbol}>$</Text>
              <Text style={styles.summaryValue}>{subtotal.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelWithIcon}>
              <Text style={styles.summaryLabel}>Service Fee (15%)</Text>
              <MaterialCommunityIcons
                name="information-outline"
                size={14}
                color={theme.colors.text}
                style={styles.infoIcon}
              />
            </View>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summarySymbol}>$</Text>
              <Text style={styles.summaryValue}>{serviceFee.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelWithIcon}>
              <Text style={styles.summaryLabel}>Estimated Taxes (5%)</Text>
              <MaterialCommunityIcons
                name="information-outline"
                size={14}
                color={theme.colors.text}
                style={styles.infoIcon}
              />
            </View>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summarySymbol}>$</Text>
              <Text style={styles.summaryValue}>{taxes.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total to Pay</Text>
            <View style={styles.totalValueContainer}>
              <Text style={styles.totalSymbol}>$</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)}</Text>
              <Text style={styles.totalCurrency}>CAD</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Header */}
        <Text style={styles.sectionTitle}>Payment Method</Text>

        <View style={styles.paymentMethodSelector}>
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
            <Text style={[styles.cardLogoText, { color: "#1434CB" }]}>
              VISA
            </Text>
            {/* Using text representations for logos instead of actual images for simplicity */}
            <View style={styles.mcLogo}>
              <View style={styles.mcRed} />
              <View style={styles.mcOrange} />
            </View>
            <View style={styles.amexLogo}>
              <Text style={styles.amexText}>AMEX</Text>
            </View>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Card Details</Text>
          <View
            style={[
              styles.inputWrapper,
              { paddingHorizontal: 0, paddingVertical: 0 },
              hasFailed && !isFormValid && styles.inputWrapperError,
            ]}
          >
            <CardField
              postalCodeEnabled={false}
              onCardChange={(cardDetails) => {
                setIsFormValid(cardDetails.complete);
              }}
              style={styles.cardField}
              cardStyle={{
                backgroundColor: theme.colors.surface,
                textColor: theme.colors.text,
                placeholderColor: theme.colors.muted,
                fontSize: 14,
                borderWidth: 0,
              }}
            />
          </View>
          {hasFailed && !isFormValid && (
            <Text style={styles.errorText}>
              Please enter complete and valid card details.
            </Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Name on Card</Text>
          <View
            style={[
              styles.inputWrapper,
              hasFailed &&
                nameOnCard.trim().length === 0 &&
                styles.inputWrapperError,
            ]}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={20}
              color={theme.colors.text}
              style={{ opacity: 0.5, marginRight: theme.spacing.sm }}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g., John Smith"
              placeholderTextColor={theme.colors.muted}
              value={nameOnCard}
              onChangeText={setNameOnCard}
            />
          </View>
          {hasFailed && nameOnCard.trim().length === 0 && (
            <Text style={styles.errorText}>
              Please enter the name on your card.
            </Text>
          )}
        </View>

        <View style={styles.securityBanner}>
          <View style={styles.securityIconContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={18}
              color={theme.colors.surface}
            />
          </View>
          <Text style={styles.securityText}>
            Your payment is secure. Funds are held in escrow and will only be
            released once delivery is confirmed by both parties.
          </Text>
        </View>

        {hasFailed ? (
          <>
            <TouchableOpacity
              style={[styles.payButton, { marginBottom: theme.spacing.md }]}
              onPress={handlePay}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={theme.colors.surface}
                style={{ marginRight: theme.spacing.sm }}
              />
              <Text style={styles.payButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setHasSubmitted(false)}
            >
              <Text style={styles.secondaryButtonText}>
                Use a Different Card
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.payButton} onPress={handlePay}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={theme.colors.surface}
              style={{ marginRight: theme.spacing.sm }}
            />
            <Text style={styles.payButtonText}>
              Pay ${total.toFixed(2)} CAD
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.footerBranding}>
          <Text style={styles.poweredByText}>
            Powered by{" "}
            <Text style={{ color: "#635BFF", fontWeight: "bold" }}>stripe</Text>
          </Text>
          <MaterialCommunityIcons
            name="information-outline"
            size={14}
            color={theme.colors.text}
            style={{ opacity: 0.6, marginLeft: 4 }}
          />
        </View>

        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}
          <Text style={{ color: theme.colors.primary }}>Terms of Service</Text>{" "}
          and{" "}
          <Text style={{ color: theme.colors.primary }}>Privacy Policy</Text>.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  notificationText: {
    color: theme.colors.surface,
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  // subtitle: {
  //   fontSize: 14,
  //   color: theme.colors.primary,
  //   textAlign: "center",
  //   marginBottom: theme.spacing.lg,
  //   marginTop: theme.spacing.xs,
  //   lineHeight: 20,
  // },
  errorBanner: {
    flexDirection: "row",
    backgroundColor: "#FEF3F2",
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: "#FEE4E2",
    alignItems: "flex-start",
  },
  errorBannerIcon: {
    marginRight: theme.spacing.sm,
  },
  errorBannerTextContainer: {
    flex: 1,
  },
  errorBannerTitle: {
    color: theme.colors.error,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  errorBannerText: {
    color: theme.colors.primary,
    fontSize: 13,
  },
  tripCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  storeLogoContainer: {
    width: 70,
    height: 70,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  storeLogoText: {
    color: theme.colors.surface,
    fontWeight: "900",
    fontSize: 14,
    fontStyle: "italic",
  },
  storeLogoSubText: {
    color: theme.colors.surface,
    fontWeight: "bold",
    fontSize: 8,
    marginTop: 2,
  },
  tripCardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  tripCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  tripCardRoute: {
    fontSize: 13,
    color: theme.colors.text,
    marginBottom: 8,
  },
  tripCardDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripCardDetailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripCardDetailText: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.6,
    marginLeft: 4,
  },
  tripCardDetailDivider: {
    fontSize: 12,
    color: theme.colors.border,
    marginHorizontal: 8,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  summaryLabelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.8,
  },
  infoIcon: {
    marginLeft: 6,
    opacity: 0.6,
  },
  summaryValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  summarySymbol: {
    fontSize: 14,
    color: theme.colors.text,
    marginRight: 6,
    opacity: 0.8,
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text,
    minWidth: 45,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  totalValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  totalSymbol: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginRight: 4,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  totalCurrency: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  paymentMethodSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  methodIcon: {
    marginRight: theme.spacing.sm,
  },
  methodText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  cardLogos: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardLogoText: {
    fontWeight: "bold",
    fontSize: 12,
    marginRight: 8,
  },
  mcLogo: {
    flexDirection: "row",
    marginRight: 8,
  },
  mcRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EB001B",
    marginRight: -4,
    zIndex: 2,
  },
  mcOrange: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F79E1B",
    zIndex: 1,
  },
  amexLogo: {
    backgroundColor: "#2E77BC",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  amexText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
  stripeFieldContainer: {
    marginBottom: theme.spacing.md,
  },
  cardField: {
    width: "100%",
    height: 50,
  },
  fieldContainer: {
    marginBottom: theme.spacing.md,
  },
  rowFields: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontSize: 12,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    height: 50,
  },
  inputWrapperError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  securityBanner: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },
  securityIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.primary,
    lineHeight: 18,
  },
  payButton: {
    flexDirection: "row",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  payButtonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  footerBranding: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  poweredByText: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.7,
  },
  termsText: {
    fontSize: 11,
    color: theme.colors.text,
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 16,
  },
}));
