import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { Message } from "../types/message.types";

interface ChatMessageMediaProps {
  type: Message["type"];
  uri: string | null;
}

export function ChatMessageMedia({ type, uri }: ChatMessageMediaProps) {
  if (type === "image" && uri) {
    return <ImageAttachment uri={uri} />;
  }
  if (type === "voice" && uri) return <VoiceMessagePlayer uri={uri} />;
  return null;
}

function ImageAttachment({ uri }: { uri: string }) {
  const { theme } = useUnistyles();
  const [isViewerOpen, setViewerOpen] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open attached image"
        onPress={() => setViewerOpen(true)}
      >
        {hasLoadError ? (
          <View style={styles.imageError}>
            <MaterialCommunityIcons
              name="image-off-outline"
              size={24}
              color={theme.colors.muted}
            />
            <Text style={styles.imageErrorText}>Image could not be loaded</Text>
          </View>
        ) : (
          <Image
            accessibilityLabel="Attached image"
            contentFit="cover"
            onError={() => setHasLoadError(true)}
            source={{ uri }}
            style={styles.image}
          />
        )}
      </Pressable>
      <Modal
        animationType="fade"
        onRequestClose={() => setViewerOpen(false)}
        statusBarTranslucent
        transparent
        visible={isViewerOpen}
      >
        <View style={styles.viewer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close image"
            onPress={() => setViewerOpen(false)}
            style={styles.viewerClose}
          >
            <MaterialCommunityIcons
              name="close"
              size={26}
              color={theme.colors.onPrimary}
            />
          </Pressable>
          <Image
            accessibilityLabel="Full-screen attached image"
            contentFit="contain"
            onError={() => setHasLoadError(true)}
            source={{ uri }}
            style={styles.fullImage}
          />
        </View>
      </Modal>
    </>
  );
}

function VoiceMessagePlayer({ uri }: { uri: string }) {
  const { theme } = useUnistyles();
  const player = useAudioPlayer(uri, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const progress =
    status.duration > 0
      ? Math.min(status.currentTime / status.duration, 1)
      : 0;

  function togglePlayback() {
    if (status.playing) {
      player.pause();
      return;
    }
    if (status.duration > 0 && status.currentTime >= status.duration) {
      player.seekTo(0);
    }
    player.play();
  }

  return (
    <View style={styles.voice}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={status.playing ? "Pause voice message" : "Play voice message"}
        onPress={togglePlayback}
        style={styles.playButton}
      >
        <MaterialCommunityIcons
          name={status.playing ? "pause" : "play"}
          size={22}
          color={theme.colors.onPrimary}
        />
      </Pressable>
      <View style={styles.voiceDetails}>
        <View style={styles.track}>
          <View
            style={[
              styles.progress,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.duration}>
          {formatDuration(
            status.playing || status.currentTime > 0
              ? status.currentTime
              : status.duration,
          )}
        </Text>
      </View>
    </View>
  );
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const wholeSeconds = Math.floor(seconds);
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, "0")}`;
}

const styles = StyleSheet.create((theme) => ({
  image: {
    borderRadius: theme.radius.sm,
    height: 190,
    width: 230,
  },
  imageError: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.sm,
    height: 190,
    justifyContent: "center",
    width: 230,
  },
  imageErrorText: {
    color: theme.colors.muted,
    fontSize: 11,
    marginTop: theme.spacing.xs,
  },
  viewer: {
    alignItems: "center",
    backgroundColor: theme.colors.text,
    flex: 1,
    justifyContent: "center",
  },
  viewerClose: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    position: "absolute",
    right: theme.spacing.md,
    top: theme.spacing.xl,
    width: 48,
    zIndex: 1,
  },
  fullImage: {
    height: "100%",
    width: "100%",
  },
  voice: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    minWidth: 190,
    paddingVertical: theme.spacing.xs,
  },
  playButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  voiceDetails: {
    flex: 1,
    gap: 4,
  },
  track: {
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    height: 4,
    overflow: "hidden",
  },
  progress: {
    backgroundColor: theme.colors.primary,
    height: "100%",
  },
  duration: {
    color: theme.colors.muted,
    fontSize: 10,
  },
}));
