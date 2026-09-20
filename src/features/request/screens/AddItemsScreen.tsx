import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

export function AddItemsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Items / Instructions</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="close"
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Add the items you need or any{"\n"}special instructions for the driver.
        </Text>

        <View style={styles.emptyStateContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={80}
              color={theme.colors.primary}
            />
          </View>
          
          <Text style={styles.emptyStateTitle}>No items added yet</Text>
          <View style={styles.divider} />
          <Text style={styles.emptyStateSubtitle}>
            Tap the button below to{"\n"}add your items.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton 
          title="Add Items" 
          onPress={() => {
            // Push to the list builder, replacing this screen
            router.replace("/(modals)/request/build-shopping-list");
          }} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xl * 2,
    lineHeight: 30,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginTop: -40, // Adjust vertical center
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    borderRadius: 2,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: theme.colors.text,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
