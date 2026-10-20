import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { HomeFilterOption } from "../types/homeFilters";

interface HomeFilterPickerModalProps {
  visible: boolean;
  title: string;
  description?: string;
  options: HomeFilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function HomeFilterPickerModal({
  visible,
  title,
  description,
  options,
  selectedValue,
  onSelect,
  onClose,
}: HomeFilterPickerModalProps) {
  const insets = useSafeAreaInsets();
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
          accessibilityLabel="Close filters"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close filters"
              onPress={onClose}
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={theme.colors.text}
              />
            </Pressable>
          </View>
          {description ? (
            <Text style={styles.description}>{description}</Text>
          ) : null}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <Pressable
                  key={`${option.value}:${option.label}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  style={styles.option}
                >
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <MaterialCommunityIcons
                    name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                    size={20}
                    color={
                      isSelected ? theme.colors.primary : theme.colors.muted
                    }
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    maxHeight: "75%",
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
    paddingVertical: theme.spacing.sm,
  },
  option: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 50,
    paddingVertical: theme.spacing.sm,
  },
  optionLabel: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    marginRight: theme.spacing.md,
  },
}));
