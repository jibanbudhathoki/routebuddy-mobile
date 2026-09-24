import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, FlatList, ActivityIndicator } from "react-native";
import { useCities } from "../city/hooks/useCities";
import { City } from "../city/types/city";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "./PrimaryButton";
import { FormInput } from "./FormInput";

export interface AddressFormData {
  label: string;
  fullName: string;
  address: string;
  aptSuiteUnit: string;
  cityName: string;
  cityUid: string;
  provinceUid: string;
  postalCode: string;
  notes: string;
}

interface AddressFormScreenProps {
  onSave: (data: AddressFormData) => void;
  isLoading?: boolean;
}

export function AddressFormScreen({ onSave, isLoading }: AddressFormScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  
  const [formData, setFormData] = useState<AddressFormData>({
    label: "",
    fullName: "",
    address: "",
    aptSuiteUnit: "",
    cityName: "",
    cityUid: "",
    provinceUid: "",
    postalCode: "",
    notes: "",
  });

  const [isCityModalVisible, setCityModalVisible] = useState(false);
  const { cities, isLoading: isLoadingCities } = useCities();

  const updateField = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Enter the address where items should be delivered.</Text>
          <Text style={styles.subtitle}>Provide as much detail as possible for accurate delivery.</Text>
        </View>

        <View style={styles.formSection}>
          <FormInput
            label="Address Label"
            icon="label-outline"
            placeholder="e.g. Home, Work"
            value={formData.label}
            onChangeText={(text) => updateField("label", text)}
          />

          <FormInput
            label="Full Name"
            icon="account-outline"
            placeholder="e.g. John Smith"
            value={formData.fullName}
            onChangeText={(text) => updateField("fullName", text)}
          />

          <FormInput
            label="Address"
            icon="map-marker-outline"
            placeholder="e.g. 123 Main St"
            value={formData.address}
            onChangeText={(text) => updateField("address", text)}
          />

          <FormInput
            label="Apt, Suite, Unit (optional)"
            icon="office-building-outline"
            placeholder="e.g. Unit 5"
            value={formData.aptSuiteUnit}
            onChangeText={(text) => updateField("aptSuiteUnit", text)}
          />

          {/* City Selection Dropdown */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>City</Text>
            <TouchableOpacity 
              style={styles.dropdownContainer}
              activeOpacity={0.7}
              onPress={() => setCityModalVisible(true)}
            >
              <MaterialCommunityIcons name="map-marker-outline" size={20} color={theme.colors.text} style={styles.inputIcon} />
              <Text style={[styles.dropdownText, !formData.cityName && styles.dropdownPlaceholder]}>
                {formData.cityName || "Select city"}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={24} color={theme.colors.text} style={styles.dropdownChevron} />
            </TouchableOpacity>
          </View>

          <FormInput
            label="Postal Code"
            icon="mailbox-outline"
            placeholder="e.g. M4B 1B3"
            value={formData.postalCode}
            onChangeText={(text) => updateField("postalCode", text)}
          />

          {/* Notes for Driver */}
          <View style={styles.textAreaWrapper}>
            <FormInput
              label="Notes for driver (optional)"
              icon="note-edit-outline"
              placeholder="e.g. Ring doorbell, call on arrival"
              value={formData.notes}
              onChangeText={(text) => {
                if (text.length <= 150) {
                  updateField("notes", text);
                }
              }}
              multiline
            />
            <Text style={styles.charCount}>{formData.notes.length}/150</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || theme.spacing.md }]}>
        <PrimaryButton 
          title="Save Address" 
          onPress={handleSave} 
          disabled={!formData.label || !formData.fullName || !formData.address || !formData.postalCode || !formData.cityUid || isLoading}
          loading={isLoading}
        />
      </View>

      {/* City Selection Modal */}
      <Modal visible={isCityModalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 44 : 20 }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select City</Text>
            <TouchableOpacity style={styles.headerButton} onPress={() => setCityModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={28} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          {isLoadingCities ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: theme.spacing.xl }} />
          ) : (
            <FlatList
              data={cities}
              keyExtractor={(item) => item.uid}
              contentContainerStyle={{ padding: theme.spacing.md }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => {
                    setFormData((prev) => ({
                      ...prev,
                      cityName: item.name,
                      cityUid: item.uid,
                      provinceUid: item.province?.uid || "",
                    
  cityItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cityNameText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "bold",
    marginBottom: 4,
  },
  provinceNameText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
}));
                    setCityModalVisible(false);
                  }}
                >
                  <Text style={styles.cityNameText}>{item.name}</Text>
                  {item.province && <Text style={styles.provinceNameText}>{item.province.name}</Text>}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>

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
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  titleSection: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.muted,
    lineHeight: 22,
  },
  formSection: {
    gap: theme.spacing.md,
  },
  inputWrapper: {
    marginBottom: theme.spacing.sm,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 56,
    backgroundColor: theme.colors.surface,
  },
  inputIcon: {
    marginRight: 10,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  dropdownPlaceholder: {
    color: theme.colors.muted,
  },
  dropdownChevron: {
    marginLeft: 10,
  },
  textAreaWrapper: {
    position: "relative",
  },
  charCount: {
    position: "absolute",
    bottom: 28,
    right: 12,
    fontSize: 12,
    color: theme.colors.muted,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },

  cityItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cityNameText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "bold",
    marginBottom: 4,
  },
  provinceNameText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
}));
