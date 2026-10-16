import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import type { TripStatus } from "../types/trip";
import { styles } from "./tripOptionsSheet.styles";

const statusOptions: Array<{ status: TripStatus; title: string }> = [
  { status: "shopping", title: "Shopping" },
  { status: "delivering", title: "Delivering" },
  { status: "delivered", title: "Delivered" },
  { status: "completed", title: "Completed" },
];

interface TripStatusDropdownProps {
  currentStatus: string;
  isUpdating: boolean;
  pendingStatus?: TripStatus;
  onSelect: (status: TripStatus) => void;
}

export function TripStatusDropdown({
  currentStatus,
  isUpdating,
  pendingStatus,
  onSelect,
}: TripStatusDropdownProps) {
  const { theme } = useUnistyles();
  const normalizedStatus = currentStatus.toLowerCase();

  return (
    <View style={styles.statusDropdown}>
      <Text style={styles.statusPrompt}>Select the trip's current status</Text>
      {statusOptions.map(({ status, title }) => {
        const selected = normalizedStatus === status;
        return (
          <Pressable
            key={status}
            accessibilityRole="button"
            accessibilityState={{
              selected,
              disabled: selected || isUpdating,
              busy: isUpdating && pendingStatus === status,
            }}
            disabled={selected || isUpdating}
            onPress={() => onSelect(status)}
            style={[
              styles.statusChoice,
              selected && styles.statusChoiceSelected,
            ]}
          >
            <Text
              style={[
                styles.statusChoiceText,
                selected && styles.statusChoiceTextSelected,
              ]}
            >
              {title}
            </Text>
            {isUpdating && pendingStatus === status ? (
              <ActivityIndicator size="small" color={theme.colors.text} />
            ) : (
              <MaterialCommunityIcons
                name={selected ? "check-circle" : "chevron-right"}
                size={18}
                color={selected ? theme.colors.text : theme.colors.muted}
              />
            )}
          </Pressable>
        );
      })}
      <Text style={styles.statusFootnote}>
        To cancel a trip, use the separate Cancel Trip action.
      </Text>
    </View>
  );
}
