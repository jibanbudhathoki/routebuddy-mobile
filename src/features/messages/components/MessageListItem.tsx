import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Image } from 'expo-image';
import type { ImageSourcePropType } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface MessageListItemProps {
  id: string;
  avatarUrl: string | ImageSourcePropType | null;
  name: string;
  messagePreview: string;
  timestamp: string;
  unreadCount?: number;
  latestMessageIsOwn?: boolean;
  latestMessageIsRead?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
}

export function MessageListItem({
  avatarUrl,
  name,
  messagePreview,
  timestamp,
  unreadCount,
  latestMessageIsOwn = false,
  latestMessageIsRead = false,
  onPress,
  onDelete,
}: MessageListItemProps) {
  const { theme } = useUnistyles();
  const swipeableRef = useRef<Swipeable>(null);
  const [hasAvatarLoadError, setHasAvatarLoadError] = useState(false);
  const unreadMessages = unreadCount ?? 0;
  const isUnread = unreadMessages > 0;
  const avatarUri = typeof avatarUrl === "string" ? avatarUrl.trim() : "";
  const avatarSource =
    typeof avatarUrl === "string"
      ? avatarUri
        ? { uri: avatarUri }
        : null
      : avatarUrl;

  useEffect(() => {
    setHasAvatarLoadError(false);
  }, [avatarUri]);

  const renderRightActions = (_progress: Animated.AnimatedInterpolation<number>, _dragX: Animated.AnimatedInterpolation<number>) => {
    return (
      <View style={styles.rightActionsContainer}>
        <TouchableOpacity 
          accessibilityRole="button"
          accessibilityLabel="Delete conversation"
          style={[styles.actionButton, styles.deleteAction]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete?.();
          }}
        >
          <View style={[styles.actionIcon, styles.deleteActionIcon]}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.onPrimary} />
          </View>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`${name}${isUnread ? `, ${unreadMessages} unread messages` : ""}. ${messagePreview}`}
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View style={styles.avatarContainer}>
          {avatarSource && !hasAvatarLoadError ? (
            <Image
              source={avatarSource}
              style={styles.avatar}
              contentFit="cover"
              onError={() => setHasAvatarLoadError(true)}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <MaterialCommunityIcons
                name="account"
                size={32}
                color={theme.colors.surface}
              />
            </View>
          )}
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.name, isUnread && styles.unreadName]}
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text style={[styles.timestamp, isUnread && styles.unreadTimestamp]}>
              {timestamp}
            </Text>
          </View>
          <View style={styles.previewRow}>
            {latestMessageIsOwn ? (
              <MaterialCommunityIcons
                name={latestMessageIsRead ? "check-all" : "check"}
                size={16}
                color={
                  latestMessageIsRead
                    ? theme.colors.primary
                    : theme.colors.muted
                }
                style={styles.sentStatus}
                accessibilityLabel={
                  latestMessageIsRead ? "Latest message read" : "Latest message sent"
                }
              />
            ) : null}
            <Text
              style={[
                styles.messagePreview,
                isUnread && styles.unreadMessagePreview,
              ]}
              numberOfLines={1}
            >
              {messagePreview}
            </Text>
            {isUnread ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {unreadMessages > 99 ? "99+" : unreadMessages}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    minHeight: 78,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
    justifyContent: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: theme.colors.primarySoft,
  },
  avatarFallback: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: "stretch",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: theme.spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  unreadName: {
    fontWeight: "700",
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.muted,
    marginLeft: theme.spacing.sm,
  },
  unreadTimestamp: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagePreview: {
    fontSize: 14,
    color: theme.colors.muted,
    flex: 1,
  },
  sentStatus: {
    marginRight: theme.spacing.xs,
  },
  unreadMessagePreview: {
    color: theme.colors.text,
    fontWeight: "500",
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: theme.spacing.sm,
  },
  unreadText: {
    color: theme.colors.onPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  rightActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  actionButton: {
    width: 78,
    height: 72,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
    elevation: 3,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3,
  },
  deleteActionIcon: {
    backgroundColor: theme.colors.error,
  },
  deleteAction: {
    backgroundColor: theme.colors.error,
  },
  actionText: {
    color: theme.colors.onPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
}));
