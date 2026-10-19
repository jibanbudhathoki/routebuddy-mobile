import React, { useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddActionModal } from "../../shared/components/AddActionModal";
import { useListMessages } from "../../features/messages/hooks/useMessages";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const { theme } = useUnistyles();
  const { data: conversations = [] } = useListMessages();
  const unreadMessageCount = conversations.reduce(
    (total, conversation) => total + (conversation.unreadCount ?? 0),
    0,
  );

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            paddingTop: 10,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom + 5,
          },
          tabBarActiveTintColor: theme.colors.text,
          tabBarInactiveTintColor: theme.colors.muted,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused, size }) => (
              <MaterialCommunityIcons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="trips"
          options={{
            title: "My Trips",
            tabBarIcon: ({ color, focused, size }) => (
              <MaterialCommunityIcons
                name={focused ? "briefcase" : "briefcase-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: "Add",
            tabBarLabel: () => null,
            tabBarIcon: () => (
              <View
                style={[
                  styles.addButton,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={32}
                  color={theme.colors.onPrimary}
                />
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setAddModalVisible(true);
            },
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarBadge:
              unreadMessageCount > 0
                ? unreadMessageCount > 99
                  ? "99+"
                  : unreadMessageCount
                : undefined,
            tabBarBadgeStyle: {
              backgroundColor: theme.colors.error,
              color: theme.colors.onPrimary,
              fontSize: 10,
              minWidth: 17,
            },
            tabBarIcon: ({ color, focused, size }) => (
              <MaterialCommunityIcons
                name={focused ? "message" : "message-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused, size }) => (
              <MaterialCommunityIcons
                name={focused ? "account" : "account-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="marketplace-trip-details"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="marketplace-request-details"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="post-trip"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="post-request"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="payment-methods"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <AddActionModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onPostTrip={() => {
          setAddModalVisible(false);
          router.push("/(tabs)/post-trip");
        }}
        onPostRequest={() => {
          setAddModalVisible(false);
          router.push("/(tabs)/post-request");
        }}
      />
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
}));
