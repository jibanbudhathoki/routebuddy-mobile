import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { MyRequestListItem } from "../../request/types/request";
import {
  formatRequestDate,
  formatRequestTime,
} from "../../request/utils/requestFormatters";

interface HomeRequestCardProps {
  request: MyRequestListItem;
}

export function HomeRequestCard({ request }: HomeRequestCardProps) {
  const router = useRouter();
  const { theme } = useUnistyles();
  const requesterName = request.requester?.name || "Requester";
  const initials = requesterName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const neededDate = formatRequestDate(request.neededBy);
  const neededTime = formatRequestTime(request.neededBy);
  const latestTime = formatRequestTime(request.latestDeliveryBy);

  return (
    <View style={styles.card}>
      <View style={styles.requesterRow}>
        {request.requester?.photoUrl ? (
          <Image
            source={{ uri: request.requester.photoUrl }}
            style={styles.avatar}
            accessibilityLabel={`${requesterName}'s profile photo`}
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
        )}
        <View style={styles.requesterInfo}>
          <Text style={styles.requesterName} numberOfLines={1}>
            {requesterName}
          </Text>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons
              name="checkbox-blank-circle"
              size={9}
              color={theme.colors.primary}
            />
            <Text style={styles.statusText}>
              {request.status.replace(/[_-]+/g, " ")}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.routeRow}>
        <Text style={styles.route} numberOfLines={1}>
          {request.origin}
        </Text>
        <MaterialCommunityIcons
          name="arrow-right"
          size={16}
          color={theme.colors.primary}
        />
        <Text style={styles.route} numberOfLines={1}>
          {request.destination}
        </Text>
      </View>

      <View style={styles.scheduleRow}>
        <View style={styles.scheduleItem}>
          <MaterialCommunityIcons
            name="calendar-blank-outline"
            size={12}
            color={theme.colors.muted}
          />
          <Text style={styles.scheduleText}>Needed {neededDate}</Text>
        </View>
        <View style={styles.scheduleItem}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={12}
            color={theme.colors.muted}
          />
          <Text style={styles.scheduleText}>{neededTime}</Text>
        </View>
      </View>
      <View style={styles.scheduleRow}>
        <View style={styles.scheduleItem}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={12}
            color={theme.colors.muted}
          />
          <Text style={styles.scheduleText}>
            Deliver by {formatRequestDate(request.latestDeliveryBy)} {latestTime}
          </Text>
        </View>
      </View>

      {request.stores?.length ? (
        <View style={styles.storeRow}>
          {request.stores.slice(0, 5).map((store, index) => (
            <View key={`${store}-${index}`} style={styles.storeTile}>
              <MaterialCommunityIcons
                name="storefront-outline"
                size={17}
                color={theme.colors.primary}
              />
              <Text style={styles.storeName} numberOfLines={2}>
                {store}
              </Text>
            </View>
          ))}
          {request.stores.length > 5 ? (
            <View style={[styles.storeTile, styles.moreStoresTile]}>
              <Text style={styles.moreStoresText}>
                +{request.stores.length - 5}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.cardFooter}>
        <Text style={styles.totalCost} numberOfLines={1}>
          {request.totalCost ?? "-"}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: "/request-details",
              params: { uid: request.uid },
            })
          }
          style={styles.detailsButton}
        >
          <Text style={styles.detailsText}>Request Details</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
            color={theme.colors.onPrimary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    elevation: 2,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  requesterRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 19,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  avatarInitials: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  requesterInfo: {
    flex: 1,
    gap: 2,
  },
  requesterName: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  statusText: {
    color: theme.colors.muted,
    fontSize: 9,
    textTransform: "capitalize",
  },
  routeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  route: {
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  scheduleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  scheduleItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  scheduleText: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  storeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  storeTile: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 6,
    height: 46,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xs,
    width: 46,
  },
  storeName: {
    color: theme.colors.text,
    fontSize: 6,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "center",
  },
  moreStoresTile: {
    backgroundColor: theme.colors.primarySoft,
  },
  moreStoresText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  cardFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
  },
  totalCost: {
    color: theme.colors.primary,
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    marginRight: theme.spacing.sm,
  },
  detailsButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 32,
    paddingHorizontal: theme.spacing.sm,
  },
  detailsText: {
    color: theme.colors.onPrimary,
    fontSize: 10,
    fontWeight: "700",
  },
}));
