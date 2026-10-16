import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export interface EditTripOption {
  uid: string;
  label: string;
  description?: string;
}

interface EditTripSelectionModalProps {
  visible: boolean;
  title: string;
  options: EditTripOption[];
  selectedUids: string[];
  multiple?: boolean;
  onToggle: (uid: string) => void;
  onClose: () => void;
}

export function EditTripSelectionModal({
  visible,
  title,
  options,
  selectedUids,
  multiple = false,
  onToggle,
  onClose,
}: EditTripSelectionModalProps) {
  const { theme } = useUnistyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close selection"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Done"
              onPress={onClose}
              style={styles.doneButton}
            >
              <Text style={styles.doneText}>{multiple ? "Done" : "Close"}</Text>
            </Pressable>
          </View>
          <ScrollView>
            {options.map((option) => {
              const selected = selectedUids.includes(option.uid);
              return (
                <Pressable
                  key={option.uid}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    onToggle(option.uid);
                    if (!multiple) onClose();
                  }}
                  style={styles.option}
                >
                  <View style={styles.optionCopy}>
                    <Text style={styles.optionTitle}>{option.label}</Text>
                    {option.description ? (
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    ) : null}
                  </View>
                  <MaterialCommunityIcons
                    name={
                      selected
                        ? multiple
                          ? "checkbox-marked"
                          : "radiobox-marked"
                        : multiple
                          ? "checkbox-blank-outline"
                          : "radiobox-blank"
                    }
                    size={21}
                    color={selected ? theme.colors.text : theme.colors.muted}
                  />
                </Pressable>
              );
            })}
            {options.length === 0 ? (
              <Text style={styles.empty}>No options available.</Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    maxHeight: "75%",
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  header: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  doneButton: {
    padding: theme.spacing.xs,
  },
  doneText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  option: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.md,
    minHeight: 60,
    paddingVertical: theme.spacing.sm,
  },
  optionCopy: {
    flex: 1,
    gap: 3,
  },
  optionTitle: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  optionDescription: {
    color: theme.colors.muted,
    fontSize: 11,
  },
  empty: {
    color: theme.colors.muted,
    padding: theme.spacing.lg,
    textAlign: "center",
  },
}));
