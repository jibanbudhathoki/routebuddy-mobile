import { Image, Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type GoogleSignInButtonProps = {
  loading?: boolean;
  onPress: () => void;
};

export function GoogleSignInButton({
  loading = false,
  onPress,
}: GoogleSignInButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: loading }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !loading && styles.pressed,
        loading && styles.disabled,
      ]}
    >
      <Image
        source={require('../../../../assets/google-logo.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <Text style={styles.label}>
        {loading ? 'Connecting to Google...' : 'Continue with Google'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: theme.spacing.md,
    position: 'relative',
  },
  pressed: {
    opacity: 0.86,
  },
  disabled: {
    opacity: 0.6,
  },
  icon: {
    height: 24,
    left: theme.spacing.md,
    position: 'absolute',
    width: 24,
  },
  label: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
}));
