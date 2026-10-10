import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
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

  const renderRightActions = (_progress: Animated.AnimatedInterpolation<number>, _dragX: Animated.AnimatedInterpolation<number>) => {
    return (
      <View style={styles.rightActionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.readAction]} 
          onPress={() => {
            swipeableRef.current?.close();
            onMarkRead?.();
          }}
        >
          <MaterialCommunityIcons name="email-open-outline" size={24} color={theme.colors.onPrimary} />
          <Text style={styles.actionText}>Read</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteAction]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete?.();
          }}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={24} color={theme.colors.onPrimary} />
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
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.avatarContainer}>
        {avatarUrl ? (
          <Image
            source={typeof avatarUrl === 'string' ? { uri: avatarUrl } : avatarUrl}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <MaterialCommunityIcons name="account" size={32} color={theme.colors.surface} />
          </View>
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        <Text style={styles.tripInfo} numberOfLines={1}>{tripInfo}</Text>
        <View style={styles.previewRow}>
          <Text style={styles.messagePreview} numberOfLines={1}>
            {messagePreview}
          </Text>
          {unreadCount ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
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
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
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
  timestamp: {
    fontSize: 13,
    color: theme.colors.muted,
    marginLeft: theme.spacing.sm,
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
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
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
  },
  actionButton: {
    width: 70,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readAction: {
  backgroundColor: theme.colors.primary,
  },
  deleteAction: {
    backgroundColor: theme.colors.error,
  },
  actionText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
}));
