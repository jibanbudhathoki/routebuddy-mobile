import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface LogoutConfirmationModalProps {
  visible: boolean;
  isLoggingOut: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmationModal({
  visible,
  isLoggingOut,
  onCancel,
  onConfirm,
}: LogoutConfirmationModalProps) {
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
          accessibilityLabel="Dismiss logout confirmation"
          disabled={isLoggingOut}
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
              name="logout"
              size={26}
              color={theme.colors.error}
            />
          </View>

          <Text style={styles.title}>Log Out?</Text>
          <Text style={styles.message}>
            Are you sure you want to log out? You'll need to sign in again to
            manage your requests and trips.
          </Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isLoggingOut}
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isLoggingOut, busy: isLoggingOut }}
              disabled={isLoggingOut}
              onPress={onConfirm}
              style={[
                styles.button,
                styles.logoutButton,
                isLoggingOut && styles.buttonDisabled,
              ]}
            >
              {isLoggingOut ? (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.onPrimary}
                />
              ) : (
                <Text style={styles.logoutLabel}>Log Out</Text>
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
    maxWidth: 360,
    padding: theme.spacing.lg,
    width: "100%",
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
    width: 56,
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
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
  buttonDisabled: {
    opacity: 0.7,
  },
  cancelButton: {
    backgroundColor: theme.colors.primarySoft,
  },
  cancelLabel: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
  },
  logoutLabel: {
    color: theme.colors.onPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
}));
