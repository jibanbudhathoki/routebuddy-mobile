import { useEffect, useState } from "react";

interface UseChatRequestActionsOptions {
  requestUid?: string;
  onAcceptOffer?: (offerUid: string) => Promise<void>;
  onAcceptOrder?: (orderUid: string) => Promise<void>;
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
  onAcceptOffer,
  onAcceptOrder,
  onConfirmDelivery,
  onDeliveryConfirmed,
  setDialog,
  setError,
}: UseChatRequestActionsOptions) {
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

  useEffect(() => {
    setDeliveryConfirmed(false);
  }, [requestUid]);

  const handleAcceptOffer = (offerUid: string) => {
    if (!onAcceptOffer) return;
    void onAcceptOffer(offerUid)
      .then(() => {
        setDialog({
          title: "Offer accepted",
          message: "The request has been assigned to this driver.",
          actions: [{ label: "OK", onPress: () => {} }],
        });
      })
      .catch((failure: unknown) => {
        setError(
          failure instanceof Error
            ? failure.message
            : "Unable to accept this offer. Please try again.",
        );
      });
  };

  const handleAcceptOrder = (orderUid: string) => {
    if (!onAcceptOrder) return;
    void onAcceptOrder(orderUid)
      .then(() => {
        setDialog({
          title: "Order accepted",
          message: "The order is now assigned to you.",
          actions: [{ label: "OK", onPress: () => {} }],
        });
      })
      .catch((failure: unknown) => {
        setError(
          failure instanceof Error
            ? failure.message
            : "Unable to accept this order. Please try again.",
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
    onAcceptOffer: handleAcceptOffer,
    onAcceptOrder: handleAcceptOrder,
    onConfirmDelivery: handleConfirmDelivery,
  };
}
