import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const showToast = useCallback((nextMessage: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setMessage(nextMessage);
    timeoutRef.current = setTimeout(() => {
      setMessage(null);
      timeoutRef.current = null;
    }, 3500);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      <View style={styles.root}>
        {children}
        {message && (
          <View
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            pointerEvents="none"
            style={[styles.toast, { top: insets.top + theme.spacing.sm }]}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={22}
              color={theme.colors.onPrimary}
            />
            <Text style={styles.toastMessage}>{message}</Text>
          </View>
        )}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
  },
  toast: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.error,
    borderRadius: theme.radius.sm,
    elevation: 8,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    left: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    position: 'absolute',
    right: theme.spacing.md,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 999,
  },
  toastMessage: {
    color: theme.colors.onPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
}));
