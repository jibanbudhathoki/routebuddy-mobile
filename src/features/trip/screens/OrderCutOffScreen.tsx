import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";

const TIMES = [
  { id: "1", time: "9:00 AM", subtitle: "Recommended" },
  { id: "2", time: "10:00 AM", subtitle: "2 hours from now" },
  { id: "3", time: "11:00 AM", subtitle: "3 hours from now" },
  { id: "4", time: "12:00 PM", subtitle: "4 hours from now" },
  { id: "5", time: "1:00 PM", subtitle: "5 hours from now" },
  { id: "6", time: "2:00 PM", subtitle: "6 hours from now" },
];

import { useTripCreation } from "../context/TripCreationContext";

export function OrderCutOffScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { updateTripData } = useTripCreation();
  
  const [selectedTimeId, setSelectedTimeId] = useState<string>("1");

  const handleContinue = () => {

    const hoursToAdd = parseInt(selectedTimeId) * 2;
    const mockDate = new Date();
    mockDate.setHours(mockDate.getHours() + hoursToAdd);
    
    updateTripData({ orderCutoffAt: mockDate.toISOString() });
    router.back();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ordering Cut-Off</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>When should requests{"\n"}close?</Text>
          <Text style={styles.subtitle}>People can place requests until this time.</Text>
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
                <Text style={styles.subtitleText}>{item.subtitle}</Text>
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

        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="information-outline" size={24} color={theme.colors.primary} style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Why is this important?</Text>
            <Text style={styles.infoText}>
              Requests placed after the cut-off time may not be possible.
            </Text>
          </View>
        </View>
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
    marginBottom: 4,
  },
  timeTextSelected: {
    color: theme.colors.primary,
  },
  subtitleText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
  rightCircleContainer: {
    marginLeft: theme.spacing.md,
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  infoIcon: {
    marginRight: theme.spacing.sm,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.primary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
}));
