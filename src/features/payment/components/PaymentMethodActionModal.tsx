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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PaymentMethodItem } from "../types/paymentMethod.types";

interface PaymentMethodActionModalProps {
  visible: boolean;
  paymentMethod: PaymentMethodItem | null;
  onClose: () => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PaymentMethodActionModal({
  visible,
  paymentMethod,
  onClose,
  onSetDefault,
  onDelete,
}: PaymentMethodActionModalProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  if (!paymentMethod) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.content,
                { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) },
              ]}
            >
              <View style={styles.dragIndicator} />

              <Text style={styles.title}>
                {paymentMethod.brandDisplayName} ending in {paymentMethod.last4}
              </Text>

              {!paymentMethod.isDefault && (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => onSetDefault(paymentMethod.id)}
                >
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={24}
                    color={theme.colors.text}
                    style={styles.icon}
                  />
                  <Text style={styles.optionText}>Set as Default</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => onDelete(paymentMethod.id)}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={24}
                  color={theme.colors.error}
                  style={styles.icon}
                />
                <Text style={[styles.optionText, { color: theme.colors.error }]}>
                  Remove Payment Method
                </Text>
              </TouchableOpacity>

              <View style={styles.cancelContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={theme.colors.text}
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
    backgroundColor: theme.colors.overlay,
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
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
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
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
    color: theme.colors.text,
  },
}));
