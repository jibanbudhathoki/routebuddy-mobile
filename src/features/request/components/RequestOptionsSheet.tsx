import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RequestOptionsSheetProps {
  visible: boolean;
  isCancelling: boolean;
  isDeleting: boolean;
  isReportingIssue: boolean;
  canCancel: boolean;
  onClose: () => void;
  onShare: () => void;
  onCancelRequest: () => void;
  onDeleteRequest: () => void;
  onReportIssue: () => void;
}

export function RequestOptionsSheet({
  visible,
  isCancelling,
  isDeleting,
  isReportingIssue,
  canCancel,
  onClose,
  onShare,
  onCancelRequest,
  onDeleteRequest,
  onReportIssue,
}: RequestOptionsSheetProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const isBusy = isCancelling || isDeleting || isReportingIssue;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close request options"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) },
          ]}
        >
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title}>Request Options</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close request options"
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
          <OptionButton
            icon="share-variant-outline"
            title="Share Request"
            description="Share a read-only link to this request."
            disabled={isBusy}
            loading={false}
            onPress={onShare}
          />
          <OptionButton
            icon="alert-circle-outline"
            title={isReportingIssue ? "Submitting report..." : "Report an Issue"}
            description="Tell us about a problem with this request."
            disabled={isBusy}
            loading={isReportingIssue}
            onPress={onReportIssue}
          />
          <OptionButton
            icon="cancel"
            title={isCancelling ? "Cancelling..." : "Cancel Request"}
            description={
              canCancel
                ? "Cancel this request before a driver accepts it."
                : "A request can only be cancelled before a driver accepts it."
            }
            disabled={!canCancel || isBusy}
            loading={isCancelling}
            onPress={onCancelRequest}
          />
          <OptionButton
            icon="delete-outline"
            title={isDeleting ? "Deleting..." : "Delete Request"}
            description="Hide and cancel this request before fulfilment begins."
            disabled={isBusy}
            loading={isDeleting}
            destructive
            onPress={onDeleteRequest}
          />
        </View>
      </View>
    </Modal>
  );
}

function OptionButton({
  icon,
  title,
  description,
  disabled,
  loading,
  destructive = false,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  disabled: boolean;
  loading: boolean;
  destructive?: boolean;
  onPress: () => void;
}) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.option, disabled && styles.disabled]}
    >
      <View style={[styles.iconCircle, destructive && styles.destructiveIcon]}>
        {loading ? (
          <MaterialCommunityIcons
            name="loading"
            size={20}
            color={theme.colors.text}
          />
        ) : (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={destructive ? theme.colors.error : theme.colors.text}
          />
        )}
      </View>
      <View style={styles.copy}>
        <Text style={[styles.optionTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={theme.colors.muted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  grabber: {
    alignSelf: "center",
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    height: 4,
    marginBottom: theme.spacing.sm,
    width: 40,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 40,
  },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  closeButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  option: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 76,
    paddingVertical: theme.spacing.sm,
  },
  disabled: {
    opacity: 0.55,
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  destructiveIcon: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  destructiveText: {
    color: theme.colors.error,
  },
  description: {
    color: theme.colors.muted,
    fontSize: 10,
    lineHeight: 14,
  },
}));
