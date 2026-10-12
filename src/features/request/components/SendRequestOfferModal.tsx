import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { TextField } from "../../../shared/components/TextField";
import type { SubmitRequestOfferPayload } from "../types/request";
import { OfferDeliveryDateTimePicker } from "./OfferDeliveryDateTimePicker";
import { validateRequestOffer } from "../validations/requestOffer";

interface SendRequestOfferModalProps {
  visible: boolean;
  latestDeliveryBy: string;
  isSubmitting: boolean;
  onClose: () => void;
  onValidationError: (message: string) => void;
  onSubmit: (payload: SubmitRequestOfferPayload) => Promise<void>;
}

export function SendRequestOfferModal({
  visible,
  latestDeliveryBy,
  isSubmitting,
  onClose,
  onValidationError,
  onSubmit,
}: SendRequestOfferModalProps) {
  const { theme } = useUnistyles();
  const [proposedAt, setProposedAt] = useState(() =>
    getInitialProposalDate(latestDeliveryBy),
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const latestDeadline = new Date(latestDeliveryBy);
  const hasValidDeadline =
    Number.isFinite(latestDeadline.getTime()) &&
    latestDeadline.getTime() > Date.now();

  useEffect(() => {
    if (!visible) return;
    setProposedAt(getInitialProposalDate(latestDeliveryBy));
    setMessage("");
    setError("");
  }, [latestDeliveryBy, visible]);

  const handleSubmit = async () => {
    setError("");
    const validation = validateRequestOffer(
      proposedAt,
      message,
      latestDeliveryBy,
    );
    if (!validation.isValid) {
      onValidationError(validation.error);
      return;
    }

    try {
      await onSubmit({
        proposedLatestBy: validation.data.proposedLatestBy,
        ...(validation.data.message
          ? { message: validation.data.message }
          : {}),
      });
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Unable to send your offer. Please try again.",
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.scrim} pointerEvents="none" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.sheetWrap}
        >
          <Pressable
            style={styles.sheet}
            onPress={(event) => event.stopPropagation()}
          >
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.headingRow}>
                <View style={styles.headingCopy}>
                  <Text style={styles.title}>Send an offer</Text>
                  <Text style={styles.subtitle}>
                    Propose when you can deliver this request.
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close send offer"
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={21}
                    color={theme.colors.text}
                  />
                </Pressable>
              </View>

              <OfferDeliveryDateTimePicker
                value={proposedAt}
                minimumDate={new Date()}
                maximumDate={hasValidDeadline ? latestDeadline : undefined}
                onChange={setProposedAt}
              />

              <TextField
                label="Message (optional)"
                placeholder="Add a note for the requester"
                value={message}
                onChangeText={setMessage}
                maxLength={500}
                multiline
                textAlignVertical="top"
                style={styles.messageInput}
              />
              <Text style={styles.characterCount}>{message.length}/500</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled: isSubmitting,
                  busy: isSubmitting,
                }}
                disabled={isSubmitting}
                onPress={() => void handleSubmit()}
                style={[
                  styles.sendButton,
                  isSubmitting && styles.disabledButton,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={theme.colors.onPrimary} />
                ) : null}
                <Text style={styles.sendButtonText}>
                  {isSubmitting ? "Sending..." : "Send Offer"}
                </Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function getInitialProposalDate(latestDeliveryBy: string) {
  const latestDeadline = new Date(latestDeliveryBy);
  if (
    Number.isFinite(latestDeadline.getTime()) &&
    latestDeadline.getTime() > Date.now()
  ) {
    return latestDeadline;
  }
  return new Date(Date.now() + 60 * 60 * 1000);
}

const styles = StyleSheet.create((theme) => ({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
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
  sheetWrap: {
    maxHeight: "92%",
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    overflow: "hidden",
  },
  content: {
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  headingRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  headingCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: "700",
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  closeButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  messageInput: {
    minHeight: 96,
    paddingTop: theme.spacing.sm,
  },
  characterCount: {
    alignSelf: "flex-end",
    color: theme.colors.muted,
    fontSize: 10,
    marginTop: -theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "center",
    minHeight: 48,
    marginTop: theme.spacing.xs,
  },
  disabledButton: {
    opacity: 0.65,
  },
  sendButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
}));
