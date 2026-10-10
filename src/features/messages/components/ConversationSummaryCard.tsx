import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

export function ConversationSummaryCard({
  contextTitle,
  contextId,
}: {
  contextTitle: string;
  contextId: string;
}) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <MaterialCommunityIcons
          name="bag-checked"
          size={25}
          color={theme.colors.onPrimary}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{contextTitle}</Text>
          <Text style={styles.overline}>MESSAGES</Text>
        </View>
        <Text style={styles.route} numberOfLines={1}>
          Order and delivery conversation
        </Text>
        <View style={styles.meta}>
          <MaterialCommunityIcons
            name="identifier"
            size={13}
            color={theme.colors.muted}
          />
          <Text style={styles.metaText}>
            {contextId ? `Conversation ${contextId.slice(0, 8)}` : "Conversation"}
          </Text>
          <View style={styles.divider} />
          <MaterialCommunityIcons
            name="message-text-outline"
            size={13}
            color={theme.colors.muted}
          />
          <Text style={styles.metaText}>Direct chat</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  icon: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    height: 54,
    justifyContent: "center",
    marginRight: theme.spacing.sm,
    width: 54,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.primary,
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
  },
  overline: {
    color: theme.colors.muted,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.4,
    marginLeft: theme.spacing.xs,
  },
  route: {
    color: theme.colors.text,
    fontSize: 11,
    marginTop: 4,
  },
  meta: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 6,
  },
  metaText: {
    color: theme.colors.muted,
    fontSize: 9,
    marginLeft: 3,
  },
  divider: {
    backgroundColor: theme.colors.border,
    height: 11,
    marginHorizontal: theme.spacing.xs,
    width: 1,
  },
}));
