import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";
import { useRef, useState } from "react";

import type { ChatMediaFile, ChatMediaMessageType } from "../types/chatMedia.types";
import { useSendConversationMessage, useUploadChatMedia } from "./useMessages";

interface UseChatMediaOptions {
  conversationId: string;
  replyToUid?: string;
  onSent: () => void;
  onError: (error: Error) => void;
}

export function useChatMedia({
  conversationId,
  replyToUid,
  onSent,
  onError,
}: UseChatMediaOptions) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const upload = useUploadChatMedia();
  const sendMessage = useSendConversationMessage(conversationId);
  const [isRecording, setIsRecording] = useState(false);
  const [isSendingImageBatch, setIsSendingImageBatch] = useState(false);
  const imageBatchInProgress = useRef(false);

  async function sendFile(file: ChatMediaFile, type: ChatMediaMessageType) {
    if (upload.isPending || sendMessage.isPending) return;
    const maximumSize = type === "image" ? 20 : 30;
    if (file.size && file.size > maximumSize * 1024 * 1024) {
      onError(new Error(`Choose a file smaller than ${maximumSize} MB.`));
      return;
    }

    try {
      const uploaded = await upload.mutateAsync(file);
      await sendMessage.mutateAsync({
        content: uploaded.mediaKey,
        type,
        replyToUid,
      });
      onSent();
    } catch (failure) {
      onError(toError(failure, "Unable to send this attachment."));
    }
  }

  async function pickImage() {
    if (
      imageBatchInProgress.current ||
      upload.isPending ||
      sendMessage.isPending
    ) {
      return;
    }

    imageBatchInProgress.current = true;
    setIsSendingImageBatch(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.85,
      });
      if (result.canceled) return;
      for (const image of result.assets) {
        await sendFile(
          makeFile(
            image.uri,
            image.fileName,
            image.mimeType,
            image.fileSize,
          ),
          "image",
        );
      }
    } catch (failure) {
      onError(toError(failure, "Unable to open the photo library."));
    } finally {
      imageBatchInProgress.current = false;
      setIsSendingImageBatch(false);
    }
  }

  async function takePhoto() {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        onError(new Error("Allow camera access to take a chat photo."));
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });
      if (result.canceled) return;
      const image = result.assets[0];
      if (!image) return;
      await sendFile(
        makeFile(image.uri, image.fileName, image.mimeType, image.fileSize),
        "image",
      );
    } catch (failure) {
      onError(toError(failure, "Unable to open the camera."));
    }
  }

  async function pickAudioFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["audio/*"],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset) return;
      const file = makeFile(asset.uri, asset.name, asset.mimeType, asset.size);
      if (getMessageType(file) !== "voice") {
        onError(new Error("Choose an audio file to send."));
        return;
      }
      await sendFile(file, "voice");
    } catch (failure) {
      onError(toError(failure, "Unable to open audio files."));
    }
  }

  async function startVoiceRecording() {
    if (upload.isPending || sendMessage.isPending || isRecording) return;
    try {
      const currentPermission = await AudioModule.getRecordingPermissionsAsync();
      const permission = currentPermission.granted
        ? currentPermission
        : await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        onError(new Error("Microphone access is required to record a voice message."));
        if (!permission.canAskAgain) {
          Alert.alert(
            "Microphone access is off",
            "Allow microphone access in your device settings to record voice messages.",
            [
              { text: "Not now", style: "cancel" },
              { text: "Open settings", onPress: () => void Linking.openSettings() },
            ],
          );
        }
        return;
      }
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
    } catch (failure) {
      onError(toError(failure, "Unable to start voice recording."));
    }
  }

  async function stopAndSendVoiceRecording() {
    if (!isRecording) {
      await startVoiceRecording();
      return;
    }
    try {
      await recorder.stop();
      setIsRecording(false);
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });
      if (!recorder.uri) {
        throw new Error("The voice recording could not be saved.");
      }
      await sendFile(
        makeFile(
          recorder.uri,
          `voice-message-${Date.now()}.m4a`,
          "audio/mp4",
        ),
        "voice",
      );
    } catch (failure) {
      setIsRecording(false);
      onError(toError(failure, "Unable to send the voice message."));
    }
  }

  return {
    pickImage,
    takePhoto,
    pickAudioFile,
    stopAndSendVoiceRecording,
    isRecording,
    isUploading:
      isSendingImageBatch || upload.isPending || sendMessage.isPending,
    recordingDuration: Math.floor(recorderState.durationMillis / 1000),
  };
}

function makeFile(
  uri: string,
  fileName: string | null | undefined,
  mimeType: string | null | undefined,
  size?: number | null,
): ChatMediaFile {
  const extension = fileName?.split(".").pop()?.toLowerCase();
  const extensionMimeType: Record<string, string> = {
    aac: "audio/aac",
    aiff: "audio/aiff",
    amr: "audio/amr",
    flac: "audio/flac",
    gif: "image/gif",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    m4a: "audio/mp4",
    mp3: "audio/mpeg",
    oga: "audio/ogg",
    ogg: "audio/ogg",
    opus: "audio/opus",
    png: "image/png",
    wav: "audio/wav",
    webp: "image/webp",
  };
  const extensionMimeTypeValue = extension
    ? extensionMimeType[extension]
    : undefined;
  const inferredMimeType =
    mimeType?.startsWith("image/") || mimeType?.startsWith("audio/")
      ? mimeType
      : extensionMimeTypeValue ?? mimeType ?? "image/jpeg";

  return {
    uri,
    fileName: fileName || `attachment-${Date.now()}.${extension || "jpg"}`,
    mimeType: inferredMimeType,
    size: size ?? undefined,
  };
}

function getMessageType(file: ChatMediaFile): ChatMediaMessageType | null {
  return file.mimeType.toLowerCase().startsWith("audio/") ? "voice" : null;
}

function toError(failure: unknown, fallback: string) {
  return failure instanceof Error ? failure : new Error(fallback);
}
