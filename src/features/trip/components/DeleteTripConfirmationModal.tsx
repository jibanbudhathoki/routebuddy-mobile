import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface DeleteTripConfirmationModalProps {
  visible: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteTripConfirmationModal({
  visible,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteTripConfirmationModalProps) {
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
          accessibilityLabel="Dismiss delete confirmation"
          disabled={isDeleting}
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
              name="trash-can-outline"
              size={26}
              color={theme.colors.error}
            />
          </View>
          <Text style={styles.title}>Delete Trip?</Text>
          <Text style={styles.message}>
            Are you sure you want to delete this trip? This action cannot be
            undone.
          </Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isDeleting}
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelLabel}>Keep Trip</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isDeleting, busy: isDeleting }}
              disabled={isDeleting}
              onPress={onConfirm}
              style={[styles.button, styles.deleteButton]}
            >
              {isDeleting ? (
                <Text style={styles.deleteLabel}>Deleting...</Text>
              ) : (
                <Text style={styles.deleteLabel}>Delete Trip</Text>
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
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  deleteLabel: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: "700",
  },
}));
