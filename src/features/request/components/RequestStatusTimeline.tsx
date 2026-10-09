import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestDetailsResponse } from "../types/request";
import { formatRequestDate, formatRequestTime } from "../utils/requestFormatters";

const statusSteps = [
  { label: "Placed", icon: "check" },
  { label: "Shopping", icon: "cart-outline" },
  { label: "Delivering", icon: "car-outline" },
  { label: "Completed", icon: "flag-checkered" },
] as const;

export function RequestStatusTimeline({
  request,
}: {
  request: RequestDetailsResponse;
}) {
  const { theme } = useUnistyles();
  const currentStep = getCurrentStep(request.status);

  return (
    <View>
      <Text style={styles.heading}>Status</Text>
      <View style={styles.card}>
        <View style={styles.steps}>
          {statusSteps.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;
            const isActive = isComplete || isCurrent;

            return (
              <View key={step.label} style={styles.step}>
                <View style={styles.markerRow}>
                  <View
                    style={[
                      styles.marker,
                      isActive && styles.markerActive,
                      isCurrent && styles.markerCurrent,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={step.icon}
                      size={14}
                      color={isActive ? theme.colors.onPrimary : theme.colors.muted}
                    />
                  </View>
                  {index < statusSteps.length - 1 ? (
                    <View
                      style={[
                        styles.connector,
                        isComplete && styles.connectorActive,
                      ]}
                    />
                  ) : null}
                </View>
                <Text style={[styles.stepLabel, isCurrent && styles.currentLabel]}>
                  {step.label}
                </Text>
                <Text style={styles.stepTime} numberOfLines={2}>
                  {index === 0
                    ? `${formatRequestDate(request.createdAt)}\n${formatRequestTime(request.createdAt)}`
                    : isCurrent && index > 0
                      ? "In progress"
                      : "--"}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function getCurrentStep(status: string) {
  switch (status.toLowerCase()) {
    case "shopping":
      return 1;
    case "delivering":
      return 2;
    case "completed":
      return 3;
    default:
      return 0;
  }
}

const styles = StyleSheet.create((theme) => ({
  heading: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
  },
  steps: {
    flexDirection: "row",
  },
  step: {
    alignItems: "center",
    flex: 1,
  },
  markerRow: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
  },
  marker: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 18,
    height: 28,
    justifyContent: "center",
    width: 28,
    zIndex: 1,
  },
  markerActive: {
    backgroundColor: theme.colors.primary,
  },
  markerCurrent: {
    borderColor: theme.colors.primarySoft,
    borderWidth: 3,
    height: 32,
    marginLeft: -2,
    marginTop: -2,
    width: 32,
  },
  connector: {
    backgroundColor: theme.colors.border,
    flex: 1,
    height: 2,
    marginLeft: -1,
  },
  connectorActive: {
    backgroundColor: theme.colors.primary,
  },
  stepLabel: {
    color: theme.colors.muted,
    fontSize: 8,
    marginTop: theme.spacing.xs,
  },
  currentLabel: {
    color: theme.colors.text,
    fontWeight: "700",
  },
  stepTime: {
    color: theme.colors.muted,
    fontSize: 7,
    lineHeight: 10,
    marginBottom: theme.spacing.sm,
    marginTop: 2,
    textAlign: "center",
  },
}));
