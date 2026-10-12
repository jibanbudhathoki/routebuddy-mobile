import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const REACTION_OPTIONS = ["❤️", "👍", "😂", "😮", "😢", "🙏"];

interface SelectedMessageReactionsProps {
  disabled: boolean;
  onReact: (emoji: string) => void;
}

export function SelectedMessageReactions({
  disabled,
  onReact,
}: SelectedMessageReactionsProps) {
  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <View style={styles.container} accessibilityLabel="Reaction options">
        <Text style={styles.label}>React</Text>
        {REACTION_OPTIONS.map((emoji) => (
          <Pressable
            key={emoji}
            accessibilityRole="button"
            accessibilityLabel={`React with ${emoji}`}
            disabled={disabled}
            onPress={() => onReact(emoji)}
            style={({ pressed }) => [
              styles.reaction,
              pressed && !disabled && styles.pressed,
              disabled && styles.disabled,
            ]}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10,
  },
  container: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  reaction: {
    alignItems: "center",
    borderRadius: theme.radius.sm,
    height: 36,
    justifyContent: "center",
    minWidth: 36,
  },
  pressed: {
    backgroundColor: theme.colors.primarySoft,
  },
  disabled: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 22,
  },
}));
