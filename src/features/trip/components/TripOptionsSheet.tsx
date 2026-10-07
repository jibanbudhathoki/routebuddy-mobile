import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export type TripOptionAction =
  | "edit"
  | "share"
  | "close-orders"
  | "cancel"
  | "delete";

interface TripOptionsSheetProps {
  visible: boolean;
  acceptsNewOrders: boolean;
  onClose: () => void;
  onSelect: (action: TripOptionAction) => void;
}

const options: Array<{
  action: TripOptionAction;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
}> = [
  {
    action: "edit",
    icon: "pencil-outline",
    title: "Edit Trip",
    description: "Update trip details, stores, times, and order limits.",
  },
  {
    action: "share",
    icon: "share-variant-outline",
    title: "Share Trip",
    description: "Share this trip link to let others request orders.",
  },
  {
    action: "close-orders",
    icon: "account-multiple-outline",
    title: "Close to New Orders",
    description: "Stop accepting new requests. Current orders won't be affected.",
  },
  {
    action: "cancel",
    icon: "trash-can-outline",
    title: "Cancel Trip",
    description: "Cancel this trip and notify all requesters. Active orders will be refunded.",
  },
  {
    action: "delete",
    icon: "delete-outline",
    title: "Delete Trip",
    description: "Permanently remove this trip from your trips.",
  },
];

export function TripOptionsSheet({
  visible,
  acceptsNewOrders,
  onClose,
  onSelect,
}: TripOptionsSheetProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const [isClosedToNewOrders, setIsClosedToNewOrders] = useState(
    !acceptsNewOrders,
  );
  const [isCloseOrdersExpanded, setIsCloseOrdersExpanded] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsClosedToNewOrders(!acceptsNewOrders);
      setIsCloseOrdersExpanded(false);
    }
  }, [acceptsNewOrders, visible]);

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
          accessibilityLabel="Close trip options"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View
          style={[
            styles.sheet,
            {
              marginTop: insets.top + theme.spacing.lg,
              paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
            },
          ]}
        >
            <View style={styles.grabber} />
            <View style={styles.header}>
              <View style={styles.headerSpacer} />
              <Text style={styles.title}>Trip Options</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close trip options"
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

            <View style={styles.options}>
              {options.slice(0, 2).map((option) => (
                <OptionRow
                  key={option.action}
                  option={option}
                  onPress={() => onSelect(option.action)}
                />
              ))}

              <OptionRow
                option={options[2]}
                onPress={() =>
                  setIsCloseOrdersExpanded((expanded) => !expanded)
                }
                expanded={isCloseOrdersExpanded}
              />
              {isCloseOrdersExpanded ? (
                <View style={styles.toggleCard}>
                  <View style={styles.toggleHeader}>
                    <Text style={styles.optionTitle}>Close to New Orders</Text>
                    <Switch
                      accessibilityLabel="Close trip to new orders"
                      accessibilityHint="Turn on to stop accepting new requests for this trip."
                      value={isClosedToNewOrders}
                      onValueChange={setIsClosedToNewOrders}
                      trackColor={{
                        false: theme.colors.border,
                        true: theme.colors.primary,
                      }}
                      thumbColor={theme.colors.onPrimary}
                    />
                  </View>
                  <Text style={styles.optionDescription}>
                    Stop accepting new requests for this trip. Current orders
                    won't be affected.
                  </Text>
                  <View style={styles.infoNote}>
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={15}
                      color={theme.colors.primary}
                    />
                    <View style={styles.infoCopy}>
                      <Text style={styles.infoText}>
                        You can turn this back on anytime.
                      </Text>
                      <Text style={styles.infoText}>
                        Existing requesters can still message you.
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}

              <OptionRow
                option={options[3]}
                onPress={() => onSelect(options[3].action)}
                destructive
              />
              <OptionRow
                option={options[4]}
                onPress={() => onSelect(options[4].action)}
                destructive
              />
            </View>
        </View>
      </View>
    </Modal>
  );
}

function OptionRow({
  option,
  onPress,
  destructive = false,
  expanded = false,
}: {
  option: (typeof options)[number];
  onPress: () => void;
  destructive?: boolean;
  expanded?: boolean;
}) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.option}
    >
      <View
        style={[
          styles.optionIcon,
          destructive && styles.destructiveIcon,
        ]}
      >
        <MaterialCommunityIcons
          name={option.icon}
          size={19}
          color={destructive ? theme.colors.error : theme.colors.primary}
        />
      </View>
      <View style={styles.optionCopy}>
        <Text
          style={[
            styles.optionTitle,
            destructive && styles.destructiveTitle,
          ]}
        >
          {option.title}
        </Text>
        <Text style={styles.optionDescription}>{option.description}</Text>
      </View>
      <MaterialCommunityIcons
        name={expanded ? "chevron-down" : "chevron-right"}
        size={20}
        color={theme.colors.text}
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
    flex: 1,
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
    height: 42,
    justifyContent: "space-between",
  },
  headerSpacer: {
    width: 36,
  },
  title: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  closeButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  options: {
    marginTop: theme.spacing.xs,
  },
  option: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 80,
    paddingVertical: theme.spacing.sm,
  },
  optionIcon: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 22,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  destructiveIcon: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  optionCopy: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    color: theme.colors.text,
    fontSize: 11,
    fontWeight: "700",
  },
  destructiveTitle: {
    color: theme.colors.error,
  },
  optionDescription: {
    color: theme.colors.muted,
    fontSize: 9,
    lineHeight: 13,
  },
  toggleCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    gap: theme.spacing.xs,
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.sm,
  },
  toggleHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoNote: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 6,
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
    padding: theme.spacing.sm,
  },
  infoCopy: {
    flex: 1,
    gap: 4,
  },
  infoText: {
    color: theme.colors.text,
    fontSize: 8,
    lineHeight: 12,
  },
}));
