import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestDetailsResponse } from "../types/request";
import { formatRequestDate, formatRequestTime } from "../utils/requestFormatters";

export function RequestDetailsOverview({
  request,
}: {
  request: RequestDetailsResponse;
}) {
  const { theme } = useUnistyles();
  const store = request.stores?.[0];
  const requesterName = request.requester?.name || "Requester";

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        <View style={styles.storeLogo}>
          <Text style={styles.storeInitials}>
            {getInitials(store?.name ?? "Store")}
          </Text>
          {store?.name ? (
            <Text style={styles.logoLabel} numberOfLines={1}>
              {store.name}
            </Text>
          ) : null}
        </View>

        <View style={styles.requestInfo}>
          <Text style={styles.requesterName} numberOfLines={1}>
            {requesterName}
          </Text>
          <View style={styles.routeRow}>
            <Text style={styles.routeText}>
              {formatRouteLocation(request.origin, request)}
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={16}
              color={theme.colors.text}
            />
            <Text style={styles.routeText}>
              {formatRouteLocation(request.destination, request)}
            </Text>
          </View>
          <View style={styles.dateRows}>
            <DateLine label="Needed" value={request.neededBy} />
            <DateLine label="Latest" value={request.latestDeliveryBy} />
          </View>
        </View>
        <View style={styles.total}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount} numberOfLines={1}>
            {request.total ?? "-"}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <MetaItem
          icon="shopping-outline"
          label={`${request.items?.length ?? 0} items`}
        />
        <View style={styles.divider} />
        <MetaItem
          icon="store-outline"
          label={`${request.stores?.length ?? 0} stores`}
        />
      </View>
    </View>
  );
}

function DateLine({ label, value }: { label: string; value: string }) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.dateRow}>
      <MaterialCommunityIcons
        name="calendar-clock-outline"
        size={12}
        color={theme.colors.muted}
      />
      <Text style={styles.dateText}>
        {label}: {formatRequestDate(value)} at {formatRequestTime(value)}
      </Text>
    </View>
  );
}

function MetaItem({ icon, label }: { icon: string; label: string }) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.metaItem}>
      <MaterialCommunityIcons
        name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
        size={13}
        color={theme.colors.primary}
      />
      <Text style={styles.metaText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function formatRouteLocation(name: string, request: RequestDetailsResponse) {
  const locations = [
    request.deliveryLocation,
    ...(request.stores ?? []).map((store) => store.location),
  ];
  const location = locations.find(
    (candidate) =>
      candidate?.city?.name?.toLowerCase() === name.trim().toLowerCase(),
  );

  if (!location) return name;

  return [
    location.country?.name,
    location.province?.name,
    location.city?.name,
  ]
    .filter(Boolean)
    .join(" ");
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    padding: theme.spacing.sm,
  },
  mainRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 62,
  },
  storeLogo: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    height: 56,
    justifyContent: "center",
    padding: 3,
    width: 50,
  },
  storeInitials: {
    color: theme.colors.onPrimary,
    fontSize: 15,
    fontWeight: "800",
  },
  logoLabel: {
    color: theme.colors.onPrimary,
    fontSize: 6,
    fontWeight: "700",
  },
  requestInfo: {
    flex: 1,
    gap: 5,
    minWidth: 0,
  },
  requesterName: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "700",
  },
  routeRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  routeText: {
    color: theme.colors.text,
    flex: 1,
    flexShrink: 1,
    fontSize: 10,
    fontWeight: "600",
  },
  dateRows: {
    gap: 2,
  },
  dateRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  dateText: {
    color: theme.colors.muted,
    fontSize: 8,
  },
  total: {
    alignItems: "flex-end",
    maxWidth: 86,
  },
  totalLabel: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  totalAmount: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 3,
  },
  metaRow: {
    alignItems: "center",
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  metaItem: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    minWidth: 0,
  },
  metaText: {
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: 8,
  },
  divider: {
    backgroundColor: theme.colors.border,
    height: 16,
    width: 1,
  },
}));
