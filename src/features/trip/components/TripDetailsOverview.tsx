import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { TripDetailsResponse } from "../types/trip";

export function TripDetailsOverview({ trip }: { trip: TripDetailsResponse }) {
  const { theme } = useUnistyles();
  const status = trip.status.toLowerCase().replace(/[_-]+/g, " ");
  const progress =
    status === "completed"
      ? 3
      : status === "delivering"
        ? 2
        : status === "shopping"
          ? 1
          : 0;

  return (
    <>
      <View style={styles.overview}>
        <View style={styles.overviewMain}>
          <Text style={styles.tripBadge}>{status.toUpperCase()}</Text>
          <View style={styles.route}>
            <Text style={styles.routeText}>{trip.origin}</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={17}
              color={theme.colors.text}
            />
            <Text style={styles.routeText}>{trip.destination}</Text>
          </View>
          <View style={styles.departureInfo}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={14}
              color={theme.colors.text}
            />
            <Text style={styles.departureText}>
              {formatDate(trip.departureAt)}
            </Text>
            <View style={styles.metaDivider} />
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color={theme.colors.text}
            />
            <Text style={styles.departureText}>
              Deliver by {formatDate(trip.deliveryLatestBy)}{" "}
              {formatTime(trip.deliveryLatestBy)}
            </Text>
          </View>
        </View>
        <View style={styles.earnings}>
          <Text style={styles.mutedLabel}>Trip Price</Text>
          <Text style={styles.earningsValue}>{trip.price ?? "-"}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.timeline}>
          <TimelineStep
            label="Accepted"
            time={formatTime(trip.createdAt)}
            complete
          />
          <TimelineStep label="Shopping" time="--" complete={progress >= 1} />
          <TimelineStep label="Delivering" time="--" complete={progress >= 2} />
          <TimelineStep
            label="Completed"
            time="--"
            complete={progress >= 3}
            last
          />
        </View>
      </View>
    </>
  );
}

function TimelineStep({
  label,
  time,
  complete = false,
  last = false,
}: {
  label: string;
  time: string;
  complete?: boolean;
  last?: boolean;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.timelineStep}>
      <View style={styles.timelineMarkerRow}>
        {complete ? (
          <View style={styles.completeMarker}>
            <MaterialCommunityIcons
              name="check"
              size={10}
              color={theme.colors.onPrimary}
            />
          </View>
        ) : (
          <View style={styles.pendingMarker} />
        )}
        {!last ? (
          <View
            style={[
              styles.timelineLine,
              complete && styles.timelineLineComplete,
            ]}
          />
        ) : null}
      </View>
      <Text style={styles.timelineLabel}>{label}</Text>
      <Text style={styles.timelineTime}>{time}</Text>
    </View>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create((theme) => ({
  overview: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: theme.spacing.xs,
  },
  overviewMain: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  tripBadge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    color: theme.colors.onPrimary,
    fontSize: 9,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  route: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  routeText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  departureInfo: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  departureText: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  metaDivider: {
    backgroundColor: theme.colors.border,
    height: 12,
    marginHorizontal: 3,
    width: 1,
  },
  earnings: {
    alignItems: "flex-end",
    gap: 3,
    paddingLeft: theme.spacing.xs,
  },
  mutedLabel: {
    color: theme.colors.muted,
    fontSize: 9,
  },
  earningsValue: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    overflow: "hidden",
    paddingHorizontal: theme.spacing.sm,
  },
  timeline: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: theme.spacing.sm,
  },
  timelineStep: {
    alignItems: "center",
    flex: 1,
  },
  timelineMarkerRow: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    height: 18,
  },
  completeMarker: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    height: 16,
    justifyContent: "center",
    width: 16,
    zIndex: 1,
  },
  pendingMarker: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.muted,
    borderRadius: 7,
    borderWidth: 1,
    height: 14,
    width: 14,
    zIndex: 1,
  },
  timelineLine: {
    backgroundColor: theme.colors.border,
    flex: 1,
    height: 1,
    marginLeft: -1,
  },
  timelineLineComplete: {
    backgroundColor: theme.colors.primary,
  },
  timelineLabel: {
    color: theme.colors.text,
    fontSize: 9,
    fontWeight: "600",
    marginTop: theme.spacing.xs,
  },
  timelineTime: {
    color: theme.colors.muted,
    fontSize: 8,
    marginBottom: theme.spacing.sm,
    marginTop: 2,
  },
}));
