import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { View } from "react-native";
import type { ReactNode } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { useUnistyles } from "react-native-unistyles";

import { styles } from "./swipeToReplyMessage.styles";

interface SwipeToReplyMessageProps {
  children: ReactNode;
  enabled: boolean;
  onReply: () => void;
}

export function SwipeToReplyMessage({
  children,
  enabled,
  onReply,
}: SwipeToReplyMessageProps) {
  const { theme } = useUnistyles();
  const swipeableRef = useRef<Swipeable>(null);

  function renderReplyAction() {
    return (
      <View style={styles.replyAction}>
        <MaterialCommunityIcons
          name="reply"
          size={18}
          color={theme.colors.onPrimary}
        />
      </View>
    );
  }

  return (
    <Swipeable
      ref={swipeableRef}
      enabled={enabled}
      renderLeftActions={renderReplyAction}
      renderRightActions={renderReplyAction}
      friction={2}
      leftThreshold={48}
      rightThreshold={48}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableOpen={() => {
        onReply();
        swipeableRef.current?.close();
      }}
    >
      {children}
    </Swipeable>
  );
}
