import type { TextInputProps } from 'react-native';
import { Text, TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
};

export function TextField({ label, error, leftElement, rightElement, ...props }: TextFieldProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputContainer, error ? styles.inputContainerError : null]}>
        {leftElement}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={styles.placeholder.color}
          {...props}
          style={[styles.input, props.style]}
        />
        {rightElement}
      </View>
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
  inputContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
  },
  inputContainerError: {
    borderColor: theme.colors.error,
  },
  input: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 16,
    minHeight: 56,
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