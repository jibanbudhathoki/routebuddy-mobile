import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export type BrowseMode = "trips" | "requests";

interface HomeBrowseControlsProps {
  mode: BrowseMode;
  search: string;
  locationFilter: string;
  dateFilter: string;
  storeFilter: string;
  showMoreFilters: boolean;
  onModeChange: (mode: BrowseMode) => void;
  onSearchChange: (search: string) => void;
  onLocationFilterPress: () => void;
  onDateFilterPress: () => void;
  onStoreFilterPress: () => void;
  onToggleMoreFilters: () => void;
}

export function HomeBrowseControls({
  mode,
  search,
  locationFilter,
  dateFilter,
  storeFilter,
  showMoreFilters,
  onModeChange,
  onSearchChange,
  onLocationFilterPress,
  onDateFilterPress,
  onStoreFilterPress,
  onToggleMoreFilters,
}: HomeBrowseControlsProps) {
  const { theme } = useUnistyles();

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
          onPress={onToggleMoreFilters}
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        <FilterChip
          icon="map-marker"
          label={locationFilter}
          onPress={onLocationFilterPress}
        />
        <FilterChip
          icon="calendar-blank-outline"
          label={dateFilter}
          onPress={onDateFilterPress}
        />
        <FilterChip
          icon="store-outline"
          label={storeFilter}
          onPress={onStoreFilterPress}
        />
      </ScrollView>

      {showMoreFilters && (
        <View style={styles.moreFilters}>
          <Text style={styles.moreFiltersText}>
            {mode === "trips"
              ? "Showing trips with available spots"
              : "Showing open requests"}
          </Text>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={theme.colors.primary}
          />
        </View>
      )}
    </View>
  );
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
      onPress={onPress}
      style={styles.filterChip}
    >
      <MaterialCommunityIcons
        name={icon}
        size={14}
        color={theme.colors.primary}
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
    fontSize: 11,
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
    fontSize: 10,
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
    fontSize: 11,
    fontWeight: "600",
  },
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
    maxWidth: 136,
    paddingHorizontal: theme.spacing.sm,
  },
  filterChipText: {
    color: theme.colors.text,
    fontSize: 10,
    fontWeight: "500",
    flexShrink: 1,
  },
  moreFilters: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
    justifyContent: "flex-end",
    paddingTop: theme.spacing.xs,
  },
  moreFiltersText: {
    color: theme.colors.muted,
    fontSize: 10,
  },
}));
