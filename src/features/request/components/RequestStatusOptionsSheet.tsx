import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { RequestDeliveryStatus } from "../types/request";
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
  pendingStatus?: RequestDeliveryStatus;
  onClose: () => void;
  onSelectStatus: (status: RequestDeliveryStatus) => void;
}

export function RequestStatusOptionsSheet({
  visible,
  currentStatus,
  isUpdating,
  pendingStatus,
  onClose,
  onSelectStatus,
}: RequestStatusOptionsSheetProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);

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
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: isStatusExpanded, disabled: isUpdating }}
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
