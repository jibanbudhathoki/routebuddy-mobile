import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ProfileMenuItemProps {
  iconName: IconName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  isFirst?: boolean;
}

export function ProfileMenuItem({
  iconName,
  title,
  subtitle,
  onPress,
  isFirst = false,
}: ProfileMenuItemProps) {
  const { theme } = useUnistyles();

  return (
    <TouchableOpacity
      style={[styles.container, !isFirst && styles.topBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={iconName} size={24} color={theme.colors.text} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={styles.chevronContainer}>
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.muted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  topBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 13,
  },
  chevronContainer: {
    marginLeft: 16,
  },
}));
