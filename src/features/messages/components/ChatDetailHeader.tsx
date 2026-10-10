import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface ChatDetailHeaderProps {
  participantName: string;
  contextTitle: string;
  selectedCount: number;
  isDeleting: boolean;
  onBack: () => void;
  onCancelSelection: () => void;
  onDeleteSelected: () => void;
  onOptions: () => void;
}

export function ChatDetailHeader({
  participantName,
  contextTitle,
  selectedCount,
  isDeleting,
  onBack,
  onCancelSelection,
  onDeleteSelected,
  onOptions,
}: ChatDetailHeaderProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={styles.headerAction}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={23}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
      <View style={styles.title}>
        <Text numberOfLines={1} style={styles.participantName}>
          {participantName}
        </Text>
        <Text style={styles.contextSubtitle}>{contextTitle}</Text>
      </View>
      {selectedCount > 0 ? (
        <View style={styles.selectionToolbar}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Cancel message selection"
            onPress={onCancelSelection}
            style={styles.headerAction}
          >
            <MaterialCommunityIcons
              name="close"
              size={22}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.selectionCount}>{selectedCount} selected</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Delete selected messages"
            onPress={onDeleteSelected}
            style={styles.headerAction}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color={theme.colors.error} />
            ) : (
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={22}
                color={theme.colors.error}
              />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Conversation options"
          style={styles.headerAction}
          onPress={onOptions}
        >
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={23}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 58,
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
  },
  headerAction: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 38,
  },
  title: {
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  participantName: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  contextSubtitle: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 1,
  },
  selectionToolbar: {
    alignItems: "center",
    flexDirection: "row",
  },
  selectionCount: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "600",
    marginHorizontal: theme.spacing.xs,
  },
}));
