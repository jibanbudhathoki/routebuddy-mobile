import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { reportRequestIssueSchema } from "../validations/reportRequestIssue";

interface ReportRequestIssueDialogProps {
  visible: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

export function ReportRequestIssueDialog({
  visible,
  isSubmitting,
  onClose,
  onSubmit,
}: ReportRequestIssueDialogProps) {
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { theme } = useUnistyles();
  const isValid = reportRequestIssueSchema.safeParse({ message }).success;

  useEffect(() => {
    if (!visible) {
      setMessage("");
      setValidationError(null);
    }
  }, [visible]);

  const submit = () => {
    const result = reportRequestIssueSchema.safeParse({ message });
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? "Enter an issue description.");
      return;
    }
    setValidationError(null);
    onSubmit(result.data.message);
  };

  const close = () => {
    if (isSubmitting) return;
    setMessage("");
    setValidationError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close issue report"
          disabled={isSubmitting}
          onPress={close}
          style={styles.backdrop}
        />
        <View style={styles.dialog}>
          <View style={styles.heading}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.title}>Report an issue</Text>
          </View>
          <Text style={styles.description}>
            Tell us what went wrong with this request. Your report can be up to
            1000 characters.
          </Text>
          <TextInput
            accessibilityLabel="Issue description"
            editable={!isSubmitting}
            multiline
            maxLength={1000}
            onChangeText={(value) => {
              setMessage(value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Describe the issue..."
            placeholderTextColor={theme.colors.muted}
            style={styles.input}
            textAlignVertical="top"
            value={message}
          />
          <View style={styles.inputMeta}>
            {validationError ? (
              <Text style={styles.validationError}>{validationError}</Text>
            ) : (
              <View />
            )}
            <Text style={styles.counter}>{message.length}/1000</Text>
          </View>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={close}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{
                disabled: !isValid || isSubmitting,
                busy: isSubmitting,
              }}
              disabled={!isValid || isSubmitting}
              onPress={submit}
              style={[
                styles.button,
                styles.submitButton,
                (!isValid || isSubmitting) && styles.disabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.onPrimary} />
              ) : (
                <Text style={styles.submitText}>Submit report</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  backdrop: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  dialog: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.md,
    maxWidth: 420,
    padding: theme.spacing.lg,
    width: "100%",
  },
  heading: { alignItems: "center", flexDirection: "row", gap: theme.spacing.sm },
  iconCircle: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  title: { color: theme.colors.text, fontSize: 18, fontWeight: "700" },
  description: { color: theme.colors.muted, fontSize: 13, lineHeight: 19 },
  input: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 14,
    minHeight: 132,
    padding: theme.spacing.md,
  },
  inputMeta: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -theme.spacing.sm,
  },
  validationError: { color: theme.colors.error, flex: 1, fontSize: 12 },
  counter: { color: theme.colors.muted, fontSize: 12 },
  actions: { flexDirection: "row", gap: theme.spacing.sm },
  button: {
    alignItems: "center",
    borderRadius: theme.radius.sm,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: theme.spacing.sm,
  },
  cancelButton: { backgroundColor: theme.colors.primarySoft },
  cancelText: { color: theme.colors.text, fontSize: 14, fontWeight: "600" },
  submitButton: { backgroundColor: theme.colors.primary },
  submitText: { color: theme.colors.onPrimary, fontSize: 14, fontWeight: "700" },
  disabled: { opacity: 0.5 },
}));
