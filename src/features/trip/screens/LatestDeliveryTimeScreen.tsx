import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useTripCreation } from "../context/TripCreationContext";

const TIMES = [
  { id: "1", time: "6:00 PM" },
  { id: "2", time: "7:00 PM" },
  { id: "3", time: "8:00 PM" },
  { id: "4", time: "9:00 PM", subtitle: "Recommended" },
  { id: "5", time: "10:00 PM" },
  { id: "6", time: "11:00 PM" },
];

export function LatestDeliveryTimeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { updateTripData } = useTripCreation();
  
  const [selectedTimeId, setSelectedTimeId] = useState<string>("1");

  const handleContinue = () => {
    // Generate a mock ISO date
    const hoursToAdd = parseInt(selectedTimeId) * 2;
    const mockDate = new Date();
    mockDate.setHours(mockDate.getHours() + hoursToAdd);
    
    updateTripData({ deliveryLatestBy: mockDate.toISOString() });
    router.back();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Latest Delivery Time</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>What's the latest time{"\n"}you can deliver?</Text>
          <Text style={styles.subtitle}>This is the latest time you can complete deliveries.</Text>
        </View>

        {TIMES.map((item) => {
          const isSelected = selectedTimeId === item.id;
          return (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.timeCard, 
                isSelected ? styles.timeCardSelected : styles.timeCardUnselected
              ]}
              activeOpacity={0.7}
              onPress={() => setSelectedTimeId(item.id)}
            >
              <View style={styles.radioContainer}>
                {isSelected ? (
                  <MaterialCommunityIcons name="radiobox-marked" size={24} color={theme.colors.primary} />
                ) : (
                  <MaterialCommunityIcons name="radiobox-blank" size={24} color={theme.colors.muted} />
                )}
              </View>
              
              <View style={styles.timeInfo}>
                <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                  {item.time}
                </Text>
                {item.subtitle && (
                  <Text style={styles.subtitleText}>{item.subtitle}</Text>
                )}
              </View>

              <View style={styles.rightCircleContainer}>
                {isSelected ? (
                  <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.primary} />
                ) : (
                  <MaterialCommunityIcons name="circle-outline" size={24} color={theme.colors.border} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          title="Continue" 
          onPress={handleContinue} 
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
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
  },
  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  timeCardUnselected: {
    borderColor: theme.colors.border,
  },
  timeCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  radioContainer: {
    marginRight: theme.spacing.md,
  },
  timeInfo: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  timeTextSelected: {
    color: theme.colors.primary,
  },
  subtitleText: {
    fontSize: 14,
    color: theme.colors.muted,
    marginTop: 4,
  },
  rightCircleContainer: {
    marginLeft: theme.spacing.md,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
