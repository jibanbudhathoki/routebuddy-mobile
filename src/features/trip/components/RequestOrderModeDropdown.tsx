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
  assignedCount = 0,
}: {
  value: RequestOrderMode;
  onChange: (value: RequestOrderMode) => void;
  assignedCount?: number;
}) {
  const { theme } = useUnistyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Request orders: ${selectedOption?.label}${
          value === "assigned" && assignedCount > 0
            ? `, ${assignedCount} active`
            : ""
        }`}
        accessibilityState={{ expanded: isExpanded }}
        onPress={() => setIsExpanded((expanded) => !expanded)}
        style={styles.currentSelection}
      >
        <View style={styles.currentContent}>
          <Text style={styles.currentLabel}>{selectedOption?.label}</Text>
          {value === "assigned" && assignedCount > 0 ? (
            <CountBadge count={assignedCount} />
          ) : null}
        </View>
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={theme.colors.text}
        />
      </Pressable>
      {isExpanded
        ? options.map((option) => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityLabel={`${option.label}${
                  option.value === "assigned" && assignedCount > 0
                    ? `, ${assignedCount} active`
                    : ""
                }`}
                accessibilityState={{ selected }}
                onPress={() => {
                  onChange(option.value);
                  setIsExpanded(false);
                }}
                style={[styles.option, selected && styles.selectedOption]}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[styles.label, selected && styles.selectedLabel]}
                  >
                    {option.label}
                  </Text>
                  {option.value === "assigned" && assignedCount > 0 ? (
                    <CountBadge
                      count={assignedCount}
                      selected={selected}
                    />
                  ) : null}
                </View>
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

function CountBadge({
  count,
  selected = false,
}: {
  count: number;
  selected?: boolean;
}) {
  return (
    <View
      style={[
        styles.countBadge,
        selected && styles.selectedCountBadge,
      ]}
    >
      <Text
        style={[
          styles.countText,
          selected && styles.selectedCountText,
        ]}
      >
        {count > 99 ? "99+" : count}
      </Text>
    </View>
  );
}
