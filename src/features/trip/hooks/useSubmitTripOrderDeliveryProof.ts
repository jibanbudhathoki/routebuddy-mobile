import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateConversation,
  useUploadChatMedia,
} from "../../messages/hooks/useMessages";
import { messageService } from "../../messages/services/messageService";
import { createDeliveryProofMessage } from "../../messages/utils/requestOfferMessage";
import { useAddDeliveryProof } from "../../request/hooks/useDeliveryProof";
import type {
  AddRequestDeliveryProofPayload,
  DeliveryProofPhoto,
  RequestDetailsResponse,
} from "../../request/types/request";
import { useUpdateRequestStatus } from "../../request/hooks/useUpdateRequestStatus";
import { tripOrderKeys } from "./useTripOrders";

interface SavedDeliveryProof {
  payload: AddRequestDeliveryProofPayload;
  isSaved: boolean;
}

export function useSubmitTripOrderDeliveryProof(
  requestUid: string,
  order?: RequestDetailsResponse,
) {
  const queryClient = useQueryClient();
  const [deliveryProof, setDeliveryProof] =
    useState<SavedDeliveryProof | null>(null);
  const updateStatus = useUpdateRequestStatus(requestUid);
  const addDeliveryProof = useAddDeliveryProof(requestUid);
  const uploadMedia = useUploadChatMedia();
  const createConversation = useCreateConversation();

  async function submit(photos: DeliveryProofPhoto[], note: string) {
    if (!requestUid || !order) {
      throw new Error("Order details are required to submit delivery proof.");
    }
    const driverUid = order.driver?.uid;
    if (!driverUid) {
      throw new Error("The assigned driver could not be identified.");
    }

    let proof = deliveryProof;
    if (!proof) {
      const itemPhotoUrls: string[] = [];
      for (const photo of photos) {
        const uploaded = await uploadMedia.mutateAsync(photo);
        if (!uploaded.mediaUrl) {
          throw new Error(
            "A delivery photo upload did not return a URL. Please try again.",
          );
        }
        itemPhotoUrls.push(uploaded.mediaUrl);
      }

      proof = {
        payload: {
          itemPhotoUrls,
          ...(note ? { note } : {}),
        },
        isSaved: false,
      };
      setDeliveryProof(proof);
    }

    let updatedRequest = order;
    if (updatedRequest.status.toLowerCase() !== "delivered") {
      try {
        updatedRequest = await updateStatus.mutateAsync("delivered");
      } catch (failure) {
        throw new Error(
          failure instanceof Error
            ? `Delivery photos are ready, but the request could not be marked delivered: ${failure.message}`
            : "Delivery photos are ready, but the request could not be marked delivered.",
        );
      }
      const tripUid = updatedRequest.trip?.uid ?? order.trip?.uid;
      if (tripUid) {
        await queryClient.invalidateQueries({
          queryKey: tripOrderKeys.byTrip(tripUid),
        });
      }
    }

    if (!proof.isSaved) {
      updatedRequest = await addDeliveryProof.mutateAsync(proof.payload);
      proof = { ...proof, isSaved: true };
      setDeliveryProof(proof);
    }

    const requesterUid = updatedRequest.requester?.uid ?? order.requester.uid;
    const tripUid = updatedRequest.trip?.uid ?? order.trip?.uid;
    try {
      const conversation = await createConversation.mutateAsync({
        requestId: updatedRequest.uid,
        tripId: tripUid,
        ...(requesterUid ? { userId: requesterUid } : {}),
      });
      const existingMessages = await messageService.getConversationMessages(
        conversation.id,
      );
      const alreadyShared = existingMessages.some(
        (message) =>
          message.deliveryProof?.requestUid === updatedRequest.uid &&
          message.deliveryProof.driverUid === driverUid &&
          message.deliveryProof.itemPhotoUrls.length ===
            proof.payload.itemPhotoUrls.length &&
          message.deliveryProof.itemPhotoUrls.every((url) =>
            proof.payload.itemPhotoUrls.includes(url),
          ),
      );
      if (!alreadyShared) {
        await messageService.sendMessage(conversation.id, {
          content: createDeliveryProofMessage({
            requestUid: updatedRequest.uid,
            driverUid,
            itemPhotoUrls: proof.payload.itemPhotoUrls,
            note: proof.payload.note,
          }),
          type: "text",
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["messages"] });
      setDeliveryProof(null);
    } catch (failure) {
      throw new Error(
        failure instanceof Error
          ? `Request marked delivered, but delivery proof could not be shared in chat: ${failure.message}`
          : "Request marked delivered, but delivery proof could not be shared in chat.",
      );
    }
  }

  return {
    submit,
    submissionState: deliveryProof?.isSaved
      ? ("saved" as const)
      : deliveryProof
        ? ("prepared" as const)
        : ("idle" as const),
    preparedPhotoCount: deliveryProof?.payload.itemPhotoUrls.length ?? 0,
    hasPendingProof: Boolean(deliveryProof),
    isSubmitting:
      addDeliveryProof.isPending ||
      uploadMedia.isPending ||
      updateStatus.isPending ||
      createConversation.isPending,
  };
}
