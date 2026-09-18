import { View, Text } from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  rating?: string;
  trips?: number;
  location?: string;
  joinYear?: string;
  photoUrl?: string | null;
}

export function ProfileHeader({
  firstName,
  lastName,
  rating = "4.9",
  trips = 84,
  location = "Reston, Manitoba",
  joinYear = "2025",
  photoUrl,
}: ProfileHeaderProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        )}
        <View style={styles.cameraBadge}>
          <MaterialCommunityIcons
            name="camera-outline"
            size={14}
            color={theme.colors.onPrimary}
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
        <View style={styles.statsRow}>
          <MaterialCommunityIcons name="star" size={14} color={theme.colors.text} />
          <Text style={styles.statsText}>{` ${rating} (${trips} trips)`}</Text>
        </View>
        <Text style={styles.metaText}>{location}</Text>
        <Text style={styles.memberText}>{`Member since ${joinYear}`}</Text>
      </View>
    </View>
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
    position: "relative",
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
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
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
  metaText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 2,
  },
  memberText: {
    fontSize: 13,
    color: theme.colors.muted,
  },
}));
