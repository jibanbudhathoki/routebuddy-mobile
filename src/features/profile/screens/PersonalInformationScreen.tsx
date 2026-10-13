import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

import { useCities } from "../../../shared/city/hooks/useCities";
import { AddressLocationSelectionModal } from "../../../shared/components/AddressLocationSelectionModal";
import type { LocationOption } from "../../../shared/location/types/location";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { PersonalInformationFields } from "../components/PersonalInformationFields";
import { useProfile } from "../hooks/useProfile";
import { profileService } from "../services/profile.service";
import { useToast } from "../../../shared/components/ToastProvider";

const personalInfoSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .max(100, "Full name must be 100 characters or fewer."),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number must be 20 characters or fewer."),
  cityUid: z.string(),
  homeTown: z
    .string()
    .trim()
    .max(100, "Hometown must be 100 characters or fewer."),
});

export function PersonalInformationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cityUid, setCityUid] = useState("");
  const [cityName, setCityName] = useState("");
  const [isCityPickerVisible, setIsCityPickerVisible] = useState(false);
  const [homeTown, setHomeTown] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [photoProgress, setPhotoProgress] = useState<
    "uploading" | "saving" | null
  >(null);
  const saveInProgress = useRef(false);
  const photoOperationInProgress = useRef(false);
  const { profile, isLoading, isUpdating, error, updateProfile, refetch } =
    useProfile();
  const {
    cities,
    isLoading: isLoadingCities,
    error: citiesError,
  } = useCities({ limit: 100 });
  const { showToast } = useToast();
  const { theme } = useUnistyles();

  const handleOpenCityPicker = () => {
    if (citiesError) {
      showToast(citiesError, {
        title: "Unable to load cities",
        variant: "error",
      });
      return;
    }
    if (cities.length === 0) {
      showToast("No cities are available to select.");
      return;
    }
    setIsCityPickerVisible(true);
  };

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName);
    setEmail(profile.email);
    setPhone(profile.phone ?? "");
    setHomeTown(profile.homeTown ?? "");
    const profileCityUid =
      profile.location?.city?.uid ??
      cities.find(
        (cityOption) =>
          cityOption.uid === profile.city ||
          cityOption.name === profile.city,
      )?.uid ??
      "";
    setCityUid(profileCityUid);
    setCityName(
      profile.location?.city?.name ??
        cities.find((cityOption) => cityOption.uid === profileCityUid)?.name ??
        (profileCityUid ? "" : profile.city ?? ""),
    );
  }, [profile, cities]);

  const handleSave = async () => {
    if (
      saveInProgress.current ||
      photoOperationInProgress.current ||
      isUpdating ||
      isLoading
    )
      return;
    saveInProgress.current = true;

    const result = personalInfoSchema.safeParse({
      displayName,
      phone,
      cityUid,
      homeTown,
    });
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(formattedErrors);
      saveInProgress.current = false;
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      const updatePayload = {
        displayName: result.data.displayName,
        phone: result.data.phone || null,
        homeTown: result.data.homeTown || null,
        ...(result.data.cityUid ? { city: result.data.cityUid } : {}),
      };
      const { success, error: updateError } =
        await updateProfile(updatePayload);
      if (!success) {
        showToast(updateError ?? "Unable to save personal information.", {
          title: "Save failed",
          variant: "error",
        });
        return;
      }

      showToast("Personal information updated.", { variant: "success" });
      router.back();
    } finally {
      saveInProgress.current = false;
      setIsSaving(false);
    }
  };

  const handleChangePhoto = async () => {
    if (
      photoOperationInProgress.current ||
      saveInProgress.current ||
      isUpdating ||
      isLoading
    ) {
      return;
    }

    photoOperationInProgress.current = true;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });
      if (result.canceled) return;

      const asset = result.assets[0];
      if (!asset) {
        throw new Error("The selected image could not be read.");
      }
      if (!asset.fileSize || asset.fileSize <= 0) {
        throw new Error("Unable to verify the selected image size.");
      }
      if (asset.fileSize > 20 * 1024 * 1024) {
        throw new Error("Choose an image smaller than 20 MB.");
      }
      const mimeType = asset.mimeType?.toLowerCase();
      const supportedImageTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!mimeType || !supportedImageTypes.includes(mimeType)) {
        throw new Error("Choose a JPEG, PNG, WebP, or GIF image.");
      }

      setPhotoProgress("uploading");
      const uploaded = await profileService.uploadProfilePhoto({
        uri: asset.uri,
        fileName: asset.fileName || getProfilePhotoFileName(mimeType),
        mimeType,
        size: asset.fileSize,
      });

      setPhotoProgress("saving");
      const { success, error: updateError } = await updateProfile({
        photoUrl: uploaded.photoUrl,
        photoKey: uploaded.photoKey,
      });
      if (!success) {
        showToast(
          updateError ??
            "The photo uploaded, but could not be saved to your profile.",
          { title: "Profile photo not saved", variant: "error" },
        );
        return;
      }

      showToast("Profile photo updated.", { variant: "success" });
    } catch (failure) {
      showToast(
        failure instanceof Error
          ? failure.message
          : "Unable to update your profile photo.",
        { title: "Photo update failed", variant: "error" },
      );
    } finally {
      photoOperationInProgress.current = false;
      setPhotoProgress(null);
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.keyboardAvoid}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Personal Information</Text>
          </View>
        </View>

        {isLoading && !profile ? (
          <View style={styles.statusCard} accessibilityLiveRegion="polite">
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.statusText}>Loading personal information...</Text>
          </View>
        ) : error && !profile ? (
          <View style={styles.statusCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => void refetch()}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
          </View>
        ) : profile ? (
          <>
            {error ? (
              <View style={styles.inlineError} accessibilityLiveRegion="polite">
                <Text style={styles.errorText}>{error}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void refetch()}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </Pressable>
              </View>
            ) : null}
            <PersonalInformationFields
              photoUrl={profile.photoUrl}
              isPhotoBusy={photoProgress !== null}
              photoProgress={photoProgress}
              displayName={displayName}
              email={email}
              phone={phone}
              cityName={cityName}
              isLoadingCities={isLoadingCities}
              homeTown={homeTown}
              errors={errors}
              onDisplayNameChange={setDisplayName}
              onPhoneChange={setPhone}
              onCityPress={handleOpenCityPicker}
              onHomeTownChange={setHomeTown}
              onChangePhoto={() => void handleChangePhoto()}
            />
            {citiesError ? (
              <Text style={styles.cityPickerError}>{citiesError}</Text>
            ) : null}
          </>
        ) : null}
        <View style={styles.footer}>
          <PrimaryButton
            title="Save Changes"
            onPress={handleSave}
            loading={isSaving || (isUpdating && photoProgress === null)}
            disabled={
              !profile ||
              isLoading ||
              isSaving ||
              isUpdating ||
              photoProgress !== null
            }
          />
        </View>
        {photoProgress ? (
          <View style={styles.photoProgress} accessibilityLiveRegion="polite">
            <ActivityIndicator color={theme.colors.primary} size="small" />
            <Text style={styles.statusText}>
              {photoProgress === "uploading"
                ? "Uploading profile photo..."
                : "Saving profile photo..."}
            </Text>
          </View>
        ) : null}
      </View>
      <AddressLocationSelectionModal
        visible={isCityPickerVisible}
        topInset={insets.top}
        title="Select city"
        options={cities.map((cityOption): LocationOption => ({
          uid: cityOption.uid,
          name: cityOption.name,
          subtitle:
            typeof cityOption.province === "string"
              ? cityOption.province
              : cityOption.province?.name,
        }))}
        isLoading={isLoadingCities}
        onClose={() => setIsCityPickerVisible(false)}
        onSelect={(option) => {
          setCityUid(option.uid);
          setCityName(option.name);
          setIsCityPickerVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {},
  headerTextContainer: {
    alignItems: "center",
    marginTop: -24,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
  },
  statusCard: {
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.sm,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  statusText: {
    color: theme.colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
  errorText: {
    color: theme.colors.error,
    flex: 1,
    fontSize: 12,
  },
  inlineError: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  retryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  retryText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  photoProgress: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.sm,
    justifyContent: "center",
    paddingBottom: theme.spacing.sm,
  },
  cityPickerError: {
    color: theme.colors.error,
    fontSize: 12,
    marginHorizontal: theme.spacing.md,
  },
}));

function getProfilePhotoFileName(mimeType: string) {
  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "img";
  return `profile-photo.${extension}`;
}
