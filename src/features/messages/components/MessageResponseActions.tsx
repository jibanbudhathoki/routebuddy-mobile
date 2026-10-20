import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestAction } from "../../request/types/request";

interface MessageResponseActionsProps {
  isResponding: boolean;
  respondingAction?: RequestAction;
  onAction: (action: RequestAction) => void;
}

export function MessageResponseActions({
  isResponding,
  respondingAction,
  onAction,
}: MessageResponseActionsProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.actions}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Accept"
        accessibilityState={{
          disabled: isResponding,
          busy: respondingAction === "accept",
        }}
        disabled={isResponding}
        onPress={() => onAction("accept")}
        style={[styles.acceptButton, isResponding && styles.disabledButton]}
      >
        {respondingAction === "accept" ? (
          <ActivityIndicator size="small" color={theme.colors.onPrimary} />
        ) : (
          <MaterialCommunityIcons
            name="check"
            size={16}
            color={theme.colors.onPrimary}
          />
        )}
        <Text style={styles.acceptText}>
          {respondingAction === "accept" ? "Accepting..." : "Accept"}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reject"
        accessibilityState={{
          disabled: isResponding,
          busy: respondingAction === "reject",
        }}
        disabled={isResponding}
        onPress={() => onAction("reject")}
        style={[styles.rejectButton, isResponding && styles.disabledButton]}
      >
        {respondingAction === "reject" ? (
          <ActivityIndicator size="small" color={theme.colors.error} />
        ) : (
          <MaterialCommunityIcons
            name="close"
            size={16}
            color={theme.colors.error}
          />
        )}
        <Text style={styles.rejectText}>
          {respondingAction === "reject" ? "Rejecting..." : "Reject"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  actions: {
    alignSelf: "stretch",
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
    minWidth: 0,
    paddingHorizontal: theme.spacing.xs,
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
    minWidth: 0,
    paddingHorizontal: theme.spacing.xs,
  },
  rejectText: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.65,
  },
}));
