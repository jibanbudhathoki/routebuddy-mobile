import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface RateDriverPromptProps {
  visible: boolean;
  driverName: string;
  isSubmitting: boolean;
  onNotNow: () => void;
  onSubmit: (score: number, comment?: string) => void;
}

export function RateDriverPrompt({
  visible,
  driverName,
  isSubmitting,
  onNotNow,
  onSubmit,
}: RateDriverPromptProps) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const { theme } = useUnistyles();

  useEffect(() => {
    if (!visible) {
      setScore(0);
      setComment("");
    }
  }, [visible]);

  const submit = () => {
    if (score < 1 || score > 5 || isSubmitting) return;
    onSubmit(score, comment.trim() || undefined);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isSubmitting ? undefined : onNotNow}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss rating prompt"
          disabled={isSubmitting}
          onPress={onNotNow}
          style={styles.backdrop}
        />
        <View style={styles.dialog}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="star-outline"
              size={26}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.title}>Rate your driver</Text>
          <Text style={styles.description}>
            Delivery confirmed. How was your experience with {driverName}?
          </Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="Driver rating"
            style={styles.stars}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityLabel={`${value} ${value === 1 ? "star" : "stars"}`}
                accessibilityState={{ checked: score === value }}
                disabled={isSubmitting}
                onPress={() => setScore(value)}
                hitSlop={4}
              >
                <MaterialCommunityIcons
                  name={score >= value ? "star" : "star-outline"}
                  size={34}
                  color={
                    score >= value ? theme.colors.secondary : theme.colors.muted
                  }
                />
              </Pressable>
            ))}
          </View>
          <TextInput
            accessibilityLabel="Optional rating comment"
            editable={!isSubmitting}
            maxLength={500}
            multiline
            onChangeText={setComment}
            placeholder="Add a comment (optional)"
            placeholderTextColor={theme.colors.muted}
            style={styles.comment}
            textAlignVertical="top"
            value={comment}
          />
          <Text style={styles.counter}>{comment.length}/500</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={onNotNow}
              style={[styles.button, styles.secondaryButton]}
            >
              <Text style={styles.secondaryText}>Not now</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{
                disabled: score === 0 || isSubmitting,
                busy: isSubmitting,
              }}
              disabled={score === 0 || isSubmitting}
              onPress={submit}
              style={[
                styles.button,
                styles.primaryButton,
                (score === 0 || isSubmitting) && styles.disabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.onPrimary} />
              ) : (
                <Text style={styles.primaryText}>Submit rating</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
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
  title: { color: theme.colors.text, fontSize: 19, fontWeight: "700" },
  description: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  stars: { flexDirection: "row", gap: theme.spacing.sm, paddingVertical: theme.spacing.xs },
  comment: {
    alignSelf: "stretch",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 14,
    minHeight: 88,
    padding: theme.spacing.md,
  },
  counter: {
    alignSelf: "flex-end",
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: -theme.spacing.sm,
  },
  actions: { alignSelf: "stretch", flexDirection: "row", gap: theme.spacing.sm },
  button: {
    alignItems: "center",
    borderRadius: theme.radius.sm,
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: theme.spacing.sm,
  },
  secondaryButton: { backgroundColor: theme.colors.primarySoft },
  secondaryText: { color: theme.colors.text, fontSize: 14, fontWeight: "600" },
  primaryButton: { backgroundColor: theme.colors.primary },
  primaryText: { color: theme.colors.onPrimary, fontSize: 14, fontWeight: "700" },
  disabled: { opacity: 0.5 },
}));
