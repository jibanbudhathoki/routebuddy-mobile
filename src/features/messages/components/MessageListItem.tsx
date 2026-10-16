import React, { useRef } from 'react';
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
  tripInfo: string;
  messagePreview: string;
  timestamp: string;
  unreadCount?: number;
  onPress?: () => void;
  onMarkRead?: () => void;
  onDelete?: () => void;
}

export function MessageListItem({
  avatarUrl,
  name,
  tripInfo,
  messagePreview,
  timestamp,
  unreadCount,
  onPress,
  onMarkRead,
  onDelete,
}: MessageListItemProps) {
  const { theme } = useUnistyles();
  const swipeableRef = useRef<Swipeable>(null);
  const unreadMessages = unreadCount ?? 0;
  const isUnread = unreadMessages > 0;

  const renderRightActions = (_progress: Animated.AnimatedInterpolation<number>, _dragX: Animated.AnimatedInterpolation<number>) => {
    return (
      <View style={styles.rightActionsContainer}>
        <TouchableOpacity 
          accessibilityRole="button"
          accessibilityLabel="Mark conversation as read"
          style={[styles.actionButton, styles.readAction]} 
          onPress={() => {
            swipeableRef.current?.close();
            onMarkRead?.();
          }}
        >
          <View style={[styles.actionIcon, styles.readActionIcon]}>
            <MaterialCommunityIcons name="email-open-outline" size={20} color={theme.colors.onPrimary} />
          </View>
          <Text style={styles.actionText}>Mark read</Text>
        </TouchableOpacity>
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
        style={[styles.container, isUnread && styles.unreadContainer]}
        onPress={onPress}
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image
              source={
                typeof avatarUrl === "string" ? { uri: avatarUrl } : avatarUrl
              }
              style={styles.avatar}
              contentFit="cover"
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
          {isUnread ? <View style={styles.unreadDot} /> : null}
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
          <Text style={styles.tripInfo} numberOfLines={1}>
            {tripInfo}
          </Text>
          <View style={styles.previewRow}>
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
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    minHeight: 86,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  unreadContainer: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
    borderLeftWidth: 4,
  },
  unreadDot: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.surface,
    borderRadius: 5,
    borderWidth: 2,
    height: 12,
    position: "absolute",
    right: -2,
    top: -2,
    width: 12,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
  },
  unreadName: {
    fontWeight: "800",
  },
  timestamp: {
    fontSize: 13,
    color: theme.colors.muted,
    marginLeft: theme.spacing.sm,
  },
  unreadTimestamp: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  tripInfo: {
    fontSize: 12,
    color: theme.colors.muted,
    marginBottom: 4,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreview: {
    fontSize: 13,
    color: theme.colors.muted,
    flex: 1,
  },
  unreadMessagePreview: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  unreadText: {
    color: theme.colors.onPrimary,
    fontSize: 10,
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
  readActionIcon: {
    backgroundColor: theme.colors.primaryRaised,
  },
  deleteActionIcon: {
    backgroundColor: theme.colors.error,
  },
  readAction: {
    backgroundColor: theme.colors.primary,
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
