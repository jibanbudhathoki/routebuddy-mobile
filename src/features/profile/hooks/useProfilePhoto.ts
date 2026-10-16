import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";

import { useToast } from "../../../shared/components/ToastProvider";
import { profileService } from "../services/profile.service";
import type { UpdateUserProfilePayload } from "../services/profile.service";

type UpdateProfile = (
  data: UpdateUserProfilePayload,
) => Promise<{ success: boolean; error?: string }>;

export function useProfilePhoto({
  isUpdating,
  isLoading,
  isSaveInProgress,
  updateProfile,
}: {
  isUpdating: boolean;
  isLoading: boolean;
  isSaveInProgress: () => boolean;
  updateProfile: UpdateProfile;
}) {
  const [photoProgress, setPhotoProgress] = useState<
    "uploading" | "saving" | null
  >(null);
  const photoOperationInProgress = useRef(false);
  const { showToast } = useToast();

  const handleChangePhoto = async () => {
    if (
      photoOperationInProgress.current ||
      isSaveInProgress() ||
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

  return { photoProgress, photoOperationInProgress, handleChangePhoto };
}

function getProfilePhotoFileName(mimeType: string) {
  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "img";
  return `profile-photo.${extension}`;
}
