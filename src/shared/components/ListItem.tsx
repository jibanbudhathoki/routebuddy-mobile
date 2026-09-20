import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface ListItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  rightText?: string;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
  isCounter?: boolean;
  counterValue?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  // Support custom components in the right section (e.g. badges, locks)
  rightContent?: React.ReactNode; 
}

export function ListItem({
  icon,
  title,
  subtitle,
  rightText,
  rightIcon = "chevron-right",
  onPress,
  isCounter,
  counterValue,
  onIncrement,
  onDecrement,
  rightContent,
}: ListItemProps) {
  const { theme } = useUnistyles();

  return (
    <TouchableOpacity
      style={styles.listItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.listItemLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={28}
          color={theme.colors.primary}
        />
        <View style={styles.listItemTextContainer}>
          <Text style={styles.listItemTitle}>{title}</Text>
          <Text style={styles.listItemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {isCounter ? (
        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.counterButton} onPress={onDecrement}>
            <MaterialCommunityIcons
              name="minus"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.counterText}>{counterValue}</Text>
          <TouchableOpacity style={styles.counterButton} onPress={onIncrement}>
            <MaterialCommunityIcons
              name="plus"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      ) : rightContent ? (
        <View style={styles.listItemRight}>{rightContent}</View>
      ) : (
        <View style={styles.listItemRight}>
          {rightText && (
            <Text style={styles.listItemRightText}>{rightText}</Text>
          )}
          {rightIcon && (
            <MaterialCommunityIcons
              name={rightIcon}
              size={24}
              color={theme.colors.primary}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  listItemTextContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  listItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemRightText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
  },
  counterButton: {
    padding: theme.spacing.xs,
  },
  counterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginHorizontal: theme.spacing.md,
  },
}));
