import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

import { useCities } from "../../../shared/city/hooks/useCities";
import { AddressLocationSelectionModal } from "../../../shared/components/AddressLocationSelectionModal";
import type { LocationOption } from "../../../shared/location/types/location";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { PersonalInformationFields } from "../components/PersonalInformationFields";
import { useProfile } from "../hooks/useProfile";
import { useProfilePhoto } from "../hooks/useProfilePhoto";
import { useToast } from "../../../shared/components/ToastProvider";
import { styles } from "./personalInformationScreen.styles";

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
  const saveInProgress = useRef(false);
  const { profile, isLoading, isUpdating, error, updateProfile, refetch } =
    useProfile();
  const { photoProgress, photoOperationInProgress, handleChangePhoto } =
    useProfilePhoto({
      isUpdating,
      isLoading,
      isSaveInProgress: () => saveInProgress.current,
      updateProfile,
    });
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
            <ActivityIndicator color={theme.colors.text} />
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
            <ActivityIndicator color={theme.colors.text} size="small" />
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
