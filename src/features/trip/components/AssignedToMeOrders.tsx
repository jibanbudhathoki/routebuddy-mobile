import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { useListMyAssignedRequests } from "../../request/hooks/useListMyAssignedRequests";
import { RequesterAvatar } from "./TripOrdersSection";
import { styles } from "./assignedToMeOrders.styles";

export function AssignedToMeOrders() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const {
    data: orders = [],
    error,
    isLoading,
    refetch,
  } = useListMyAssignedRequests();

  if (isLoading) {
    return (
      <View style={styles.stateCard}>
        <ActivityIndicator color={theme.colors.text} />
        <Text style={styles.stateText}>Loading orders assigned to you...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateCard}>
        <Text style={styles.stateTitle}>Could not load assigned orders</Text>
        <Text style={styles.stateText}>
          {error instanceof Error ? error.message : "Please try again."}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => void refetch()}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  if (!orders.length) {
    return (
      <View style={styles.stateCard}>
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={30}
          color={theme.colors.muted}
        />
        <Text style={styles.stateTitle}>No orders assigned to you</Text>
        <Text style={styles.stateText}>
          Requests and orders assigned to you will show up here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.orderList}>
      {orders.map((order) => (
        <Pressable
          key={order.uid}
          accessibilityRole="button"
          accessibilityLabel={`View order from ${order.requester.name}`}
          onPress={() =>
            router.push({
              pathname: "/trip-order/[uid]",
              params: { uid: order.uid },
            })
          }
          style={({ pressed }) => [
            styles.orderCard,
            pressed && styles.orderCardPressed,
          ]}
        >
          <RequesterAvatar
            name={order.requester.name}
            photoUrl={order.requester.photoUrl ?? null}
          />
          <View style={styles.orderSummary}>
            <Text numberOfLines={1} style={styles.requesterName}>
              {order.requester.name}
            </Text>
            <Text numberOfLines={1} style={styles.route}>
              {order.origin} → {order.destination}
            </Text>
            <Text style={styles.orderStatus}>{formatStatus(order.status)}</Text>
          </View>
          <Text style={styles.total}>{order.totalCost}</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={theme.colors.muted}
          />
        </Pressable>
      ))}
    </View>
  );
}

function formatStatus(status: string) {
  return status.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) =>
    letter.toUpperCase(),
  );
}
