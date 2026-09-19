import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UnistylesRuntime } from "react-native-unistyles";

interface AppearanceModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AppearanceModal({ visible, onClose }: AppearanceModalProps) {
  const { theme } = useUnistyles();

  const handleSelect = (mode: "system" | "light" | "dark") => {
    if (mode === "system") {
      UnistylesRuntime.setAdaptiveThemes(true);
    } else {
      UnistylesRuntime.setAdaptiveThemes(false);
      UnistylesRuntime.setTheme(mode);
    }
    onClose();
  };

  // Determine current active selection for highlighting
  const isAdaptive = UnistylesRuntime.adaptiveThemes;
  const currentTheme = UnistylesRuntime.themeName;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.dragIndicator} />

              <Text style={styles.title}>Appearance</Text>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleSelect("system")}
              >
                <MaterialCommunityIcons
                  name="cellphone-cog"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
                <Text style={styles.optionText}>System Default</Text>
                {isAdaptive && (
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleSelect("light")}
              >
                <MaterialCommunityIcons
                  name="white-balance-sunny"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
                <Text style={styles.optionText}>Light Mode</Text>
                {!isAdaptive && currentTheme === "light" && (
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => handleSelect("dark")}
              >
                <MaterialCommunityIcons
                  name="weather-night"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
                <Text style={styles.optionText}>Dark Mode</Text>
                {!isAdaptive && currentTheme === "dark" && (
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color={theme.colors.primary}
                  />
                )}
              </TouchableOpacity>

              <View style={styles.cancelContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
                <Text style={styles.cancelText}>Cancel</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    paddingBottom: 48,
    alignItems: "center",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  icon: {
    marginRight: theme.spacing.md,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
  cancelContainer: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
  },
  cancelButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
}));
