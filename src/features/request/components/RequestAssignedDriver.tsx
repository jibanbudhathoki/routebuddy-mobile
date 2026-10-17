import { Image } from "expo-image";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import type { RequestDetailsResponse } from "../types/request";

export function RequestAssignedDriver({
  driver,
}: {
  driver: NonNullable<RequestDetailsResponse["driver"]>;
}) {
  const name = driver.name || "Driver";
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.card}>
      {driver.photoUrl ? (
        <Image
          accessibilityLabel={`${name}'s profile photo`}
          contentFit="cover"
          source={{ uri: driver.photoUrl }}
          style={styles.avatar}
        />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
      )}
      <View style={styles.driverInfo}>
        <Text style={styles.eyebrow}>YOUR DRIVER</Text>
        <Text numberOfLines={1} style={styles.name}>
          {name}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  avatarFallback: {
    borderRadius: 24,
  },
  initials: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  driverInfo: {
    flex: 1,
    gap: 3,
  },
  eyebrow: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  name: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
}));
