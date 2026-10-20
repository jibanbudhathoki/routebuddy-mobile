import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { DeliveryProofPhoto } from "../types/request";
import { styles } from "./requestDeliveryProofSheet.styles";

interface RequestDeliveryProofSheetProps {
  visible: boolean;
  isSubmitting: boolean;
  submissionState: "idle" | "prepared" | "saved";
  preparedPhotoCount?: number;
  onClose: () => void;
  onSubmit: (photos: DeliveryProofPhoto[], note: string) => Promise<void>;
}

const MAX_PHOTO_SIZE = 20 * 1024 * 1024;
const MAX_PHOTOS = 8;

export function RequestDeliveryProofSheet({
  visible,
  isSubmitting,
  submissionState,
  preparedPhotoCount = 0,
  onClose,
  onSubmit,
}: RequestDeliveryProofSheetProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUnistyles();
  const [photos, setPhotos] = useState<DeliveryProofPhoto[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const busy = isSubmitting || submitting;
  const hasPreparedProof = submissionState !== "idle";
  const photoCount = hasPreparedProof ? preparedPhotoCount : photos.length;

  useEffect(() => {
    if (!visible) return;
    setPhotos([]);
    setNote("");
    setError("");
    setSubmitting(false);
  }, [visible]);

  async function choosePhotos() {
    if (busy) return;
    setError("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: MAX_PHOTOS,
        quality: 0.85,
      });
      if (result.canceled) return;

      const selected = result.assets.map((asset, index) => ({
        uri: asset.uri,
        fileName: asset.fileName ?? `delivery-proof-${Date.now()}-${index}.jpg`,
        mimeType: asset.mimeType ?? "image/jpeg",
        size: asset.fileSize ?? undefined,
      }));
      const oversized = selected.find(
        (photo) => photo.size !== undefined && photo.size > MAX_PHOTO_SIZE,
      );
      if (oversized) {
        setError("Each delivery photo must be smaller than 20 MB.");
        return;
      }

      setPhotos((current) =>
        [...current, ...selected.filter(
          (photo) => !current.some((existing) => existing.uri === photo.uri),
        )].slice(0, MAX_PHOTOS),
      );
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Unable to open the photo library.",
      );
    }
  }

  async function submit() {
    if (busy) return;
    if (photos.length === 0 && !hasPreparedProof) {
      setError("Add at least one delivery photo to continue.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(photos, note.trim());
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Unable to submit delivery proof.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={busy ? undefined : onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close delivery proof"
          disabled={busy}
          onPress={onClose}
          style={styles.backdrop}
        />
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={[
              styles.sheetContent,
              { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) },
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.sheetScroll}
          >
          <View style={styles.grabber} />
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={21}
                color={theme.colors.text}
              />
              <Text style={styles.title}>Delivery Proof</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close delivery proof"
              disabled={busy}
              onPress={onClose}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={21}
                color={theme.colors.text}
              />
            </Pressable>
          </View>
          <Text style={styles.description}>
            Add at least one photo. The requester can review it in your chat
            before confirming delivery.
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={
              busy || hasPreparedProof || photos.length >= MAX_PHOTOS
            }
            onPress={() => void choosePhotos()}
            style={styles.addPhotosButton}
          >
            <MaterialCommunityIcons
              name="image-plus-outline"
              size={19}
              color={theme.colors.text}
            />
            <Text style={styles.addPhotosText}>
              {photos.length ? "Add more photos" : "Choose delivery photos"}
            </Text>
            <Text style={styles.photoCount}>
              {photoCount}/{MAX_PHOTOS}
            </Text>
          </Pressable>
          {photos.length ? (
            <ScrollView
              horizontal
              contentContainerStyle={styles.photoList}
              showsHorizontalScrollIndicator={false}
            >
              {photos.map((photo) => (
                <View key={photo.uri} style={styles.photoFrame}>
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remove delivery photo"
                    disabled={busy || hasPreparedProof}
                    onPress={() =>
                      setPhotos((current) =>
                        current.filter((item) => item.uri !== photo.uri),
                      )
                    }
                    style={styles.removePhoto}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={15}
                      color={theme.colors.onPrimary}
                    />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          ) : null}
          <Text style={styles.fieldLabel}>Note (optional)</Text>
          <TextInput
            editable={!busy && !hasPreparedProof}
            maxLength={500}
            multiline
            onChangeText={setNote}
            placeholder="Add a delivery note"
            placeholderTextColor={theme.colors.muted}
            style={styles.noteInput}
            textAlignVertical="top"
            value={note}
          />
          {submissionState === "prepared" ? (
            <Text style={styles.savedProofNotice}>
              Your delivery photos are uploaded. Retry to save them and finish
              the delivery update.
            </Text>
          ) : null}
          {submissionState === "saved" ? (
            <Text style={styles.savedProofNotice}>
              Your proof is saved. Retry to share it with the requester.
            </Text>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{
              disabled: busy || (photos.length === 0 && !hasPreparedProof),
              busy,
            }}
            disabled={busy || (photos.length === 0 && !hasPreparedProof)}
            onPress={() => void submit()}
            style={[
              styles.submitButton,
              (busy || (photos.length === 0 && !hasPreparedProof)) &&
                styles.disabledButton,
            ]}
          >
            {busy ? (
              <ActivityIndicator
                size="small"
                color={theme.colors.onPrimary}
              />
            ) : (
              <MaterialCommunityIcons
                name="check"
                size={18}
                color={theme.colors.onPrimary}
              />
            )}
            <Text style={styles.submitText}>
              {busy
                ? "Submitting..."
                : submissionState === "saved"
                  ? "Retry Chat Update"
                  : submissionState === "prepared"
                    ? "Retry Proof Submission"
                    : "Submit Proof & Mark Delivered"}
            </Text>
          </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
