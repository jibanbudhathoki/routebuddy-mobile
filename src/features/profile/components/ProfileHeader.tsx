import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface ProfileHeaderProps {
  displayName: string;
  rating: number;
  photoUrl?: string | null;
}

export function ProfileHeader({
  displayName,
  rating,
  photoUrl,
}: ProfileHeaderProps) {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  const { theme } = useUnistyles();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {photoUrl ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Open profile photo"
              onPress={() => setIsPhotoOpen(true)}
            >
              <Image source={{ uri: photoUrl }} style={styles.avatar} />
            </TouchableOpacity>
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{displayName}</Text>
          <View style={styles.statsRow}>
            <MaterialCommunityIcons name="star" size={14} color={theme.colors.text} />
            <Text style={styles.statsText}>{` ${rating.toFixed(1)} rating`}</Text>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={isPhotoOpen}
        onRequestClose={() => setIsPhotoOpen(false)}
      >
        <View style={styles.photoModal}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close profile photo"
            style={styles.closeButton}
            onPress={() => setIsPhotoOpen(false)}
          >
            <MaterialCommunityIcons
              name="close"
              size={28}
              color={theme.colors.onPrimary}
            />
          </TouchableOpacity>
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.expandedPhoto}
              contentFit="contain"
            />
          ) : null}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 16,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
  },
  photoModal: {
    alignItems: "center",
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  closeButton: {
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    minHeight: 44,
    minWidth: 44,
  },
  expandedPhoto: {
    height: "75%",
    width: "100%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  statsText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
}));
