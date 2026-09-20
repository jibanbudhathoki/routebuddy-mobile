import React, { useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddActionModal } from "../../shared/components/AddActionModal";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const { theme } = useUnistyles();

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
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="trips"
          options={{
            title: "My Trips",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="briefcase-outline"
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
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="message-outline"
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
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="post-trip"
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
          router.push("/(modals)/post-request");
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
    backgroundColor: "#0B2447",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
}));
