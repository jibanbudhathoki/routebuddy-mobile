import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

import { useTripCreation } from "../context/TripCreationContext";
import { useCities } from "../../../shared/city/hooks/useCities";
type ParamList = {
  LocationSearch: {
    type: "From" | "To";
  };
};

export function LocationSearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "LocationSearch">>();
  const { theme } = useUnistyles();
  const { tripData, updateTripData } = useTripCreation();
  
  const type = route.params?.type || "From";
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
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{type}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.colors.primary} />
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
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
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
                    color={theme.colors.primary} 
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
              if (isFrom) {
                updateTripData({ originCityUid: selectedCity });
              } else {
                updateTripData({ destinationCityUid: selectedCity });
              }
            }
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
    fontSize: 18,
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
    color: theme.colors.primary,
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
    color: theme.colors.primary,
  },
  cityTextSelected: {
    color: theme.colors.primary,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
