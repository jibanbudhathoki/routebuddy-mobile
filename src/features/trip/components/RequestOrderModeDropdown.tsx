import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { styles } from "./requestOrderModeDropdown.styles";

export type RequestOrderMode = "posted" | "assigned";

const options: Array<{ value: RequestOrderMode; label: string }> = [
  { value: "posted", label: "Posted By Me" },
  { value: "assigned", label: "Assigned to me" },
];

export function RequestOrderModeDropdown({
  value,
  onChange,
}: {
  value: RequestOrderMode;
  onChange: (value: RequestOrderMode) => void;
}) {
  const { theme } = useUnistyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Request orders: ${selectedOption?.label}`}
        accessibilityState={{ expanded: isExpanded }}
        onPress={() => setIsExpanded((expanded) => !expanded)}
        style={styles.currentSelection}
      >
        <Text style={styles.currentLabel}>{selectedOption?.label}</Text>
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={theme.colors.primary}
        />
      </Pressable>
      {isExpanded
        ? options.map((option) => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => {
                  onChange(option.value);
                  setIsExpanded(false);
                }}
                style={[styles.option, selected && styles.selectedOption]}
              >
                <Text
                  style={[styles.label, selected && styles.selectedLabel]}
                >
                  {option.label}
                </Text>
                {selected ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color={theme.colors.onPrimary}
                  />
                ) : null}
              </Pressable>
            );
          })
        : null}
    </View>
  );
}
