import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { homeFiltersModalStyles as styles } from "./HomeFiltersModal.styles";
import type { HomeFilterOption } from "../types/homeFilters";

interface HomeFilterDropdownProps {
  label: string;
  placeholder: string;
  options: HomeFilterOption[];
  value: string;
  expanded: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

export function HomeFilterDropdown({
  label,
  placeholder,
  options,
  value,
  expanded,
  onToggle,
  onSelect,
}: HomeFilterDropdownProps) {
  const { theme } = useUnistyles();
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedLabel ?? placeholder}`}
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={styles.dropdown}
      >
        <Text
          numberOfLines={1}
          style={[styles.dropdownText, !selectedLabel && styles.placeholder]}
        >
          {selectedLabel ?? placeholder}
        </Text>
        <MaterialCommunityIcons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.colors.muted}
        />
      </Pressable>
      {expanded ? (
        <View style={styles.dropdownOptions}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={styles.dropdownList}
          >
            {options.length ? (
              options.map((option) => (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: option.value === value }}
                  onPress={() => onSelect(option.value)}
                  style={styles.dropdownOption}
                >
                  <Text style={styles.dropdownOptionText}>{option.label}</Text>
                  {option.value === value ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={18}
                      color={theme.colors.primary}
                    />
                  ) : null}
                </Pressable>
              ))
            ) : (
              <Text style={styles.noOptions}>No options available</Text>
            )}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
