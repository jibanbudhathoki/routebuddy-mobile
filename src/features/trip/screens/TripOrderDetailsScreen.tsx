import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { AppScreen } from "../../../shared/components/AppScreen";
import { styles } from "../components/tripOrderDetailsScreen.styles";
import { TripOrderDetailsContent } from "../components/TripOrderDetailsContent";
import { useRequestDetails } from "../../request/hooks/useRequestDetails";

export function TripOrderDetailsScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const params = useLocalSearchParams<{ uid?: string }>();
  const orderUid = typeof params.uid === "string" ? params.uid : "";
  const {
    data: order,
    error,
    isLoading,
    refetch,
  } = useRequestDetails(orderUid);

  return (
    <AppScreen>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              color={theme.colors.text}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.headerButton} />
        </View>

        {isLoading ? (
          <View style={styles.state}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.stateText}>Loading order details...</Text>
          </View>
        ) : error || !order ? (
          <View style={styles.state}>
            <Text style={styles.stateTitle}>Order details unavailable</Text>
            <Text style={styles.stateText}>
              {error?.message ??
                (orderUid
                  ? "This order could not be found."
                  : "Order ID is missing.")}
            </Text>
            {orderUid ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => refetch()}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <TripOrderDetailsContent order={order} />
        )}
      </View>
    </AppScreen>
  );
}
