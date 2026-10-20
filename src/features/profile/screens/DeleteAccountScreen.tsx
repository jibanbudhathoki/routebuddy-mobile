import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDeleteAccount } from "../hooks/useDeleteAccount";
import {
  deleteAccountReasons,
  deleteAccountSchema,
} from "../validations/deleteAccount.schema";

export function DeleteAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const { deleteAccount, isDeleting } = useDeleteAccount();

  const [selectedReason, setSelectedReason] = useState<string>(
    deleteAccountReasons[0],
  );
  const [confirmationInput, setConfirmationInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isConfirmationTyped = confirmationInput.trim() === "DELETE";

  const handleDelete = async () => {
    setErrorMessage(null);
    const result = deleteAccountSchema.safeParse({
      reason: selectedReason,
      confirmation: confirmationInput,
    });

    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message || "Please type DELETE to confirm",
      );
      return;
    }

    await deleteAccount();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Warning Hero Card */}
          <View style={styles.warningHero}>
            <View style={styles.warningIconCircle}>
              <MaterialCommunityIcons
                name="alert-octagon"
                size={32}
                color={theme.colors.error}
              />
            </View>
            <Text style={styles.warningHeroTitle}>
              Permanently delete your account?
            </Text>
            <Text style={styles.warningHeroSubtitle}>
              This process is immediate and irreversible. Please review what
              happens before proceeding.
            </Text>
          </View>

          {/* Consequences Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>What will happen:</Text>

            <View style={styles.consequenceItem}>
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={22}
                color={theme.colors.error}
                style={styles.consequenceIcon}
              />
              <View style={styles.consequenceTextContainer}>
                <Text style={styles.consequenceTitle}>
                  Active Requests & Trips Cancelled
                </Text>
                <Text style={styles.consequenceDescription}>
                  Any pending requests or posted trips will be cancelled
                  immediately.
                </Text>
              </View>
            </View>

            <View style={styles.consequenceItem}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={22}
                color={theme.colors.error}
                style={styles.consequenceIcon}
              />
              <View style={styles.consequenceTextContainer}>
                <Text style={styles.consequenceTitle}>
                  Wallet Balance Forfeiture
                </Text>
                <Text style={styles.consequenceDescription}>
                  Unwithdrawn wallet balance and pending escrow cannot be
                  recovered. Please withdraw your funds first.
                </Text>
              </View>
            </View>

            <View style={styles.consequenceItem}>
              <MaterialCommunityIcons
                name="database-remove-outline"
                size={22}
                color={theme.colors.error}
                style={styles.consequenceIcon}
              />
              <View style={styles.consequenceTextContainer}>
                <Text style={styles.consequenceTitle}>
                  Personal Data & History Removed
                </Text>
                <Text style={styles.consequenceDescription}>
                  Your profile, conversation logs, saved addresses, and payment
                  methods will be erased.
                </Text>
              </View>
            </View>
          </View>

          {/* Reason Selection */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>
              Why are you leaving? (Optional)
            </Text>
            <View style={styles.reasonList}>
              {deleteAccountReasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reasonRow,
                      isSelected && styles.reasonRowSelected,
                    ]}
                    onPress={() => setSelectedReason(reason)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={
                        isSelected
                          ? styles.radioSelected
                          : styles.radioUnselected
                      }
                    >
                      {isSelected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <Text style={styles.reasonText}>{reason}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Safety Confirmation Input */}
          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>
              Type <Text style={styles.deleteKeyword}>DELETE</Text> to confirm:
            </Text>

            <View
              style={[
                styles.inputWrapper,
                errorMessage ? styles.inputError : undefined,
                isConfirmationTyped ? styles.inputValid : undefined,
              ]}
            >
              <TextInput
                style={styles.textInput}
                placeholder="DELETE"
                placeholderTextColor={theme.colors.muted}
                value={confirmationInput}
                onChangeText={(text) => {
                  setConfirmationInput(text);
                  if (errorMessage) setErrorMessage(null);
                }}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              {isConfirmationTyped ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.colors.error}
                />
              ) : null}
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                !isConfirmationTyped || isDeleting
                  ? styles.deleteButtonDisabled
                  : undefined,
              ]}
              onPress={handleDelete}
              disabled={!isConfirmationTyped || isDeleting}
              activeOpacity={0.8}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={theme.colors.surface} />
              ) : (
                <View style={styles.deleteButtonContent}>
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={20}
                    color={theme.colors.surface}
                    style={styles.deleteButtonIcon}
                  />
                  <Text style={styles.deleteButtonText}>
                    Permanently Delete Account
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={isDeleting}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>
                Never mind, Keep Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  backButton: {
    alignItems: "flex-start",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl + 20,
  },
  warningHero: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: theme.spacing.lg,
    textAlign: "center",
  },
  warningIconCircle: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
    width: 56,
  },
  warningHeroTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },
  warningHeroSubtitle: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  sectionCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: theme.spacing.md,
  },
  sectionHeader: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },
  consequenceItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginTop: theme.spacing.sm,
  },
  consequenceIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  consequenceTextContainer: {
    flex: 1,
  },
  consequenceTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  consequenceDescription: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  reasonList: {
    gap: 6,
  },
  reasonRow: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    padding: theme.spacing.sm,
  },
  reasonRowSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  radioSelected: {
    alignItems: "center",
    borderColor: theme.colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    height: 18,
    justifyContent: "center",
    marginRight: theme.spacing.sm,
    width: 18,
  },
  radioUnselected: {
    borderColor: theme.colors.muted,
    borderRadius: 10,
    borderWidth: 2,
    height: 18,
    marginRight: theme.spacing.sm,
    width: 18,
  },
  radioInner: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  reasonText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
  },
  confirmationSection: {
    gap: 6,
  },
  confirmationLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  deleteKeyword: {
    color: theme.colors.error,
    fontWeight: "800",
  },
  inputWrapper: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    height: 48,
    paddingHorizontal: theme.spacing.md,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputValid: {
    borderColor: theme.colors.error,
  },
  textInput: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: theme.colors.error,
    borderRadius: theme.radius.sm,
    height: 50,
    justifyContent: "center",
  },
  deleteButtonDisabled: {
    opacity: 0.45,
  },
  deleteButtonContent: {
    alignItems: "center",
    flexDirection: "row",
  },
  deleteButtonIcon: {
    marginRight: 6,
  },
  deleteButtonText: {
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
}));
