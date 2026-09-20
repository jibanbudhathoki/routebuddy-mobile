import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useRequestCreation } from "../context/RequestCreationContext";

// Mock saved addresses
const SAVED_ADDRESSES = [
  {
    id: "address-1",
    name: "Home",
    address: "123 Main St\nReston, MB",
    icon: "home-outline" as const,
  },
  {
    id: "address-2",
    name: "Cottage",
    address: "45 Lakeview Rd\nReston, MB",
    icon: "storefront-outline" as const,
  },
  {
    id: "address-3",
    name: "Mom's House",
    address: "678 1st Ave\nVirden, MB",
    icon: "home-outline" as const,
  },
];

export function DeliveryAddressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();

  const { requestData, updateRequestData } = useRequestCreation();
  const [selectedAddress, setSelectedAddress] = useState<string>(
    requestData.deliveryAddress || "",
  );

  const toggleAddress = (id: string) => {
    setSelectedAddress(id);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Address</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="close"
            size={28}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>Where should we deliver your items?</Text>
          <Text style={styles.subtitle}>Use a saved address</Text>
        </View>

        {SAVED_ADDRESSES.map((addr) => {
          const isSelected = selectedAddress === addr.id;

          return (
            <TouchableOpacity
              key={addr.id}
              style={[
                styles.addressCard,
                isSelected
                  ? styles.addressCardSelected
                  : styles.addressCardUnselected,
              ]}
              activeOpacity={0.7}
              onPress={() => toggleAddress(addr.id)}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={addr.icon}
                  size={24}
                  color={theme.colors.text}
                />
              </View>

              <View style={styles.addressInfo}>
                <Text style={styles.addressNameText}>{addr.name}</Text>
                <Text style={styles.addressDetailText}>{addr.address}</Text>
              </View>

              <View
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}
              >
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check"
                    size={16}
                    color={theme.colors.onPrimary}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.addNewAddressBtn}
          activeOpacity={0.7}
          onPress={() => router.push("/(modals)/request/add-address")}
        >
          <MaterialCommunityIcons
            name="plus"
            size={24}
            color={theme.colors.text}
          />
          <Text style={styles.addNewAddressText}>Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue"
          onPress={() => {
            if (selectedAddress) {
              updateRequestData({ deliveryAddress: selectedAddress });
            }
            router.back();
          }}
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
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  titleSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "flex-start", // changed from center to flex-start because of multiline text
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  addressCardUnselected: {
    borderColor: theme.colors.border,
  },
  addressCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft, // Using soft background for selected items
  },
  iconContainer: {
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  addressInfo: {
    flex: 1,
    justifyContent: "center",
  },
  addressNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 4,
  },
  addressDetailText: {
    fontSize: 14,
    color: theme.colors.muted,
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.md,
    marginTop: 8,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  addNewAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.sm,
  },
  addNewAddressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
