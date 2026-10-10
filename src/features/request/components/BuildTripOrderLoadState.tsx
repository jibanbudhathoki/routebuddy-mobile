import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface BuildTripOrderLoadStateProps {
  isLoading: boolean;
  error?: string;
  hasTripUid: boolean;
  onRetry: () => void;
}

export function BuildTripOrderLoadState({
  isLoading,
  error,
  hasTripUid,
  onRetry,
}: BuildTripOrderLoadStateProps) {
  const { theme } = useUnistyles();

  if (isLoading) {
    return (
      <ActivityIndicator
        color={theme.colors.primary}
        size="large"
        style={styles.loading}
      />
    );
  }

  return (
    <View style={styles.stateCard}>
      <Text style={styles.stateTitle}>Could not load trip details</Text>
      <Text style={styles.stateText}>
        {error ?? "Trip details are unavailable."}
      </Text>
      {hasTripUid ? (
        <TouchableOpacity accessibilityRole="button" onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  loading: {
    marginTop: theme.spacing.xl,
  },
  stateCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  stateTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  stateText: {
    color: theme.colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
  retryText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
    padding: theme.spacing.xs,
  },
}));
