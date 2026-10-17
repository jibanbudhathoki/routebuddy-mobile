import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  confirmLabel: string;
  cancelLabel: string;
  isLoading?: boolean;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmationDialog({
  visible,
  title,
  message,
  icon,
  confirmLabel,
  cancelLabel,
  isLoading = false,
  destructive = false,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  const { theme } = useUnistyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss confirmation"
          disabled={isLoading}
          onPress={onCancel}
          style={styles.backdrop}
        />
        <View
          accessibilityRole="alert"
          accessibilityViewIsModal
          style={styles.dialog}
        >
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name={icon}
              size={26}
              color={destructive ? theme.colors.error : theme.colors.text}
            />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isLoading }}
              disabled={isLoading}
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelLabel}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
              disabled={isLoading}
              onPress={onConfirm}
              style={[
                styles.button,
                destructive ? styles.destructiveButton : styles.confirmButton,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.onPrimary} />
              ) : (
                <Text style={styles.confirmLabel}>{confirmLabel}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  backdrop: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  dialog: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    maxWidth: 400,
    padding: theme.spacing.lg,
    width: "100%",
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  title: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
    width: "100%",
  },
  button: {
    alignItems: "center",
    borderRadius: theme.radius.sm,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: theme.spacing.xs,
  },
  cancelButton: {
    backgroundColor: theme.colors.primarySoft,
  },
  cancelLabel: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
  },
  destructiveButton: {
    backgroundColor: theme.colors.error,
  },
  confirmLabel: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
}));
