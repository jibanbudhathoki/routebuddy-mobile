import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

import { ActivityIndicator } from "react-native";
import { useStores } from "../../../shared/store/hooks/useStores";

import { useTripCreation } from "../context/TripCreationContext";

export function SelectStoreScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { theme } = useUnistyles();
  
  const { tripData, updateTripData } = useTripCreation();
  const { stores, isLoading } = useStores({ limit: 50 }); 
  const [selectedStores, setSelectedStores] = useState<string[]>(tripData.stores || []);

  const toggleStore = (id: string) => {
    setSelectedStores((prev) => 
      prev.includes(id) ? prev.filter((storeId) => storeId !== id) : [...prev, id]
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Store(s)</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Select Store(s)</Text>
          <Text style={styles.subtitle}>Choose one or more stores you plan to visit.</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
        ) : (
          stores.map((store) => {
            const isSelected = selectedStores.includes(store.uid);
            // Default brand color for API stores
            const brandColor = "#E21A22"; 
            
            return (
              <TouchableOpacity 
                key={store.uid} 
                style={[
                  styles.storeCard, 
                  isSelected ? styles.storeCardSelected : styles.storeCardUnselected
                ]}
                activeOpacity={0.7}
                onPress={() => toggleStore(store.uid)}
              >
                {store.image ? (
                  <Image source={{ uri: store.image }} style={styles.storeImage} />
                ) : (
                  <View style={styles.storeLogoPlaceholder}>
                    <MaterialCommunityIcons name="storefront-outline" size={32} color={theme.colors.muted} />
                  </View>
                )}
                
                <View style={styles.storeInfo}>
                  <Text style={styles.storeNameText}>{store.name}</Text>
                  {store.city || store.province ? (
                    <Text style={styles.addressText}>
                      {[store.city?.name, store.province?.name].filter(Boolean).join(", ")}
                    </Text>
                  ) : null}
                </View>

                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && (
                    <MaterialCommunityIcons name="check" size={16} color={theme.colors.onPrimary} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          title={selectedStores.length > 0 ? `Done (${selectedStores.length} Selected)` : "Done"} 
          onPress={() => {
            updateTripData({ stores: selectedStores });
            navigation.goBack();
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
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
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
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
  },
  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  storeCardUnselected: {
    borderColor: theme.colors.border,
  },
  storeCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing.md,
    resizeMode: "cover",
  },
  storeLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  storeInfo: {
    flex: 1,
    justifyContent: "center",
  },
  storeNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  hoursText: {
    fontSize: 13,
    color: theme.colors.muted,
    marginTop: 4,
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
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
