import { useEffect, useState } from "react";
import type { RequestAction } from "../../request/types/request";

interface UseChatRequestActionsOptions {
  requestUid?: string;
  onOfferAction?: (
    offerUid: string,
    action: RequestAction,
  ) => Promise<void>;
  onOrderAction?: (
    orderUid: string,
    action: RequestAction,
  ) => Promise<void>;
  onConfirmDelivery?: (requestUid: string) => Promise<void>;
  onDeliveryConfirmed?: () => void;
  setDialog: (dialog: {
    title: string;
    message: string;
    actions: Array<{ label: string; onPress: () => void }>;
  }) => void;
  setError: (message: string) => void;
}

export function useChatRequestActions({
  requestUid,
  onOfferAction,
  onOrderAction,
  onConfirmDelivery,
  onDeliveryConfirmed,
  setDialog,
  setError,
}: UseChatRequestActionsOptions) {
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  useEffect(() => {
    setDeliveryConfirmed(false);
  }, [requestUid]);

  const handleOfferAction = (
    offerUid: string,
    action: RequestAction,
  ) => {
    if (!onOfferAction) return;
    void onOfferAction(offerUid, action)
      .then(() => {
        setDialog({
          title: action === "accept" ? "Offer accepted" : "Offer rejected",
          message:
            action === "accept"
              ? "The request has been assigned to this driver."
              : "The driver offer has been rejected.",
          actions: [{ label: "OK", onPress: () => {} }],
        });
      })
      .catch((failure: unknown) => {
        setError(
          failure instanceof Error
            ? failure.message
            : `Unable to ${action} this offer. Please try again.`,
        );
      });
  };

  const handleOrderAction = (
    orderUid: string,
    action: RequestAction,
  ) => {
    if (!onOrderAction) return;
    void onOrderAction(orderUid, action)
      .then(() => {
        setDialog({
          title: action === "accept" ? "Order accepted" : "Order rejected",
          message:
            action === "accept"
              ? "The order is now assigned to you."
              : "The trip order has been rejected.",
          actions: [{ label: "OK", onPress: () => {} }],
        });
      })
      .catch((failure: unknown) => {
        setError(
          failure instanceof Error
            ? failure.message
            : `Unable to ${action} this order. Please try again.`,
        );
      });
  };

  const handleConfirmDelivery = (orderUid: string) => {
    if (!onConfirmDelivery) return;
    void onConfirmDelivery(orderUid)
      .then(() => {
        setDeliveryConfirmed(true);
        if (onDeliveryConfirmed) {
          onDeliveryConfirmed();
        } else {
          setDialog({
            title: "Delivery confirmed",
            message: "The requester has confirmed this delivery.",
            actions: [{ label: "OK", onPress: () => {} }],
          });
        }
      })
      .catch((failure: unknown) => {
        setError(
          failure instanceof Error
            ? failure.message
            : "Unable to confirm delivery. Please try again.",
        );
      });
  };

  return {
    deliveryConfirmed,
    onOfferAction: handleOfferAction,
    onOrderAction: handleOrderAction,
    onConfirmDelivery: handleConfirmDelivery,
  };
}
