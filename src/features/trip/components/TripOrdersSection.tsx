import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { TripOrder } from "../types/trip";

interface TripOrdersSectionProps {
  orders: TripOrder[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  onSelectOrder: (order: TripOrder) => void;
}

export function TripOrdersSection({
  orders,
  isLoading,
  error,
  onRetry,
  onSelectOrder,
}: TripOrdersSectionProps) {
  const { theme } = useUnistyles();
  const acceptedOrders = orders.filter(
    (order) => order.status.trim().toLowerCase() === "accepted",
  );

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Orders ({acceptedOrders.length})</Text>
      {isLoading ? (
        <View style={styles.stateCard}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.stateText}>Loading orders...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateText}>{error.message}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onRetry}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : acceptedOrders.length === 0 ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateText}>No accepted orders for this trip.</Text>
        </View>
      ) : (
        <View style={styles.orderList}>
          {acceptedOrders.map((order) => (
            <Pressable
              key={order.uid}
              accessibilityRole="button"
              accessibilityLabel={`View order from ${order.requester.name}`}
              onPress={() => onSelectOrder(order)}
              style={({ pressed }) => [
                styles.orderCard,
                pressed && styles.orderCardPressed,
              ]}
            >
              <RequesterAvatar
                name={order.requester.name}
                photoUrl={order.requester.photoUrl}
              />
              <View style={styles.orderSummary}>
                <Text numberOfLines={1} style={styles.requesterName}>
                  {order.requester.name}
                </Text>
                <Text numberOfLines={1} style={styles.route}>
                  {order.origin} → {order.destination}
                </Text>
                <Text style={styles.orderStatus}>
                  {formatStatus(order.status)}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={theme.colors.muted}
              />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export function RequesterAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string | null;
}) {
  return photoUrl ? (
    <Image
      accessibilityLabel={`${name}'s profile photo`}
      contentFit="cover"
      source={{ uri: photoUrl }}
      style={styles.avatar}
    />
  ) : (
    <View style={[styles.avatar, styles.avatarFallback]}>
      <Text style={styles.initials}>{getInitials(name)}</Text>
    </View>
  );
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatStatus(status: string) {
  return status.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) =>
    letter.toUpperCase(),
  );
}

const styles = StyleSheet.create((theme) => ({
  section: {
    gap: theme.spacing.xs,
  },
  title: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  orderList: {
    gap: theme.spacing.xs,
  },
  orderCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 72,
    padding: theme.spacing.sm,
  },
  orderCardPressed: {
    backgroundColor: theme.colors.primarySoft,
  },
  avatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  avatarFallback: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
  },
  initials: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  orderSummary: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  requesterName: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  route: {
    color: theme.colors.muted,
    fontSize: 10,
  },
  orderStatus: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: "600",
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 11,
    textAlign: "center",
  },
  retryButton: {
    padding: theme.spacing.xs,
  },
  retryText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "600",
  },
}));
