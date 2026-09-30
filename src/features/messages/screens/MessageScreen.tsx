import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TextField } from "../../../shared/components/TextField";
import { MessageListItem } from "../components/MessageListItem";

const DUMMY_MESSAGES = [
  {
    id: "1",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    name: "Walmart Order",
    tripInfo: "Trip to Brandon, MB • May 26",
    messagePreview: "Hi! I'll be heading to Walmart later today...",
    timestamp: "2m ago",
    unreadCount: 2,
  },
  {
    id: "2",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    name: "Costco Run",
    tripInfo: "Trip to Winnipeg, MB • Jun 2",
    messagePreview: "Are you still looking for Kirkland protein?",
    timestamp: "15m ago",
    unreadCount: 1,
  },
  {
    id: "3",
    avatarUrl: "",
    name: "Superstore Order",
    tripInfo: "Trip to Morden, MB • Jun 5",
    messagePreview: "Thank you! Will pickup the items today.",
    timestamp: "1h ago",
    unreadCount: 1,
  },
  {
    id: "4",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    name: "Sarah L.",
    tripInfo: "Trip to Brandon, MB • Jun 1",
    messagePreview: "Sounds good, thank you!",
    timestamp: "2h ago",
  },
  {
    id: "5",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    name: "Mike D.",
    tripInfo: "Trip to Winnipeg, MB • May 30",
    messagePreview: "Can you send me a picture of the receipt?",
    timestamp: "Yesterday",
    unreadCount: 2,
  },
  {
    id: "6",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    name: "Jessica R.",
    tripInfo: "Trip to Reston, MB • May 28",
    messagePreview: "Perfect, see you then!",
    timestamp: "Yesterday",
  },
  {
    id: "7",
    avatarUrl: "https://cdn-icons-png.flaticon.com/512/615/615075.png",
    name: "Community Chat",
    tripInfo: "Reston Community",
    messagePreview: "Tom: There's a community BBQ this weekend!",
    timestamp: "2d ago",
    unreadCount: 3,
  },
  {
    id: "8",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    name: "David K.",
    tripInfo: "Trip to Brandon, MB • May 25",
    messagePreview: "No problem at all!",
    timestamp: "3d ago",
  },
];

export function MessageScreen() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.notificationBtn}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={28}
            color={theme.colors.primary}
          />
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBarWrapper}>
          <TextField
            placeholder="Search messages"
            leftElement={
              <MaterialCommunityIcons
                name="magnify"
                size={24}
                color={theme.colors.muted}
                style={{ marginRight: 8 }}
              />
            }
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialCommunityIcons
            name="tune-variant"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={DUMMY_MESSAGES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageListItem
            id={item.id}
            avatarUrl={item.avatarUrl}
            name={item.name}
            tripInfo={item.tripInfo}
            messagePreview={item.messagePreview}
            timestamp={item.timestamp}
            unreadCount={item.unreadCount}
            onPress={() => router.push(`/chat/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 0,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.text,
  },
  notificationBtn: {
    position: "relative",
    padding: theme.spacing.xs,
  },
  badgeContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  badgeText: {
    color: theme.colors.onPrimary,
    fontSize: 10,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    alignItems: "center",
  },
  searchBarWrapper: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
}));
