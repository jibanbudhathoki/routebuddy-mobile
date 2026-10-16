import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUnistyles } from "react-native-unistyles";

import type { TripStatus } from "../types/trip";
import { TripOptionRow, type TripOptionDefinition } from "./TripOptionRow";
import { TripStatusDropdown } from "./TripStatusDropdown";
import { styles } from "./tripOptionsSheet.styles";

export type TripOptionAction =
  | "edit"
  | "share"
  | "close-orders"
  | "cancel"
  | "delete";

interface TripOptionsSheetProps {
  visible: boolean;
  acceptsNewOrders: boolean;
  isUpdatingOrderAvailability: boolean;
  tripStatus: string;
  isUpdatingTripStatus: boolean;
  pendingTripStatus?: TripStatus;
  onClose: () => void;
  onToggleOrderAvailability: (closed: boolean) => void;
  onUpdateTripStatus: (status: TripStatus) => void;
  onSelect: (action: TripOptionAction) => void;
}

const options: Record<TripOptionAction, TripOptionDefinition> = {
  edit: {
    icon: "pencil-outline",
    title: "Edit Trip",
    description: "Update trip details, stores, times, and order limits.",
  },
  share: {
    icon: "share-variant-outline",
    title: "Share Trip",
    description: "Share this trip link to let others request orders.",
  },
  "close-orders": {
    icon: "account-multiple-outline",
    title: "Close to New Orders",
    description: "Stop accepting new requests. Current orders won't be affected.",
  },
  cancel: {
    icon: "trash-can-outline",
    title: "Cancel Trip",
    description:
      "Cancel this trip and notify all requesters. Active orders will be refunded.",
  },
  delete: {
    icon: "delete-outline",
    title: "Delete Trip",
    description: "Permanently remove this trip from your trips.",
  },
};

export function TripOptionsSheet({
  visible,
  acceptsNewOrders,
  isUpdatingOrderAvailability,
  tripStatus,
  isUpdatingTripStatus,
  pendingTripStatus,
  onClose,
  onToggleOrderAvailability,
  onUpdateTripStatus,
  onSelect,
}: TripOptionsSheetProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const [isCloseOrdersExpanded, setIsCloseOrdersExpanded] = useState(false);
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);
  const dragOffset = useRef(new Animated.Value(0)).current;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_event, gestureState) =>
        gestureState.dy > 5 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderMove: (_event, gestureState) => {
        dragOffset.setValue(Math.max(0, gestureState.dy));
      },
      onPanResponderRelease: (_event, gestureState) => {
        if (gestureState.dy > 90 || gestureState.vy > 0.8) {
          dragOffset.setValue(0);
          onCloseRef.current();
          return;
        }

        Animated.spring(dragOffset, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(dragOffset, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      setIsCloseOrdersExpanded(false);
      setIsStatusExpanded(false);
      dragOffset.setValue(0);
    }
  }, [dragOffset, visible]);

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
        <Animated.View
          style={[
            styles.sheet,
            {
              marginTop: insets.top + theme.spacing.lg,
              paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
              transform: [{ translateY: dragOffset }],
            },
          ]}
        >
          <Animated.View
            {...panResponder.panHandlers}
            style={styles.grabberArea}
          >
            <View style={styles.grabber} />
          </Animated.View>
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
            <TripOptionRow
              option={options.edit}
              onPress={() => onSelect("edit")}
            />
            <TripOptionRow
              option={options.share}
              onPress={() => onSelect("share")}
            />
            <TripOptionRow
              option={options["close-orders"]}
              onPress={() => {
                setIsStatusExpanded(false);
                setIsCloseOrdersExpanded((expanded) => !expanded);
              }}
              expanded={isCloseOrdersExpanded}
            />
            {isCloseOrdersExpanded ? (
              <View style={styles.toggleCard}>
                <View style={styles.toggleHeader}>
                  <Text style={styles.optionTitle}>Close to New Orders</Text>
                  <Switch
                    accessibilityLabel={
                      acceptsNewOrders
                        ? "Close trip to new orders"
                        : "Reopen trip to new orders"
                    }
                    accessibilityHint="Turn on to stop accepting new requests for this trip."
                    disabled={isUpdatingOrderAvailability}
                    value={!acceptsNewOrders}
                    onValueChange={onToggleOrderAvailability}
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
                    color={theme.colors.text}
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

            <TripOptionRow
              option={{
                icon: "list-status",
                title: "Update Trip Status",
                description: "Change the current stage of this trip.",
              }}
              onPress={() => {
                setIsCloseOrdersExpanded(false);
                setIsStatusExpanded((expanded) => !expanded);
              }}
              expanded={isStatusExpanded}
              disabled={isUpdatingTripStatus}
            />
            {isStatusExpanded ? (
              <TripStatusDropdown
                currentStatus={tripStatus}
                isUpdating={isUpdatingTripStatus}
                pendingStatus={pendingTripStatus}
                onSelect={onUpdateTripStatus}
              />
            ) : null}
            <TripOptionRow
              option={options.cancel}
              onPress={() => onSelect("cancel")}
              destructive
              disabled={isUpdatingTripStatus}
            />
            <TripOptionRow
              option={options.delete}
              onPress={() => onSelect("delete")}
              destructive
              disabled={isUpdatingTripStatus}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
