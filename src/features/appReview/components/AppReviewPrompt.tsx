import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface AppReviewPromptProps {
  visible: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment?: string) => void;
}

export function AppReviewPrompt({
  visible,
  isSubmitting,
  onClose,
  onSubmit,
}: AppReviewPromptProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { theme } = useUnistyles();

  useEffect(() => {
    if (!visible) {
      setRating(0);
      setComment("");
    }
  }, [visible]);

  const handleSubmit = () => {
    if (rating < 1 || rating > 5 || isSubmitting) return;
    onSubmit(rating, comment.trim() || undefined);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isSubmitting ? undefined : onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
      <ScrollView
        contentContainerStyle={styles.overlay}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close app review"
          disabled={isSubmitting}
          onPress={onClose}
          style={styles.backdrop}
        />
        <View style={styles.dialog}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="star-outline"
              size={26}
              color={theme.colors.text}
            />
          </View>
          <Text style={styles.title}>Review RouteBuddy</Text>
          <Text style={styles.description}>
            How would you rate your experience?
          </Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="App rating"
            style={styles.stars}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityLabel={`${value} ${value === 1 ? "star" : "stars"}`}
                accessibilityState={{ checked: rating === value }}
                disabled={isSubmitting}
                onPress={() => setRating(value)}
                hitSlop={4}
              >
                <MaterialCommunityIcons
                  name={rating >= value ? "star" : "star-outline"}
                  size={34}
                  color={
                    rating >= value
                      ? theme.colors.secondary
                      : theme.colors.muted
                  }
                />
              </Pressable>
            ))}
          </View>
          <TextInput
            accessibilityLabel="Optional review comment"
            editable={!isSubmitting}
            maxLength={1000}
            multiline
            onChangeText={setComment}
            placeholder="Tell us more (optional)"
            placeholderTextColor={theme.colors.muted}
            style={styles.comment}
            textAlignVertical="top"
            value={comment}
          />
          <Text style={styles.counter}>{comment.length}/1000</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{
                disabled: rating === 0 || isSubmitting,
                busy: isSubmitting,
              }}
              disabled={rating === 0 || isSubmitting}
              onPress={handleSubmit}
              style={[
                styles.button,
                styles.submitButton,
                (rating === 0 || isSubmitting) && styles.disabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.onPrimary} />
              ) : (
                <Text style={styles.submitText}>Submit review</Text>
              )}
            </Pressable>
          </View>
        </View>
        </ScrollView>
        </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  keyboardAvoiding: {
    flex: 1,
  },
  overlay: {
    alignItems: "center",
    backgroundColor: theme.colors.overlay,
    flexGrow: 1,
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
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    gap: theme.spacing.sm,
    maxWidth: 420,
    padding: theme.spacing.lg,
    width: "100%",
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 26,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  title: {
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: "700",
  },
  description: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  stars: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  comment: {
    alignSelf: "stretch",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 14,
    minHeight: 100,
    padding: theme.spacing.md,
  },
  counter: {
    alignSelf: "flex-end",
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: -theme.spacing.sm,
  },
  actions: {
    alignSelf: "stretch",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  button: {
    alignItems: "center",
    borderRadius: theme.radius.sm,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: theme.spacing.sm,
  },
  cancelButton: {
    backgroundColor: theme.colors.primarySoft,
  },
  cancelText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  submitText: {
    color: theme.colors.onPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
}));
