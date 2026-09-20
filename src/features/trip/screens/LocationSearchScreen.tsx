import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

import { useTripCreation } from "../context/TripCreationContext";
import { useCities } from "../../../shared/city/hooks/useCities";
import { useLocalSearchParams, useRouter } from "expo-router";

export function LocationSearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ type: "From" | "To" }>();
  const { theme } = useUnistyles();
  const { tripData, updateTripData } = useTripCreation();
  
  const type = params.type || "From";
  const isFrom = type === "From";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [selectedCity, setSelectedCity] = useState<string | null>(
    isFrom ? tripData.originCityUid || null : tripData.destinationCityUid || null
  );

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { cities, isLoading } = useCities({ limit: 100, search: debouncedSearch || undefined });



  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{type}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            {isFrom ? "Where are you starting?" : "Where are you going?"}
          </Text>
          <Text style={styles.subtitle}>
            {isFrom ? "Select your starting city." : "Select your destination city."}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color={theme.colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search city"
            placeholderTextColor={theme.colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.recentLabel}>Recent</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.text} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.listContainer}>
            {cities.map((city) => {
              const isSelected = selectedCity === city.uid;
              const displayName = city.province?.name 
                ? `${city.name}, ${city.province.name}`
                : city.name;
                
              return (
                <TouchableOpacity 
                  key={city.uid} 
                  style={[
                    styles.cityItem,
                    isSelected && styles.cityItemSelected
                  ]}
                  onPress={() => setSelectedCity(city.uid)}
                >
                  <Text style={[styles.cityText, isSelected && styles.cityTextSelected]}>{displayName}</Text>
                  <MaterialCommunityIcons 
                    name="chevron-right" 
                    size={24} 
                    color={theme.colors.text} 
                  />
                </TouchableOpacity>
              );
            })}
            {cities.length === 0 && !isLoading && (
              <Text style={{ textAlign: 'center', color: theme.colors.muted, marginTop: 20 }}>
                No cities found.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          title="Continue" 
          onPress={() => {
            if (selectedCity) {
              const city = cities.find(c => c.uid === selectedCity);
              const cityName = city?.province?.name 
                ? `${city.name}, ${city.province.name}` 
                : city?.name || '';
              if (isFrom) {
                updateTripData({ originCityUid: selectedCity, originCityName: cityName });
              } else {
                updateTripData({ destinationCityUid: selectedCity, destinationCityName: cityName });
              }
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
  titleSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 56,
    marginBottom: theme.spacing.xl,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  recentLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.muted,
    marginBottom: theme.spacing.sm,
  },
  listContainer: {
    width: "100%",
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  cityItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  cityText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  cityTextSelected: {
    color: theme.colors.text,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
