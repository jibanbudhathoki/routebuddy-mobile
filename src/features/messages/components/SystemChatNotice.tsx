import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { Message } from "../types/message.types";

export function SystemChatNotice({ message }: { message: Message }) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name="information-outline"
            size={19}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Trip update</Text>
          <Text style={styles.text}>{message.text}</Text>
          <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
        </View>
      </View>
    </View>
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

const styles = StyleSheet.create((theme) => ({
  wrapper: {
    alignItems: "center",
    marginVertical: theme.spacing.xs,
  },
  card: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    flexDirection: "row",
    maxWidth: "88%",
    padding: theme.spacing.sm,
  },
  icon: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    height: 30,
    justifyContent: "center",
    marginRight: theme.spacing.xs,
    width: 30,
  },
  copy: {
    flex: 1,
  },
  title: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 3,
  },
  text: {
    color: theme.colors.text,
    fontSize: 11,
    lineHeight: 16,
  },
  time: {
    color: theme.colors.muted,
    fontSize: 9,
    marginTop: 4,
  },
}));
