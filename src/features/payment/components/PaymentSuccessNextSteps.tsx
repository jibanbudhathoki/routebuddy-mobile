import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface PaymentSuccessNextStepsProps {
  onGoHome: () => void;
  isRequestPublished?: boolean;
}

export function PaymentSuccessNextSteps({
  onGoHome,
  isRequestPublished = false,
}: PaymentSuccessNextStepsProps) {
  const { theme } = useUnistyles();

  return (
    <>
      {isRequestPublished ? (
        <View style={styles.securityBanner}>
          <View style={styles.securityIconContainer}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={24}
              color={theme.colors.surface}
            />
          </View>
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>Your request is open</Text>
            <Text style={styles.securityText}>
              Review offers from drivers and choose the one that works best for you.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.securityBanner}>
          <View style={styles.securityIconContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              color={theme.colors.surface}
            />
          </View>
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>Your payment is secure</Text>
            <Text style={styles.securityText}>
              Your funds are held in escrow and will only be released once
              delivery is confirmed by both parties.
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>What happens next?</Text>
      <View style={styles.timeline}>
        <TimelineItem
          icon={isRequestPublished ? "account-search-outline" : "cart-outline"}
          title={
            isRequestPublished
              ? "Drivers review your request"
              : "Shopper shops your order"
          }
          description={
            isRequestPublished
              ? "Drivers can send you offers with their delivery details."
              : "You'll be notified when your shopper starts shopping."
          }
          isLast={false}
        />
        <TimelineItem
          icon={isRequestPublished ? "email-outline" : "truck-outline"}
          title={isRequestPublished ? "Choose an offer" : "Order is on the way"}
          description={
            isRequestPublished
              ? "Compare offers and accept the one that fits your needs."
              : "Track progress and communicate with your shopper in chat."
          }
          isLast={false}
        />
        <TimelineItem
          icon={
            isRequestPublished
              ? "message-text-outline"
              : "package-variant-closed-check"
          }
          title={isRequestPublished ? "Stay in touch" : "Order is delivered"}
          description={
            isRequestPublished
              ? "Message your selected driver to coordinate delivery."
              : "Confirm delivery and your payment will be released to your shopper."
          }
          isLast
        />
      </View>

      {!isRequestPublished ? (
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>View Order Details</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity style={styles.secondaryButton} onPress={onGoHome}>
        <Text style={styles.secondaryButtonText}>Go to Home</Text>
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <MaterialCommunityIcons
          name="email-outline"
          size={16}
          color={theme.colors.text}
        />
        <Text style={styles.footerText}>
          {isRequestPublished
            ? "You'll be notified when drivers send offers."
            : "A receipt has been sent to your email."}
        </Text>
      </View>
    </>
  );
}

function TimelineItem({
  icon,
  title,
  description,
  isLast,
}: {
  icon:
    | "cart-outline"
    | "truck-outline"
    | "package-variant-closed-check"
    | "account-search-outline"
    | "email-outline"
    | "message-text-outline";
  title: string;
  description: string;
  isLast: boolean;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={[styles.timelineItem, isLast && styles.lastTimelineItem]}>
      <View style={styles.timelineIconContainer}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={theme.colors.text}
        />
      </View>
      {!isLast ? <View style={styles.timelineLine} /> : null}
      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineText}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  securityBanner: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
  },
  securityIconContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    marginRight: theme.spacing.md,
    width: 40,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  securityText: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "bold",
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
  lastTimelineItem: {
    marginBottom: 0,
  },
  timelineIconContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    marginRight: theme.spacing.md,
    width: 44,
    zIndex: 2,
  },
  timelineLine: {
    backgroundColor: theme.colors.border,
    borderStyle: "dashed",
    bottom: -24,
    left: 21,
    position: "absolute",
    top: 44,
    width: 2,
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    justifyContent: "center",
  },
  timelineTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  timelineText: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.7,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    height: 54,
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: 16,
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
    marginBottom: theme.spacing.md,
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  footerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.sm,
  },
  footerText: {
    color: theme.colors.text,
    fontSize: 12,
    marginLeft: theme.spacing.xs,
    opacity: 0.7,
  },
}));
