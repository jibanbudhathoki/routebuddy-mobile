import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface MarketplaceTripDetailsActionsProps {
  onBuildShoppingList: () => void;
  onMessageDriver: () => void;
  isMessagingDriver?: boolean;
}

export function MarketplaceTripDetailsActions({
  onBuildShoppingList,
  onMessageDriver,
  isMessagingDriver = false,
}: MarketplaceTripDetailsActionsProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.footer}>
      <Pressable
        accessibilityRole="button"
        onPress={onBuildShoppingList}
        style={styles.primaryButton}
      >
        <MaterialCommunityIcons
          name="cart-outline"
          size={18}
          color={theme.colors.onPrimary}
        />
        <Text style={styles.primaryButtonText}>Build Shopping List</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onMessageDriver}
        disabled={isMessagingDriver}
        style={[
          styles.secondaryButton,
          isMessagingDriver && styles.disabledButton,
        ]}
      >
        {isMessagingDriver ? (
          <ActivityIndicator size="small" color={theme.colors.text} />
        ) : (
          <MaterialCommunityIcons
            name="message-outline"
            size={17}
            color={theme.colors.text}
          />
        )}
        <Text style={styles.secondaryButtonText}>
          {isMessagingDriver ? "Opening Conversation..." : "Message Driver"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  footer: {
    backgroundColor: theme.colors.background,
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    gap: theme.spacing.sm,
    height: 40,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    height: 36,
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.65,
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
}));
