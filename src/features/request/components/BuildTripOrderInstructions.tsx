import { Text, TextInput, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface BuildTripOrderInstructionsProps {
  value: string;
  onChange: (value: string) => void;
}

export function BuildTripOrderInstructions({
  value,
  onChange,
}: BuildTripOrderInstructionsProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Instructions</Text>
      <TextInput
        accessibilityLabel="Order instructions"
        multiline
        placeholder="Add any notes for the driver"
        placeholderTextColor={theme.colors.muted}
        style={styles.notesInput}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
  },
  notesInput: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    minHeight: 90,
    padding: theme.spacing.md,
    textAlignVertical: "top",
  },
}));
