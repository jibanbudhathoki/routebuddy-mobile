import { useEffect, useRef } from "react";
import {
  FlatList,
  Keyboard,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

export function useChatMessageListScroll<T>() {
  const listRef = useRef<FlatList<T>>(null);
  const isAtLatestMessage = useRef(true);
  const hasScrolledToInitialLatestMessage = useRef(false);
  const isKeyboardOpening = useRef(false);
  const contentHeight = useRef(0);
  const viewportHeight = useRef(0);

  function scrollToLatest(animated = false) {
    listRef.current?.scrollToOffset({
      offset: Math.max(contentHeight.current - viewportHeight.current, 0),
      animated,
    });
  }

  useEffect(() => {
    let settleTimers: ReturnType<typeof setTimeout>[] = [];
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      settleTimers.forEach(clearTimeout);
      settleTimers = [];
      isAtLatestMessage.current = true;
      isKeyboardOpening.current = true;
      const finishKeyboardTransition = () => {
        scrollToLatest();
        isKeyboardOpening.current = false;
      };
      requestAnimationFrame(() => scrollToLatest());
      settleTimers.push(
        setTimeout(finishKeyboardTransition, Math.max(event.duration ?? 0, 300) + 100),
        setTimeout(finishKeyboardTransition, 600),
      );
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      isKeyboardOpening.current = false;
      settleTimers.forEach(clearTimeout);
      settleTimers = [];
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      settleTimers.forEach(clearTimeout);
    };
  }, []);

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    isAtLatestMessage.current =
      contentSize.height - layoutMeasurement.height - contentOffset.y <= 80;
  }

  function onLayout(event: LayoutChangeEvent) {
    viewportHeight.current = event.nativeEvent.layout.height;
    if (isKeyboardOpening.current) scrollToLatest();
  }

  function onContentSizeChange(_width: number, height: number) {
    contentHeight.current = height;
    if (!isAtLatestMessage.current && !isKeyboardOpening.current) return;
    scrollToLatest(hasScrolledToInitialLatestMessage.current);
    hasScrolledToInitialLatestMessage.current = true;
  }

  return { listRef, onScroll, onLayout, onContentSizeChange };
}
