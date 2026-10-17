import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { TextField } from "../../../shared/components/TextField";

export type CommunityTab = "browse" | "joined" | "submissions";

const tabs: { key: CommunityTab; label: string }[] = [
  { key: "browse", label: "Explore" },
  { key: "joined", label: "Joined" },
  { key: "submissions", label: "My submissions" },
];

interface CommunityScreenHeaderProps {
  activeTab: CommunityTab;
  search: string;
  onSelectTab: (tab: CommunityTab) => void;
  onSearchChange: (search: string) => void;
  onSuggest: () => void;
}

export function CommunityScreenHeader({
  activeTab,
  search,
  onSelectTab,
  onSearchChange,
  onSuggest,
}: CommunityScreenHeaderProps) {
  const router = useRouter();
  const { theme } = useUnistyles();
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Communities</Text>
          <Text style={styles.subtitle}>
            Find and connect with your local community.
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Suggest a community"
          onPress={onSuggest}
          style={styles.addButton}
        >
          <MaterialCommunityIcons
            name="plus"
            size={22}
            color={theme.colors.onPrimary}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        {tabs.map((tab) => {
          const selected = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => onSelectTab(tab.key)}
              style={[styles.tab, selected && styles.selectedTab]}
            >
              <Text
                numberOfLines={1}
                style={[styles.tabText, selected && styles.selectedTabText]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {activeTab === "browse" ? (
        <View style={styles.search}>
          <TextField
            accessibilityLabel="Search communities"
            placeholder="Search communities"
            value={search}
            onChangeText={onSearchChange}
            autoCapitalize="none"
            returnKeyType="search"
            leftElement={
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={theme.colors.muted}
              />
            }
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 32,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: 23,
    fontWeight: "700",
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: theme.spacing.xs,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  tabs: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    marginHorizontal: theme.spacing.md,
  },
  tab: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: theme.spacing.xs,
  },
  selectedTab: {
    borderBottomColor: theme.colors.primary,
    borderBottomWidth: 2,
  },
  tabText: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  selectedTabText: {
    color: theme.colors.text,
  },
  search: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
}));
