import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTopSafeAreaInset } from '../utils/safeArea';

export type ToastVariant = 'error' | 'info' | 'success';

export type ToastOptions = {
  durationMs?: number;
  title?: string;
  variant?: ToastVariant;
};

type ToastMessage = ToastOptions & {
  message: string;
};

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((nextMessage: string, options: ToastOptions = {}) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const { durationMs = 3500, ...toastOptions } = options;
    setToast({ message: nextMessage, ...toastOptions, variant: options.variant ?? 'error' });
    timeoutRef.current = setTimeout(hideToast, durationMs);
  }, [hideToast]);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      <View style={styles.root}>
        {children}
        {toast && (
          <View
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            style={[
              styles.toast,
              toast.variant === 'success' && styles.successToast,
              toast.variant === 'info' && styles.infoToast,
              { top: getTopSafeAreaInset(insets.top) + theme.spacing.sm },
            ]}
          >
            <MaterialCommunityIcons
              name={
                toast.variant === 'success'
                  ? 'check-circle-outline'
                  : toast.variant === 'info'
                    ? 'information-outline'
                    : 'alert-circle-outline'
              }
              size={22}
              color={theme.colors.onPrimary}
            />
            <View style={styles.toastContent}>
              {toast.title ? (
                <Text style={styles.toastTitle}>{toast.title}</Text>
              ) : null}
              <Text style={styles.toastMessage}>{toast.message}</Text>
            </View>
            <Pressable
              accessibilityLabel="Dismiss notification"
              accessibilityRole="button"
              hitSlop={8}
              onPress={hideToast}
              style={styles.dismissButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={theme.colors.onPrimary}
              />
            </Pressable>
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
  successToast: {
    backgroundColor: theme.colors.primary,
  },
  infoToast: {
    backgroundColor: theme.colors.primaryRaised,
  },
  toastContent: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  dismissButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  toastTitle: {
    color: theme.colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  toastMessage: {
    color: theme.colors.onPrimary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
}));
