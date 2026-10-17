import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface ChatAttachmentMenuProps {
  visible: boolean;
  onClose: () => void;
  onPickImage: () => void;
  onTakePhoto: () => void;
  onPickAudio: () => void;
}

export function ChatAttachmentMenu({
  visible,
  onClose,
  onPickImage,
  onTakePhoto,
  onPickAudio,
}: ChatAttachmentMenuProps) {
  const { theme } = useUnistyles();
  const options = [
    {
      label: "Photo library",
      icon: "image-multiple-outline" as const,
      onPress: onPickImage,
    },
    {
      label: "Take photo",
      icon: "camera-outline" as const,
      onPress: onTakePhoto,
    },
    {
      label: "Audio file",
      icon: "music-note-outline" as const,
      onPress: onPickAudio,
    },
  ];

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.scrim} />
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Add to conversation</Text>
          <View style={styles.options}>
            {options.map((option) => (
              <Pressable
                key={option.label}
                accessibilityRole="button"
                onPress={() => {
                  onClose();
                  option.onPress();
                }}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
              >
                <View style={styles.icon}>
                  <MaterialCommunityIcons
                    name={option.icon}
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
                <Text style={styles.optionText}>{option.label}</Text>
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
    flex: 1,
    justifyContent: "flex-end",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.text,
    opacity: 0.4,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  handle: {
    alignSelf: "center",
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    height: 5,
    marginBottom: theme.spacing.md,
    width: 40,
  },
  title: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: theme.spacing.md,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    alignItems: "center",
    borderRadius: theme.radius.sm,
    gap: theme.spacing.xs,
    padding: theme.spacing.xs,
  },
  optionPressed: {
    backgroundColor: theme.colors.primarySoft,
  },
  icon: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  optionText: {
    color: theme.colors.text,
    fontSize: 12,
  },
}));
