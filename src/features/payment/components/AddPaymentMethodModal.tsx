import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardForm } from "@stripe/stripe-react-native";
import { AddPaymentMethodInput } from "../types/paymentMethod.types";

interface AddPaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: AddPaymentMethodInput) => Promise<unknown> | void;
  isLoading?: boolean;
}

export function AddPaymentMethodModal({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}: AddPaymentMethodModalProps) {
  const { theme } = useUnistyles();

  const [holderName, setHolderName] = useState("");
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const resetForm = () => {
    setHolderName("");
    setIsCardComplete(false);
    setHasSubmitted(false);
    setNameError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    setNameError(null);

    const cleanName = holderName.trim();
    if (cleanName.length < 2) {
      setNameError("Please enter the name on your card.");
      return;
    }

    if (!isCardComplete) {
      return;
    }

    try {
      await onSubmit({
        holderName: cleanName,
      });
      resetForm();
    } catch {
      // Error is caught and surfaced via toast in hook
    }
  };

  const isFormValid = isCardComplete && holderName.trim().length >= 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardContainer}
          >
            <TouchableWithoutFeedback>
              <View style={styles.content}>
                <View style={styles.dragIndicator} />

                <View style={styles.headerRow}>
                  <Text style={styles.headerTitle}>Add New Card</Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={22}
                      color={theme.colors.muted}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Name on Card */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Name on card</Text>
                    <View
                      style={[
                        styles.inputWithIcon,
                        hasSubmitted && nameError
                          ? styles.inputError
                          : undefined,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="account-outline"
                        size={20}
                        color={theme.colors.muted}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.inputFlex}
                        placeholder="e.g. Jane Doe"
                        placeholderTextColor={theme.colors.muted}
                        value={holderName}
                        onChangeText={(text) => {
                          setHolderName(text);
                          if (nameError) setNameError(null);
                        }}
                        autoCapitalize="words"
                      />
                    </View>
                    {hasSubmitted && nameError && (
                      <Text style={styles.errorText}>{nameError}</Text>
                    )}
                  </View>

                  {/* Multi-line Stripe CardForm */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Card details</Text>
                    <View
                      style={[
                        styles.cardFormContainer,
                        hasSubmitted && !isCardComplete
                          ? styles.inputError
                          : undefined,
                      ]}
                    >
                      <CardForm
                        autofocus={false}
                        onFormComplete={(cardDetails) => {
                          setIsCardComplete(cardDetails.complete);
                        }}
                        cardStyle={{
                          backgroundColor: theme.colors.surface,
                          textColor: theme.colors.text,
                          placeholderColor: theme.colors.muted,
                          textErrorColor: theme.colors.error,
                          cursorColor: theme.colors.primary,
                          borderColor: theme.colors.border,
                          borderRadius: theme.radius.sm,
                          borderWidth: 1,
                          fontSize: 15,
                        }}
                        style={styles.cardForm}
                      />
                    </View>
                    {hasSubmitted && !isCardComplete && (
                      <Text style={styles.errorText}>
                        Please enter complete and valid card details.
                      </Text>
                    )}
                  </View>

                  {/* Security hint */}
                  <View style={styles.securityHintRow}>
                    <MaterialCommunityIcons
                      name="shield-lock-outline"
                      size={18}
                      color={theme.colors.muted}
                    />
                    <Text style={styles.securityHintText}>
                      Your card details are end-to-end encrypted by Stripe.
                    </Text>
                  </View>

                  {/* Save Button */}
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      isLoading || (hasSubmitted && !isFormValid)
                        ? styles.buttonDisabled
                        : undefined,
                    ]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Save Card"
                  >
                    {isLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={theme.colors.onPrimary}
                      />
                    ) : (
                      <Text style={styles.saveButtonText}>Save Card</Text>
                    )}
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
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
  keyboardContainer: {
    width: "100%",
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
    maxHeight: "85%",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  scrollContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  inputWithIcon: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    height: 52,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  inputFlex: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
  },
  cardFormContainer: {
    borderRadius: theme.radius.sm,
    overflow: "hidden",
  },
  cardForm: {
    width: "100%",
    height: 180,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: "500",
  },
  securityHintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 2,
  },
  securityHintText: {
    fontSize: 12,
    color: theme.colors.muted,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
}));
