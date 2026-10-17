import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface ChatDetailHeaderProps {
  participantName: string;
  participantAvatar: string | null;
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
  participantAvatar,
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
          color={theme.colors.text}
        />
      </TouchableOpacity>
      <View style={styles.avatar}>
        {participantAvatar ? (
          <Image
            source={{ uri: participantAvatar }}
            style={styles.avatarImage}
            contentFit="cover"
            accessibilityLabel={`${participantName} profile photo`}
          />
        ) : (
          <MaterialCommunityIcons
            name="account"
            size={21}
            color={theme.colors.onPrimary}
          />
        )}
      </View>
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
              color={theme.colors.text}
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
            color={theme.colors.text}
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
  avatar: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 19,
    height: 38,
    justifyContent: "center",
    marginRight: theme.spacing.sm,
    overflow: "hidden",
    width: 38,
  },
  avatarImage: {
    height: "100%",
    width: "100%",
  },
  participantName: {
    color: theme.colors.text,
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
