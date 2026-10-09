import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { MyRequestListItem } from "../types/request";

interface MyRequestCardProps {
  request: MyRequestListItem;
  onViewDetails: (request: MyRequestListItem) => void;
}

export function MyRequestCard({
  request,
  onViewDetails,
}: MyRequestCardProps) {
  const { theme } = useUnistyles();
  const stores = request.stores ?? [];
  const neededDate = formatUtcDate(request.neededBy);
  const neededTime = formatUtcTime(request.neededBy);
  const totalCost = request.totalCost ?? "-";
  const status = request.status.replace(/[_-]+/g, " ").toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.summary}>
        <StoreLogo name={stores[0] ?? "Store"} />
        <View style={styles.requestInfo}>
          <Text style={styles.statusBadge}>{status}</Text>
          <View style={styles.routeRow}>
            <Text style={styles.location} numberOfLines={1}>
              {request.origin || request.deliveryCity}
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={15}
              color={theme.colors.text}
            />
            <Text style={styles.location} numberOfLines={1}>
              {request.destination || request.deliveryCity}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={12}
              color={theme.colors.muted}
            />
            <Text style={styles.dateText}>{neededDate}</Text>
            <MaterialCommunityIcons
              name="clock-outline"
              size={12}
              color={theme.colors.muted}
            />
            <Text style={styles.dateText}>{neededTime}</Text>
          </View>
        </View>
        <View style={styles.cost}>
          <Text style={styles.costLabel}>Total</Text>
          <Text style={styles.costValue} numberOfLines={1}>
            {totalCost}
          </Text>
        </View>
      </View>

      {stores.length > 0 ? (
        <View style={styles.storeList}>
          {stores.slice(0, 4).map((store, index) => (
            <StoreTag key={`${store}-${index}`} name={store} index={index} />
          ))}
          {stores.length > 4 ? (
            <View style={styles.moreStores}>
              <Text style={styles.moreStoresText}>+{stores.length - 4}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.metadata}>
        <View style={styles.metadataItem}>
          <MaterialCommunityIcons
            name="store-outline"
            size={13}
            color={theme.colors.primary}
          />
          <Text style={styles.metadataText}>
            {stores.length} {stores.length === 1 ? "Store" : "Stores"}
          </Text>
        </View>
        <View style={styles.metadataDivider} />
        <View style={styles.metadataItem}>
          <MaterialCommunityIcons
            name="account-outline"
            size={13}
            color={theme.colors.primary}
          />
          <Text style={styles.metadataText} numberOfLines={1}>
            {request.driver?.name ?? "Driver pending"}
          </Text>
        </View>
        <View style={styles.metadataDivider} />
        <View style={styles.metadataItem}>
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={13}
            color={theme.colors.primary}
          />
          <Text style={styles.metadataText}>
            By {formatUtcDate(request.latestDeliveryBy)}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => onViewDetails(request)}
        style={styles.detailsButton}
      >
        <Text style={styles.detailsText}>View Request Details</Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={17}
          color={theme.colors.primary}
        />
      </Pressable>
    </View>
  );
}

function StoreLogo({ name }: { name: string }) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.logo}>
      <MaterialCommunityIcons
        name="storefront-outline"
        size={24}
        color={theme.colors.onPrimary}
      />
      <Text style={styles.logoText} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

function StoreTag({ name, index }: { name: string; index: number }) {
  const { theme } = useUnistyles();
  const backgrounds = [
    theme.colors.primarySoft,
    theme.colors.secondary,
    theme.colors.primary,
    theme.colors.primaryRaised,
  ];
  const foreground =
    index % backgrounds.length < 2
      ? theme.colors.primary
      : theme.colors.onPrimary;

  return (
    <View
      style={[
        styles.storeTag,
        { backgroundColor: backgrounds[index % backgrounds.length] },
      ]}
    >
      <MaterialCommunityIcons
        name="storefront-outline"
        size={12}
        color={foreground}
      />
      <Text style={[styles.storeTagText, { color: foreground }]} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );
}

function formatUtcDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatUtcTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    elevation: 2,
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  summary: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 58,
  },
  logo: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    height: 54,
    justifyContent: "center",
    padding: 3,
    width: 48,
  },
  logoText: {
    color: theme.colors.onPrimary,
    fontSize: 6,
    fontWeight: "700",
    textAlign: "center",
  },
  requestInfo: {
    flex: 1,
    gap: 5,
    minWidth: 0,
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    color: theme.colors.onPrimary,
    fontSize: 8,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  routeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  location: {
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: 10,
    fontWeight: "600",
  },
  dateRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  dateText: {
    color: theme.colors.muted,
    fontSize: 8,
    marginRight: theme.spacing.xs,
  },
  cost: {
    alignItems: "flex-end",
    justifyContent: "center",
    maxWidth: 86,
  },
  costLabel: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  costValue: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 3,
  },
  storeList: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  storeTag: {
    alignItems: "center",
    borderRadius: 5,
    flex: 1,
    gap: 3,
    height: 38,
    justifyContent: "center",
    minWidth: 0,
    paddingHorizontal: 3,
  },
  storeTagText: {
    fontSize: 7,
    fontWeight: "700",
    textAlign: "center",
  },
  moreStores: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: 5,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 32,
  },
  moreStoresText: {
    color: theme.colors.primary,
    fontSize: 9,
    fontWeight: "700",
  },
  metadata: {
    alignItems: "center",
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing.sm,
  },
  metadataItem: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    minWidth: 0,
  },
  metadataText: {
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: 8,
  },
  metadataDivider: {
    backgroundColor: theme.colors.border,
    height: 16,
    width: 1,
  },
  detailsButton: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 6,
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 34,
  },
  detailsText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "600",
  },
}));
