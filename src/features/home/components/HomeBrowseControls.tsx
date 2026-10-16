import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { HomeFiltersModal } from "./HomeFiltersModal";
import type { HomeFilterOption } from "../types/homeFilters";

export type BrowseMode = "trips" | "requests";

interface HomeBrowseControlsProps {
  mode: BrowseMode;
  search: string;
  locationFilter: string;
  dateFilter: string;
  storeFilter: string;
  onModeChange: (mode: BrowseMode) => void;
  onSearchChange: (search: string) => void;
  locationOptions: HomeFilterOption[];
  storeOptions: HomeFilterOption[];
  onLocationFilterChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onStoreFilterChange: (value: string) => void;
}

export function HomeBrowseControls({
  mode,
  search,
  locationFilter,
  dateFilter,
  storeFilter,
  locationOptions,
  storeOptions,
  onModeChange,
  onSearchChange,
  onLocationFilterChange,
  onDateFilterChange,
  onStoreFilterChange,
}: HomeBrowseControlsProps) {
  const { theme } = useUnistyles();
  const [filtersVisible, setFiltersVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === "trips" }}
          onPress={() => onModeChange("trips")}
          style={[styles.tab, mode === "trips" && styles.selectedTab]}
        >
          <Text
            style={[
              styles.tabText,
              mode === "trips" && styles.selectedTabText,
            ]}
          >
            Trips
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === "requests" }}
          onPress={() => onModeChange("requests")}
          style={[styles.tab, mode === "requests" && styles.selectedTab]}
        >
          <Text
            style={[
              styles.tabText,
              mode === "requests" && styles.selectedTabText,
            ]}
          >
            Open Requests
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <MaterialCommunityIcons
            name="magnify"
            size={18}
            color={theme.colors.muted}
          />
          <TextInput
            accessibilityLabel={
              mode === "trips"
                ? "Search trips, locations, or stores"
                : "Search requests, locations, or stores"
            }
            placeholder={
              mode === "trips"
                ? "Search trips, locations or store"
                : "Search requests, locations or store"
            }
            placeholderTextColor={theme.colors.muted}
            value={search}
            onChangeText={onSearchChange}
            style={styles.input}
            returnKeyType="search"
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open filters"
          onPress={() => setFiltersVisible(true)}
          style={styles.filterButton}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={16}
            color={theme.colors.text}
          />
          <Text style={styles.filterButtonText}>Filters</Text>
        </Pressable>
      </View>

      <HomeFiltersModal
        visible={filtersVisible}
        locationOptions={locationOptions}
        storeOptions={storeOptions}
        values={{
          location: locationFilter,
          date: dateFilter,
          store: storeFilter,
        }}
        onApply={(values) => {
          onLocationFilterChange(values.location);
          onDateFilterChange(values.date);
          onStoreFilterChange(values.store);
        }}
        onClose={() => setFiltersVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    paddingBottom: theme.spacing.sm,
  },
  tabs: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  tab: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    minHeight: 32,
  },
  selectedTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "500",
  },
  selectedTabText: {
    color: theme.colors.onPrimary,
    fontWeight: "700",
  },
  searchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  searchInput: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    flex: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    height: 36,
    paddingHorizontal: theme.spacing.sm,
  },
  input: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  filterButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  },
  filterButtonText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
}));
