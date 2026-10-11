import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestOffer } from "../types/request";
import { formatRequestDate, formatRequestTime } from "../utils/requestFormatters";

interface RequestOfferCardProps {
  offer: RequestOffer;
  canAccept: boolean;
  isAccepting: boolean;
  isAnyOfferAccepting: boolean;
  onAccept: () => void;
}

export function RequestOfferCard({
  offer,
  canAccept,
  isAccepting,
  isAnyOfferAccepting,
  onAccept,
}: RequestOfferCardProps) {
  const { theme } = useUnistyles();
  const driverName = offer.driver.name ?? offer.driver.fName ?? "Driver";
  const initials = driverName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const isPending = offer.status.toLowerCase() === "pending";

  return (
    <View style={styles.offerCard}>
      <View style={styles.driverHeader}>
        {offer.driver.photoUrl ? (
          <Image
            source={{ uri: offer.driver.photoUrl }}
            contentFit="cover"
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        )}
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driverName}</Text>
          {offer.driver.rating != null ? (
            <View style={styles.ratingRow}>
              <MaterialCommunityIcons
                name="star"
                size={13}
                color={theme.colors.primary}
              />
              <Text style={styles.ratingText}>
                {offer.driver.rating.toFixed(1)}
              </Text>
            </View>
          ) : null}
        </View>
        <View
          style={[
            styles.statusBadge,
            isPending ? styles.pendingBadge : styles.otherBadge,
          ]}
        >
          <Text style={styles.statusText}>{offer.status}</Text>
        </View>
      </View>

      <View style={styles.proposedTime}>
        <MaterialCommunityIcons
          name="calendar-clock-outline"
          size={17}
          color={theme.colors.primary}
        />
        <View>
          <Text style={styles.detailLabel}>Proposed delivery by</Text>
          <Text style={styles.detailValue}>
            {formatRequestDate(offer.proposedLatestBy)} at{" "}
            {formatRequestTime(offer.proposedLatestBy)}
          </Text>
        </View>
      </View>

      <View style={styles.messageBlock}>
        <Text style={styles.detailLabel}>Driver’s message</Text>
        <Text style={styles.offerMessage}>
          {offer.message?.trim() || "No message provided."}
        </Text>
      </View>

      {offer.createdAt ? (
        <Text style={styles.createdAt}>
          Received {formatRequestDate(offer.createdAt)} at{" "}
          {formatRequestTime(offer.createdAt)}
        </Text>
      ) : null}

      {isPending ? (
        <>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={!canAccept || isAnyOfferAccepting}
              onPress={onAccept}
              style={[
                styles.acceptButton,
                (!canAccept || isAnyOfferAccepting) && styles.disabledButton,
              ]}
            >
              {isAccepting ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.onPrimary}
                />
              ) : (
                <MaterialCommunityIcons
                  name="check"
                  size={16}
                  color={theme.colors.onPrimary}
                />
              )}
              <Text style={styles.acceptText}>
                {isAccepting ? "Accepting..." : "Accept"}
              </Text>
            </Pressable>
            <Pressable
              disabled
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              style={styles.rejectButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={16}
                color={theme.colors.muted}
              />
              <Text style={styles.rejectText}>Reject</Text>
            </Pressable>
          </View>
          <Text style={styles.rejectNotice}>
            Reject is unavailable until the service supports declining an
            individual offer.
          </Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  offerCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  driverHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  driverInfo: {
    flex: 1,
    gap: 2,
  },
  driverName: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  statusBadge: {
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  pendingBadge: {
    backgroundColor: theme.colors.primarySoft,
  },
  otherBadge: {
    backgroundColor: theme.colors.background,
  },
  statusText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  proposedTime: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  detailLabel: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  detailValue: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  messageBlock: {
    gap: 3,
  },
  offerMessage: {
    color: theme.colors.text,
    fontSize: 12,
    lineHeight: 17,
  },
  createdAt: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  acceptButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    height: 40,
    justifyContent: "center",
  },
  acceptText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
  rejectButton: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    height: 40,
    justifyContent: "center",
    opacity: 0.7,
  },
  rejectText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.55,
  },
  rejectNotice: {
    color: theme.colors.muted,
    fontSize: 10,
    lineHeight: 14,
  },
}));
