import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface PaymentSuccessHeaderProps {
  total: number;
  conversationError: string;
  isCreatingConversation: boolean;
  onRetryConversation: () => void;
}

export function PaymentSuccessHeader({
  total,
  conversationError,
  isCreatingConversation,
  onRetryConversation,
}: PaymentSuccessHeaderProps) {
  const { theme } = useUnistyles();

  return (
    <>
      <View style={styles.successIconContainer}>
        <View style={styles.successCircle}>
          <MaterialCommunityIcons
            name="check"
            size={60}
            color={theme.colors.surface}
          />
        </View>
        <MaterialCommunityIcons
          name="star-four-points"
          size={16}
          color={theme.colors.primarySoft}
          style={[styles.sparkle, styles.sparkleTopLeft]}
        />
        <MaterialCommunityIcons
          name="star-four-points"
          size={12}
          color={theme.colors.primarySoft}
          style={[styles.sparkle, styles.sparkleMidLeft]}
        />
        <MaterialCommunityIcons
          name="star-four-points"
          size={10}
          color={theme.colors.primarySoft}
          style={[styles.sparkle, styles.sparkleBottomLeft]}
        />
        <MaterialCommunityIcons
          name="star-four-points"
          size={20}
          color={theme.colors.primarySoft}
          style={[styles.sparkle, styles.sparkleTopRight]}
        />
        <MaterialCommunityIcons
          name="star-four-points"
          size={14}
          color={theme.colors.primarySoft}
          style={[styles.sparkle, styles.sparkleMidRight]}
        />
      </View>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.subtitle}>
        Your payment of ${total.toFixed(2)} CAD has been received and is securely
        held in escrow.
      </Text>
      {conversationError ? (
        <View style={styles.conversationError}>
          <Text accessibilityRole="alert" style={styles.conversationErrorText}>
            Payment succeeded, but the driver could not be notified:{" "}
            {conversationError}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isCreatingConversation}
            onPress={onRetryConversation}
          >
            <Text style={styles.conversationRetry}>
              {isCreatingConversation ? "Retrying..." : "Retry"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  successIconContainer: {
    alignItems: "center",
    height: 120,
    justifyContent: "center",
    marginVertical: theme.spacing.lg,
  },
  successCircle: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.surface,
    borderRadius: 50,
    borderWidth: 6,
    elevation: 2,
    height: 100,
    justifyContent: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 100,
  },
  sparkle: {
    position: "absolute",
  },
  sparkleTopLeft: {
    left: 20,
    top: 0,
  },
  sparkleMidLeft: {
    left: -10,
    top: 40,
  },
  sparkleBottomLeft: {
    left: 10,
    top: 80,
  },
  sparkleTopRight: {
    right: 10,
    top: 10,
  },
  sparkleMidRight: {
    right: -15,
    top: 60,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    textAlign: "center",
  },
  conversationError: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.error,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  conversationErrorText: {
    color: theme.colors.error,
    fontSize: 13,
  },
  conversationRetry: {
    alignSelf: "flex-end",
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: theme.spacing.xs,
  },
}));
