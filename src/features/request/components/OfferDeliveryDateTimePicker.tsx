import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface OfferDeliveryDateTimePickerProps {
  value: Date;
  minimumDate: Date;
  maximumDate?: Date;
  onChange: (value: Date) => void;
}

type PickerMode = "date" | "time";

export function OfferDeliveryDateTimePicker({
  value,
  minimumDate,
  maximumDate,
  onChange,
}: OfferDeliveryDateTimePickerProps) {
  const { theme } = useUnistyles();
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);

  const handlePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "dismissed") {
      setPickerMode(null);
      return;
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
    if (Platform.OS !== "ios") {
      setPickerMode(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Proposed latest delivery</Text>
      <View style={styles.dateTimeRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setPickerMode("date")}
          style={styles.dateTimeButton}
        >
          <MaterialCommunityIcons
            name="calendar-outline"
            size={18}
            color={theme.colors.text}
          />
          <Text style={styles.dateTimeText}>{value.toLocaleDateString()}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setPickerMode("time")}
          style={styles.dateTimeButton}
        >
          <MaterialCommunityIcons
            name="clock-outline"
            size={18}
            color={theme.colors.text}
          />
          <Text style={styles.dateTimeText}>
            {value.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </Text>
        </Pressable>
      </View>
      {pickerMode ? (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerTabs}>
            <Pressable
              onPress={() => setPickerMode("date")}
              style={[
                styles.pickerTab,
                pickerMode === "date" && styles.pickerTabSelected,
              ]}
            >
              <Text style={styles.pickerTabText}>Date</Text>
            </Pressable>
            <Pressable
              onPress={() => setPickerMode("time")}
              style={[
                styles.pickerTab,
                pickerMode === "time" && styles.pickerTabSelected,
              ]}
            >
              <Text style={styles.pickerTabText}>Time</Text>
            </Pressable>
            {Platform.OS === "ios" ? (
              <Pressable
                onPress={() => setPickerMode(null)}
                style={styles.donePicker}
              >
                <Text style={styles.donePickerText}>Done</Text>
              </Pressable>
            ) : null}
          </View>
          <DateTimePicker
            value={value}
            mode={pickerMode}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            minimumDate={pickerMode === "date" ? minimumDate : undefined}
            maximumDate={pickerMode === "date" ? maximumDate : undefined}
            onChange={handlePickerChange}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.xs,
  },
  label: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  dateTimeButton: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    minHeight: 48,
    paddingHorizontal: theme.spacing.sm,
  },
  dateTimeText: {
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  pickerContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
  },
  pickerTabs: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: theme.spacing.sm,
  },
  pickerTab: {
    borderBottomColor: "transparent",
    borderBottomWidth: 2,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  pickerTabSelected: {
    borderBottomColor: theme.colors.primary,
  },
  pickerTabText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  donePicker: {
    marginLeft: "auto",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  donePickerText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
}));
