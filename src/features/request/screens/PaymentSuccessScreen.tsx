import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useRequestCreation } from "../context/RequestCreationContext";

export function PaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { requestData } = useRequestCreation();

  const items = requestData.items || [];
  
  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.estimatedPrice) || 0), 0);
  const serviceFee = subtotal * 0.15;
  const taxes = subtotal * 0.05;
  const paymentProcessing = items.length > 0 ? (subtotal * 0.029) + 0.30 : 0;
  const total = items.length > 0 ? (subtotal + serviceFee + taxes + paymentProcessing) : 0;

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.dismissAll()}
        >
          <MaterialCommunityIcons
            name="close"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successIconContainer}>
          <View style={styles.successCircle}>
            <MaterialCommunityIcons name="check" size={60} color={theme.colors.surface} />
          </View>
          {/* Sparkles (mocked with simple absolute icons) */}
          <MaterialCommunityIcons name="star-four-points" size={16} color="#BCE3D6" style={[styles.sparkle, { top: 0, left: 20 }]} />
          <MaterialCommunityIcons name="star-four-points" size={12} color="#BCE3D6" style={[styles.sparkle, { top: 40, left: -10 }]} />
          <MaterialCommunityIcons name="star-four-points" size={10} color="#BCE3D6" style={[styles.sparkle, { top: 80, left: 10 }]} />
          <MaterialCommunityIcons name="star-four-points" size={20} color="#BCE3D6" style={[styles.sparkle, { top: 10, right: 10 }]} />
          <MaterialCommunityIcons name="star-four-points" size={14} color="#BCE3D6" style={[styles.sparkle, { top: 60, right: -15 }]} />
        </View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>
          Your payment of ${total.toFixed(2)} CAD has been received and is securely held in escrow.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.tripCard}>
            <View style={styles.storeLogoContainer}>
              <Text style={styles.storeLogoText}>COSTCO</Text>
              <Text style={styles.storeLogoSubText}>WHOLESALE</Text>
            </View>
            <View style={styles.tripCardInfo}>
              <Text style={styles.tripCardTitle}>Costco Run</Text>
              <Text style={styles.tripCardRoute}>Winnipeg, MB  →  Brandon, MB</Text>
              <View style={styles.tripCardDetails}>
                <View style={styles.tripCardDetailItem}>
                  <MaterialCommunityIcons name="calendar-outline" size={14} color={theme.colors.text} style={{ opacity: 0.6 }} />
                  <Text style={styles.tripCardDetailText}>May 24, 2026</Text>
                </View>
                <Text style={styles.tripCardDetailDivider}>|</Text>
                <View style={styles.tripCardDetailItem}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.text} style={{ opacity: 0.6 }} />
                  <Text style={styles.tripCardDetailText}>Delivery by 6:00 PM</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items Subtotal ({items.length} items)</Text>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summarySymbol}>$</Text>
              <Text style={styles.summaryValue}>{subtotal.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelWithIcon}>
              <Text style={styles.summaryLabel}>Service Fee (15%)</Text>
              <MaterialCommunityIcons name="information-outline" size={14} color={theme.colors.text} style={styles.infoIcon} />
            </View>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summarySymbol}>$</Text>
              <Text style={styles.summaryValue}>{serviceFee.toFixed(2)}</Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelWithIcon}>
              <Text style={styles.summaryLabel}>Estimated Taxes (5%)</Text>
              <MaterialCommunityIcons name="information-outline" size={14} color={theme.colors.text} style={styles.infoIcon} />
            </View>
            <View style={styles.summaryValueContainer}>
              <Text style={styles.summarySymbol}>$</Text>
              <Text style={styles.summaryValue}>{taxes.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <View style={styles.totalValueContainer}>
              <Text style={styles.totalSymbol}>$</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)}</Text>
              <Text style={styles.totalCurrency}>CAD</Text>
            </View>
          </View>
        </View>

        <View style={styles.securityBanner}>
          <View style={styles.securityIconContainer}>
            <MaterialCommunityIcons name="lock-outline" size={24} color={theme.colors.surface} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>Your payment is secure</Text>
            <Text style={styles.securityText}>
              You'll funds are held in escrow and will only be released once delivery is confirmed by both parties.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>What happens next?</Text>

        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <MaterialCommunityIcons name="cart-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Shopper shops your order</Text>
              <Text style={styles.timelineText}>You'll be notified when your shopper starts shopping.</Text>
            </View>
          </View>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineIconContainer}>
              <MaterialCommunityIcons name="truck-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Order is on the way</Text>
              <Text style={styles.timelineText}>Track progress and communicate with your shopper in chat.</Text>
            </View>
          </View>

          <View style={[styles.timelineItem, { marginBottom: 0 }]}>
            <View style={styles.timelineIconContainer}>
              <MaterialCommunityIcons name="package-variant-closed-check" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Order is delivered</Text>
              <Text style={styles.timelineText}>Confirm delivery and your payment will be released to your shopper.</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>View Order Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.dismissAll()}>
          <Text style={styles.secondaryButtonText}>Go to Home</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <MaterialCommunityIcons name="email-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.footerText}>A receipt has been sent to your email.</Text>
        </View>
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
  headerSpacer: {
    width: 40,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  successIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: theme.spacing.lg,
    height: 120,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: theme.colors.surface,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sparkle: {
    position: "absolute",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  tripCard: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
  },
  storeLogoContainer: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  storeLogoText: {
    color: theme.colors.surface,
    fontWeight: "900",
    fontSize: 12,
    fontStyle: "italic",
  },
  storeLogoSubText: {
    color: theme.colors.surface,
    fontWeight: "bold",
    fontSize: 7,
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
  summaryDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  summaryLabelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
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
    fontSize: 13,
    color: theme.colors.text,
    marginRight: 6,
    opacity: 0.8,
  },
  summaryValue: {
    fontSize: 13,
    color: theme.colors.text,
    minWidth: 45,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xs,
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
  securityBanner: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.xl,
    alignItems: "flex-start",
  },
  securityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  securityText: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 18,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  timeline: {
    marginBottom: theme.spacing.xl,
    marginLeft: theme.spacing.xs,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 24,
    position: "relative",
  },
  timelineIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
    zIndex: 2,
  },
  timelineLine: {
    position: "absolute",
    left: 21,
    top: 44,
    bottom: -24,
    width: 2,
    backgroundColor: theme.colors.border,
    borderStyle: "dashed",
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    justifyContent: "center",
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  timelineText: {
    fontSize: 13,
    color: theme.colors.text,
    opacity: 0.7,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
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
    marginBottom: theme.spacing.xl,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: theme.spacing.xl,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.7,
    marginLeft: 8,
  },
}));
