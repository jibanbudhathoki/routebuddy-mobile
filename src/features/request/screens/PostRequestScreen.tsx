import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet as RNStyleSheet } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { ListItem } from "../../../shared/components/ListItem";
import { useRequestCreation } from "../context/RequestCreationContext";

export function PostRequestScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { requestData } = useRequestCreation();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Request</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <MaterialCommunityIcons name="cart-outline" size={40} color={theme.colors.text} />
            <MaterialCommunityIcons name="tag-outline" size={16} color={theme.colors.text} style={styles.heroIconBadge1} />
            <MaterialCommunityIcons name="shopping-outline" size={16} color={theme.colors.text} style={styles.heroIconBadge2} />
          </View>
          <Text style={styles.heroTitle}>Need something delivered?</Text>
          <Text style={styles.heroSubtitle}>Fill in the details below to post your request.</Text>
        </View>

        <ListItem
          icon="storefront-outline"
          title="Store(s)"
          subtitle={
            requestData.stores && requestData.stores.length > 0
              ? `${requestData.stores.length} store(s) selected`
              : "Select the store(s) you want items from"
          }
          onPress={() => router.push("/(modals)/request/select-store")}
        />

        <ListItem
          icon="clipboard-text-outline"
          title="Items / Instructions"
          subtitle={
            requestData.items && requestData.items.length > 0
              ? `${requestData.items.length} item(s) added`
              : "Add your list or special instructions"
          }
          onPress={() => {
            if (requestData.items && requestData.items.length > 0) {
              router.push("/(modals)/request/order-summary");
            } else {
              router.push("/(modals)/request/add-items");
            }
          }}
        />

        <ListItem
          icon="map-marker-outline"
          title="Delivery Location"
          subtitle={
            requestData.deliveryAddress
              ? "Address selected"
              : "Where items should be delivered"
          }
          onPress={() => router.push("/(modals)/request/delivery-address")}
        />

        <ListItem
          icon="calendar-blank-outline"
          title="Day You Need It"
          subtitle="Select the day you need your items"
          rightText={
            requestData.dayNeeded
              ? new Date(requestData.dayNeeded).toLocaleDateString()
              : "Select date"
          }
          rightIcon="calendar-blank-outline"
          onPress={() => router.push("/(modals)/request/select-day")}
        />

        <ListItem
          icon="calendar-clock-outline"
          title="Needed By (Latest Delivery)"
          subtitle={requestData.latestDeliveryTime ? "Date selected" : "Default is 9:00 PM"}
          rightText={
            requestData.latestDeliveryTime
              ? new Date(requestData.latestDeliveryTime).toLocaleDateString()
              : "Select date"
          }
          rightIcon="chevron-right"
          onPress={() => router.push("/(modals)/request/latest-delivery-time")}
        />

        <ListItem
          icon="information-outline"
          title="Service Fee"
          subtitle="A 15% service fee is added to the order total."
          rightContent={
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>15%</Text>
            </View>
          }
        />

        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="information-outline" size={24} color={theme.colors.text} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Drivers will review your request and send you an offer. You can choose the one that works best for you.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          title="Continue" 
          onPress={() => router.push("/(modals)/request/order-summary")} 
        />
      </View>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  heroSection: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  heroIconBadge1: {
    position: "absolute",
    top: 15,
    left: 15,
  },
  heroIconBadge2: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: theme.colors.muted,
    textAlign: "center",
  },
  lockContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lockText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  badgeContainer: {
    backgroundColor: "#E6F5F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0B2447",
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  infoIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
