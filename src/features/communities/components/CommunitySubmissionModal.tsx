import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { TextField } from "../../../shared/components/TextField";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { useCommunitySubmissionForm } from "../hooks/useCommunitySubmissionForm";
import type {
  CommunityType,
  SubmitCommunityPayload,
} from "../types/community";
import { CommunityLocationFields } from "./CommunityLocationFields";

interface CommunitySubmissionModalProps {
  visible: boolean;
  types: CommunityType[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    payload: SubmitCommunityPayload,
  ) => Promise<{ success: true } | { success: false; error: string }>;
}

export function CommunitySubmissionModal({
  visible,
  types,
  isSubmitting,
  onClose,
  onSubmit,
}: CommunitySubmissionModalProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const form = useCommunitySubmissionForm(visible, onSubmit);

  const close = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async () => {
    const success = await form.submitForm();
    if (success) onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <View
          style={[
            styles.container,
            { paddingTop: getTopSafeAreaInset(insets.top) },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close community submission"
              onPress={close}
              style={styles.headerButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Suggest a community</Text>
            <View style={styles.headerSpacer} />
          </View>
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            automaticallyAdjustKeyboardInsets
            keyboardDismissMode="interactive"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.intro}>
              Add a local community for review. It will be visible after approval.
            </Text>
            <TextField
              label="Community name"
              placeholder="e.g. Pokhara Lakeside"
              value={form.name}
              onChangeText={form.setName}
              autoCapitalize="words"
              maxLength={100}
              error={form.errors.name}
            />
            <CommunityLocationFields form={form} topInset={insets.top} />
            <TextField
              label="Description (optional)"
              placeholder="A short description of this community"
              value={form.description}
              onChangeText={form.setDescription}
              maxLength={120}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              error={form.errors.description}
              style={styles.description}
            />
            {types.length ? (
              <View style={styles.typeSection}>
                <Text style={styles.fieldLabel}>Community type (optional)</Text>
                <View style={styles.typeOptions}>
                  {types.map((type) => {
                    const selected = form.type === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        onPress={() => form.setType(selected ? null : type)}
                        style={[
                          styles.typeOption,
                          selected && styles.typeOptionSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeOptionText,
                            selected && styles.typeOptionTextSelected,
                          ]}
                        >
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null}
            {form.submitError ? (
              <Text style={styles.submitError} accessibilityLiveRegion="polite">
                {form.submitError}
              </Text>
            ) : null}
          </ScrollView>
          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, theme.spacing.md) },
            ]}
          >
            <PrimaryButton
              title="Submit for approval"
              onPress={() => void handleSubmit()}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  header: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  headerTitle: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  formScroll: {
    flex: 1,
  },
  formContent: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  intro: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  description: {
    minHeight: 96,
    paddingTop: theme.spacing.md,
  },
  typeSection: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  typeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  typeOption: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  typeOptionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeOptionText: {
    color: theme.colors.text,
    fontSize: 14,
    textTransform: "capitalize",
  },
  typeOptionTextSelected: {
    color: theme.colors.onPrimary,
    fontWeight: "700",
  },
  submitError: {
    color: theme.colors.error,
    fontSize: 13,
  },
  footer: {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    padding: theme.spacing.md,
  },
}));
