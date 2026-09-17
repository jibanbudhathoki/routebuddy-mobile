import type { TextInputProps } from 'react-native';
import { Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, ...props }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={styles.placeholder.color}
        {...props}
        style={[styles.input, props.style]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    width: '100%',
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 16,
    minHeight: 54,
    paddingHorizontal: theme.spacing.md,
  },
  placeholder: {
    color: theme.colors.muted,
  },
  error: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: theme.spacing.xs,
  },
}));