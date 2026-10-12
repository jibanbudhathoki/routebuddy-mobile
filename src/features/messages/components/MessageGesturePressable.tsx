import { useRef, type ReactNode } from "react";
import { TouchableOpacity, type StyleProp, type ViewStyle } from "react-native";

interface MessageGesturePressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  selectionMode: boolean;
  accessibilityLabel: string;
  onPress: () => void;
  onLongPress: () => void;
  onDoubleTap: () => void;
}

export function MessageGesturePressable({
  children,
  style,
  selectionMode,
  accessibilityLabel,
  onPress,
  onLongPress,
  onDoubleTap,
}: MessageGesturePressableProps) {
  const lastTapAt = useRef(0);
  const longPressTriggered = useRef(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        if (longPressTriggered.current) {
          longPressTriggered.current = false;
          return;
        }

        const now = Date.now();
        if (!selectionMode && now - lastTapAt.current <= 300) {
          lastTapAt.current = 0;
          onDoubleTap();
        } else {
          lastTapAt.current = selectionMode ? 0 : now;
        }
        onPress();
      }}
      onLongPress={() => {
        longPressTriggered.current = true;
        lastTapAt.current = 0;
        onLongPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Swipe to reply, double tap to react, or press and hold to select."
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
}
