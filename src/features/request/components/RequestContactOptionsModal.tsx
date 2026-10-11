import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface RequestContactOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onMessage: () => void;
  onSendOffer: () => void;
}

export function RequestContactOptionsModal({
  visible,
  onClose,
  onMessage,
  onSendOffer,
}: RequestContactOptionsModalProps) {
  const { theme } = useUnistyles();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.scrim} pointerEvents="none" />
        <Pressable
          style={styles.dialog}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={styles.title}>Contact the requester</Text>
          <Text style={styles.subtitle}>
            Choose how you would like to respond to this request.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onMessage}
            style={styles.option}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="message-processing-outline"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>Message</Text>
              <Text style={styles.optionDescription}>
                Start a conversation with the requester.
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={theme.colors.muted}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onSendOffer}
            style={styles.option}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="calendar-check-outline"
                size={22}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>Send offer</Text>
              <Text style={styles.optionDescription}>
                Propose a delivery time and include a note.
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={theme.colors.muted}
            />
          </Pressable>
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
    backgroundColor: theme.colors.text,
    bottom: 0,
    left: 0,
    opacity: 0.45,
    position: "absolute",
    right: 0,
    top: 0,
  },
  dialog: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
    maxWidth: 420,
    padding: theme.spacing.lg,
    width: "100%",
  },
  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: theme.spacing.xs,
  },
  option: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 72,
    padding: theme.spacing.sm,
  },
  iconContainer: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  optionCopy: {
    flex: 1,
    gap: 3,
  },
  optionTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  optionDescription: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 15,
  },
}));
