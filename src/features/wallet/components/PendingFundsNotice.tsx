import React from "react";
import { View, Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function PendingFundsNotice() {
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="clock-outline"
        size={22}
        color={theme.colors.text}
      />
      <Text style={styles.text}>
        Pending funds unlock when deliveries are confirmed.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: theme.colors.text,
    lineHeight: 18,
  },
}));
