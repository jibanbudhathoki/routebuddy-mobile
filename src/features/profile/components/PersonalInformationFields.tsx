import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { FormInput } from "../../../shared/components/FormInput";

type PersonalInformationFieldsProps = {
  photoUrl?: string | null;
  isPhotoBusy: boolean;
  photoProgress: "uploading" | "saving" | null;
  displayName: string;
  email: string;
  phone: string;
  cityName: string;
  isLoadingCities: boolean;
  homeTown: string;
  errors: Record<string, string>;
  onDisplayNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onCityPress: () => void;
  onHomeTownChange: (value: string) => void;
  onChangePhoto: () => void;
};

export function PersonalInformationFields({
  photoUrl,
  isPhotoBusy,
  photoProgress,
  displayName,
  email,
  phone,
  cityName,
  isLoadingCities,
  homeTown,
  errors,
  onDisplayNameChange,
  onPhoneChange,
  onCityPress,
  onHomeTownChange,
  onChangePhoto,
}: PersonalInformationFieldsProps) {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const { theme } = useUnistyles();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Profile photo</Text>
        <Text style={styles.sectionDescription}>
          Help other RouteBuddy members recognize you.
        </Text>
      </View>
      <View style={styles.photoSection}>
        <View style={styles.photoContainer}>
          {photoUrl ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Open profile photo"
              onPress={() => setIsPhotoOpen(true)}
            >
              <Image
                source={{ uri: photoUrl }}
                style={styles.profilePhoto}
                accessibilityLabel="Profile photo"
              />
            </TouchableOpacity>
          ) : (
            <View style={[styles.profilePhoto, styles.photoFallback]}>
              <MaterialCommunityIcons
                name="account"
                size={38}
                color={theme.colors.text}
              />
            </View>
          )}
        </View>
        <View style={styles.photoActions}>
          <View style={styles.photoButtonsRow}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
              accessibilityState={{ disabled: isPhotoBusy, busy: isPhotoBusy }}
              disabled={isPhotoBusy}
              onPress={onChangePhoto}
              style={[styles.changePhotoButton, isPhotoBusy && styles.disabled]}
            >
              <Text style={styles.changePhotoText}>
                {photoProgress === "uploading"
                  ? "Uploading..."
                  : photoProgress === "saving"
                    ? "Saving..."
                    : "Change Photo"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={isPhotoOpen}
        onRequestClose={() => setIsPhotoOpen(false)}
      >
        <View style={styles.photoModal}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close profile photo"
            style={styles.photoModalClose}
            onPress={() => setIsPhotoOpen(false)}
          >
            <MaterialCommunityIcons
              name="close"
              size={28}
              color={theme.colors.onPrimary}
            />
          </TouchableOpacity>
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              style={styles.expandedPhoto}
              contentFit="contain"
              accessibilityLabel="Expanded profile photo"
            />
          ) : null}
        </View>
      </Modal>

      <View style={styles.divider} />

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Personal details</Text>
        <Text style={styles.sectionDescription}>
          Keep your contact information up to date.
        </Text>
      </View>
      <FormInput
        label="Full name"
        accessibilityLabel="Full Name"
        placeholder="Full name"
        value={displayName}
        onChangeText={onDisplayNameChange}
        autoCapitalize="words"
        error={errors.displayName}
      />

      <FormInput
        label="Email address"
        icon="email-outline"
        placeholder="john.doe@email.com"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={false}
        error={errors.email}
      />

      <FormInput
        label="Phone number"
        icon="phone-outline"
        placeholder="(204) 555-0123"
        value={phone}
        onChangeText={onPhoneChange}
        keyboardType="phone-pad"
        error={errors.phone}
      />

      <View style={styles.divider} />

      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.sectionDescription}>
          Share where you live and where you call home.
        </Text>
      </View>
      <View style={styles.cityFieldContainer}>
        <Text style={styles.cityFieldLabel}>City</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            cityName ? `City, ${cityName}. Select to change.` : "Select city"
          }
          accessibilityState={{ disabled: isLoadingCities, busy: isLoadingCities }}
          disabled={isLoadingCities}
          onPress={onCityPress}
          style={styles.cityField}
        >
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={20}
            color={theme.colors.text}
          />
          <Text
            numberOfLines={1}
            style={[styles.cityFieldValue, !cityName && styles.cityPlaceholder]}
          >
            {cityName || "Select your city"}
          </Text>
          {isLoadingCities ? (
            <ActivityIndicator size="small" color={theme.colors.text} />
          ) : (
            <MaterialCommunityIcons
              name="chevron-down"
              size={20}
              color={theme.colors.muted}
            />
          )}
        </TouchableOpacity>
      </View>
      <FormInput
        label="Hometown"
        icon="home-city-outline"
        placeholder="Enter your hometown"
        value={homeTown}
        onChangeText={onHomeTownChange}
        autoCapitalize="words"
        error={errors.homeTown}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeading: {
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionDescription: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  photoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  photoContainer: {
    marginRight: 20,
    position: "relative",
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  photoFallback: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
  },
  photoModal: {
    alignItems: "center",
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  photoModalClose: {
    alignItems: "center",
    alignSelf: "flex-end",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    minHeight: 44,
    minWidth: 44,
  },
  expandedPhoto: {
    height: "75%",
    width: "100%",
  },
  photoActions: {
    flex: 1,
  },
  photoButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cityFieldContainer: {
    marginBottom: theme.spacing.md,
  },
  cityFieldLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  cityField: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  cityFieldValue: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 16,
  },
  cityPlaceholder: {
    color: theme.colors.muted,
  },
  changePhotoButton: {
    borderWidth: 1,
    borderColor: theme.colors.text,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  disabled: {
    opacity: 0.55,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },
}));
