import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

type PickerMode = "date" | "time";

interface EditTripDateTimeFieldProps {
  label: string;
  value: string;
  minimumDate?: Date;
  onChange: (value: string) => void;
}

export function EditTripDateTimeField({
  label,
  value,
  minimumDate,
  onChange,
}: EditTripDateTimeFieldProps) {
  const { theme } = useUnistyles();
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);
  const date = new Date(value);

  const handleChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "dismissed") {
      setPickerMode(null);
      return;
    }
    if (selectedDate) onChange(selectedDate.toISOString());
    if (Platform.OS !== "ios") setPickerMode(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setPickerMode("date")}
          style={styles.valueButton}
        >
          <MaterialCommunityIcons
            name="calendar-outline"
            size={17}
            color={theme.colors.primary}
          />
          <Text style={styles.valueText}>{date.toLocaleDateString()}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setPickerMode("time")}
          style={styles.valueButton}
        >
          <MaterialCommunityIcons
            name="clock-outline"
            size={17}
            color={theme.colors.primary}
          />
          <Text style={styles.valueText}>
            {date.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </Text>
        </Pressable>
      </View>
      {pickerMode ? (
        <View style={styles.picker}>
          {Platform.OS === "ios" ? (
            <View style={styles.pickerHeader}>
              <Pressable onPress={() => setPickerMode("date")}>
                <Text style={styles.pickerAction}>Date</Text>
              </Pressable>
              <Pressable onPress={() => setPickerMode("time")}>
                <Text style={styles.pickerAction}>Time</Text>
              </Pressable>
              <Pressable onPress={() => setPickerMode(null)}>
                <Text style={styles.pickerAction}>Done</Text>
              </Pressable>
            </View>
          ) : null}
          <DateTimePicker
            value={date}
            mode={pickerMode}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            minimumDate={pickerMode === "date" ? minimumDate : undefined}
            onChange={handleChange}
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
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  valueButton: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    minHeight: 44,
    paddingHorizontal: theme.spacing.sm,
  },
  valueText: {
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "600",
  },
  picker: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs,
  },
  pickerHeader: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  pickerAction: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
}));
