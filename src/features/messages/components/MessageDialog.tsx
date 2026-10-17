import { Modal, Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export interface MessageDialogAction {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface MessageDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  actions: MessageDialogAction[];
  onDismiss: () => void;
}

export function MessageDialog({
  visible,
  title,
  message,
  actions,
  onDismiss,
}: MessageDialogProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <View style={styles.scrim} pointerEvents="none" />
        <Pressable style={styles.dialog} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            {actions.map((action) => (
              <Pressable
                key={action.label}
                accessibilityRole="button"
                onPress={() => {
                  onDismiss();
                  action.onPress();
                }}
                style={[
                  styles.action,
                  action.destructive && styles.destructiveAction,
                ]}
              >
                <Text
                  style={[
                    styles.actionText,
                    action.destructive && styles.destructiveText,
                  ]}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  backdrop: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  scrim: {
    backgroundColor: theme.colors.overlay,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  dialog: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    elevation: 12,
    maxWidth: 400,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    width: "100%",
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
  },
  message: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "center",
    marginTop: theme.spacing.lg,
  },
  action: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
  },
  destructiveAction: {
    backgroundColor: theme.colors.error,
  },
  actionText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  destructiveText: {
    color: theme.colors.onPrimary,
  },
}));
