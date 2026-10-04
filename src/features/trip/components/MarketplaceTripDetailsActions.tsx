import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface MarketplaceTripDetailsActionsProps {
  onBuildShoppingList: () => void;
  onMessageDriver: () => void;
}

export function MarketplaceTripDetailsActions({
  onBuildShoppingList,
  onMessageDriver,
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
        style={styles.secondaryButton}
      >
        <MaterialCommunityIcons
          name="message-outline"
          size={17}
          color={theme.colors.primary}
        />
        <Text style={styles.secondaryButtonText}>Message Driver</Text>
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
    fontSize: 11,
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
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "600",
  },
}));
