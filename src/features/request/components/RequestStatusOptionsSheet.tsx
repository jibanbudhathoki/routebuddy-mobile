import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { RequestAction, RequestDeliveryStatus } from "../types/request";
import { styles } from "./requestStatusOptionsSheet.styles";

const statusOptions: Array<{
  status: RequestDeliveryStatus;
  label: string;
}> = [
  { status: "shopping", label: "Shopping" },
  { status: "delivering", label: "Delivering" },
  { status: "delivered", label: "Delivered" },
];

interface RequestStatusOptionsSheetProps {
  visible: boolean;
  currentStatus: string;
  isUpdating: boolean;
  respondingAction?: RequestAction;
  pendingStatus?: RequestDeliveryStatus;
  onClose: () => void;
  onSelectStatus: (status: RequestDeliveryStatus) => void;
  onRespondToOrder: (action: RequestAction) => void;
}

export function RequestStatusOptionsSheet({
  visible,
  currentStatus,
  isUpdating,
  respondingAction,
  pendingStatus,
  onClose,
  onSelectStatus,
  onRespondToOrder,
}: RequestStatusOptionsSheetProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);
  const canRespond = currentStatus.toLowerCase() === "open";
  const isResponding = Boolean(respondingAction);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent={Platform.OS === "android"}
      navigationBarTranslucent={Platform.OS === "android"}
      onRequestClose={onClose}
      onShow={() => setIsStatusExpanded(false)}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close order options"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, theme.spacing.xl) },
          ]}
        >
          <View style={styles.grabber} />
          <View style={styles.header}>
            <Text style={styles.title}>Order Options</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close order options"
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
          {canRespond ? (
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Accept order"
                accessibilityState={{ disabled: isResponding }}
                disabled={isResponding}
                onPress={() => onRespondToOrder("accept")}
                style={[
                  styles.acceptButton,
                  isResponding && styles.disabledButton,
                ]}
              >
                {respondingAction === "accept" ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.onPrimary}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color={theme.colors.onPrimary}
                  />
                )}
                <Text style={styles.acceptText}>
                  {respondingAction === "accept" ? "Accepting..." : "Accept"}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Reject order"
                accessibilityState={{ disabled: isResponding }}
                disabled={isResponding}
                onPress={() => onRespondToOrder("reject")}
                style={[
                  styles.rejectButton,
                  isResponding && styles.disabledButton,
                ]}
              >
                {respondingAction === "reject" ? (
                  <ActivityIndicator size="small" color={theme.colors.error} />
                ) : (
                  <MaterialCommunityIcons
                    name="close"
                    size={16}
                    color={theme.colors.error}
                  />
                )}
                <Text style={styles.rejectText}>
                  {respondingAction === "reject" ? "Rejecting..." : "Reject"}
                </Text>
              </Pressable>
            </View>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              expanded: isStatusExpanded,
              disabled: isUpdating,
            }}
            disabled={isUpdating}
            onPress={() => setIsStatusExpanded((expanded) => !expanded)}
            style={styles.dropdown}
          >
            <View style={styles.statusIcon}>
              <MaterialCommunityIcons
                name="truck-check-outline"
                size={19}
                color={theme.colors.text}
              />
            </View>
            <View style={styles.dropdownCopy}>
              <Text style={styles.dropdownTitle}>Update Request Status</Text>
              <Text style={styles.dropdownValue}>
                {formatStatus(currentStatus)}
              </Text>
            </View>
            <MaterialCommunityIcons
              name={isStatusExpanded ? "chevron-up" : "chevron-down"}
              size={21}
              color={theme.colors.muted}
            />
          </Pressable>
          {isStatusExpanded
            ? statusOptions.map(({ status, label }) => {
                const selected = currentStatus.toLowerCase() === status;
                const isPending = isUpdating && pendingStatus === status;
                return (
                  <Pressable
                    key={status}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected,
                      disabled: isUpdating || selected,
                      busy: isPending,
                    }}
                    disabled={isUpdating || selected}
                    onPress={() => onSelectStatus(status)}
                    style={[
                      styles.statusOption,
                      selected && styles.selectedOption,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusOptionLabel,
                        selected && styles.selectedLabel,
                      ]}
                    >
                      {label}
                    </Text>
                    {isPending ? (
                      <MaterialCommunityIcons
                        name="loading"
                        size={18}
                        color={theme.colors.text}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={selected ? "check-circle" : "chevron-right"}
                        size={18}
                        color={
                          selected ? theme.colors.primary : theme.colors.muted
                        }
                      />
                    )}
                  </Pressable>
                );
              })
            : null}
        </View>
      </View>
    </Modal>
  );
}

function formatStatus(status: string) {
  return status.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) =>
    letter.toUpperCase(),
  );
}
