import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { styles } from "./tripOptionsSheet.styles";

export interface TripOptionDefinition {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
}

interface TripOptionRowProps {
  option: TripOptionDefinition;
  onPress: () => void;
  destructive?: boolean;
  expanded?: boolean;
  disabled?: boolean;
}

export function TripOptionRow({
  option,
  onPress,
  destructive = false,
  expanded = false,
  disabled = false,
}: TripOptionRowProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.option, disabled && styles.optionDisabled]}
    >
      <View
        style={[styles.optionIcon, destructive && styles.destructiveIcon]}
      >
        <MaterialCommunityIcons
          name={option.icon}
          size={19}
          color={destructive ? theme.colors.error : theme.colors.text}
        />
      </View>
      <View style={styles.optionCopy}>
        <Text
          style={[
            styles.optionTitle,
            destructive && styles.destructiveTitle,
          ]}
        >
          {option.title}
        </Text>
        <Text style={styles.optionDescription}>{option.description}</Text>
      </View>
      <MaterialCommunityIcons
        name={expanded ? "chevron-down" : "chevron-right"}
        size={20}
        color={theme.colors.text}
      />
    </Pressable>
  );
}
