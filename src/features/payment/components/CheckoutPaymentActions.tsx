import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface CheckoutPaymentActionsProps {
  hasFailed: boolean;
  isInitializing: boolean;
  total: number;
  onPay: () => void;
  onReset: () => void;
}

export function CheckoutPaymentActions({
  hasFailed,
  isInitializing,
  total,
  onPay,
  onReset,
}: CheckoutPaymentActionsProps) {
  const { theme } = useUnistyles();

  return (
    <>
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
            style={[styles.payButton, styles.retryPayButton]}
            onPress={onPay}
            disabled={isInitializing}
          >
            {isInitializing ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={theme.colors.surface}
                  style={styles.payIcon}
                />
                <Text style={styles.payButtonText}>Try Again</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onReset}>
            <Text style={styles.secondaryButtonText}>Use a Different Card</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.payButton}
          onPress={onPay}
          disabled={isInitializing}
        >
          {isInitializing ? (
            <ActivityIndicator color={theme.colors.surface} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={theme.colors.surface}
                style={styles.payIcon}
              />
              <Text style={styles.payButtonText}>
                Pay ${total.toFixed(2)} CAD
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      <View style={styles.footerBranding}>
        <Text style={styles.poweredByText}>
          Powered by <Text style={styles.brandText}>stripe</Text>
        </Text>
        <MaterialCommunityIcons
          name="information-outline"
          size={14}
          color={theme.colors.text}
          style={styles.footerInfoIcon}
        />
      </View>
      <Text style={styles.termsText}>
        By continuing, you agree to our{" "}
        <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
        <Text style={styles.termsLink}>Privacy Policy</Text>.
      </Text>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  securityBanner: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  securityIconContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    marginRight: theme.spacing.md,
    width: 28,
  },
  securityText: {
    color: theme.colors.primary,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  payButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    height: 54,
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  retryPayButton: {
    marginBottom: theme.spacing.md,
  },
  payIcon: {
    marginRight: theme.spacing.sm,
  },
  payButtonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    height: 54,
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  footerBranding: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  poweredByText: {
    color: theme.colors.text,
    fontSize: 12,
    opacity: 0.7,
  },
  brandText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  footerInfoIcon: {
    marginLeft: 4,
    opacity: 0.6,
  },
  termsText: {
    color: theme.colors.text,
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.6,
    textAlign: "center",
  },
  termsLink: {
    color: theme.colors.primary,
  },
}));
