import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { HomeFilterPickerModal } from "./HomeFilterPickerModal";
import type {
  HomeFilterKind,
  HomeFilterOption,
} from "../types/homeFilters";

interface HomeFilterChipsProps {
  locationOptions: HomeFilterOption[];
  dateOptions: HomeFilterOption[];
  storeOptions: HomeFilterOption[];
  locationFilter: string;
  dateFilter: string;
  storeFilter: string;
  onLocationChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onStoreChange: (value: string) => void;
}

export function HomeFilterChips({
  locationOptions,
  dateOptions,
  storeOptions,
  locationFilter,
  dateFilter,
  storeFilter,
  onLocationChange,
  onDateChange,
  onStoreChange,
}: HomeFilterChipsProps) {
  const [activeFilter, setActiveFilter] = useState<HomeFilterKind | null>(null);
  const { theme } = useUnistyles();

  const options =
    activeFilter === "location"
      ? locationOptions
      : activeFilter === "date"
        ? dateOptions
        : storeOptions;
  const title =
    activeFilter === "location"
      ? "Filter by location"
      : activeFilter === "date"
        ? "Filter by date"
        : "Filter by store";
  const selectedValue =
    activeFilter === "location"
      ? locationFilter
      : activeFilter === "date"
        ? dateFilter
        : storeFilter;
  const onSelect =
    activeFilter === "location"
      ? onLocationChange
      : activeFilter === "date"
        ? onDateChange
        : onStoreChange;

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <FilterChip
          icon="map-marker"
          label={getSelectedLabel(locationOptions, locationFilter)}
          onPress={() => setActiveFilter("location")}
        />
        <FilterChip
          icon="calendar-blank-outline"
          label={getSelectedLabel(dateOptions, dateFilter)}
          onPress={() => setActiveFilter("date")}
        />
        <FilterChip
          icon="store-outline"
          label={getSelectedLabel(storeOptions, storeFilter)}
          onPress={() => setActiveFilter("store")}
        />
      </ScrollView>
      <HomeFilterPickerModal
        visible={activeFilter !== null}
        title={title}
        options={options}
        selectedValue={selectedValue}
        onSelect={onSelect}
        onClose={() => setActiveFilter(null)}
      />
    </>
  );
}

function getSelectedLabel(options: HomeFilterOption[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function FilterChip({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} filter`}
      onPress={onPress}
      style={styles.filterChip}
    >
      <MaterialCommunityIcons
        name={icon}
        size={14}
        color={theme.colors.text}
      />
      <Text style={styles.filterChipText} numberOfLines={1}>
        {label}
      </Text>
      <MaterialCommunityIcons
        name="chevron-down"
        size={16}
        color={theme.colors.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  filters: {
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.sm,
  },
  filterChip: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.xs,
    height: 32,
    maxWidth: 160,
    paddingHorizontal: theme.spacing.sm,
  },
  filterChipText: {
    color: theme.colors.text,
    flexShrink: 1,
    fontSize: 10,
    fontWeight: "500",
  },
}));
