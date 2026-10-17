import type { ChatDeliveryProof } from "../types/message.types";

const OFFER_MESSAGE_PREFIX = "[[routebuddy-offer:";
const TRIP_ORDER_MESSAGE_PREFIX = "[[routebuddy-order:";
const DELIVERY_PROOF_MESSAGE_PREFIX = "[[routebuddy-delivery-proof:";

export interface RequestOfferMessageReference {
  requestUid: string;
  offerUid: string;
}

export function createRequestOfferMessage(
  reference: RequestOfferMessageReference,
  visibleMessage: string,
) {
  return `${OFFER_MESSAGE_PREFIX}${JSON.stringify(reference)}]]\n${visibleMessage}`;
}

export function createTripOrderMessage(
  orderUid: string,
  driverUid: string,
  visibleMessage: string,
) {
  if (!orderUid.trim() || !driverUid.trim()) {
    throw new Error("An order ID and driver ID are required to create an order message.");
  }
  const reference = encodeURIComponent(JSON.stringify({ orderUid, driverUid }));
  return `${TRIP_ORDER_MESSAGE_PREFIX}${reference}]]\n${visibleMessage}`;
}

export function createDeliveryProofMessage(
  proof: ChatDeliveryProof,
) {
  if (!proof.requestUid.trim() || !proof.driverUid.trim()) {
    throw new Error("A request ID and driver ID are required for delivery proof.");
  }
  if (proof.itemPhotoUrls.length === 0) {
    throw new Error("At least one delivery photo is required.");
  }
  const reference = encodeURIComponent(JSON.stringify(proof));
  return `${DELIVERY_PROOF_MESSAGE_PREFIX}${reference}]]`;
}

export function parseRequestOfferMessage(content: string): {
  visibleMessage: string;
  requestOffer?: RequestOfferMessageReference;
  tripOrderUid?: string;
  tripOrderDriverUid?: string;
  deliveryProof?: ChatDeliveryProof;
} {
  if (content.startsWith(DELIVERY_PROOF_MESSAGE_PREFIX)) {
    const endOfHeader = content.indexOf(
      "]]",
      DELIVERY_PROOF_MESSAGE_PREFIX.length,
    );
    if (endOfHeader >= 0) {
      try {
        const proof = JSON.parse(
          decodeURIComponent(
            content.slice(DELIVERY_PROOF_MESSAGE_PREFIX.length, endOfHeader),
          ),
        ) as Partial<ChatDeliveryProof>;
        if (
          typeof proof.requestUid === "string" &&
          proof.requestUid &&
          typeof proof.driverUid === "string" &&
          proof.driverUid &&
          Array.isArray(proof.itemPhotoUrls) &&
          proof.itemPhotoUrls.length > 0 &&
          proof.itemPhotoUrls.every(
            (url) => typeof url === "string" && url.length > 0,
          )
        ) {
          return {
            visibleMessage: "Delivery proof submitted.",
            tripOrderUid: proof.requestUid,
            tripOrderDriverUid: proof.driverUid,
            deliveryProof: {
              requestUid: proof.requestUid,
              driverUid: proof.driverUid,
              itemPhotoUrls: proof.itemPhotoUrls,
              note: typeof proof.note === "string" ? proof.note : undefined,
            },
          };
        }
      } catch {
        return { visibleMessage: content };
      }
    }
    return { visibleMessage: content };
  }

  if (content.startsWith(TRIP_ORDER_MESSAGE_PREFIX)) {
    const endOfHeader = content.indexOf("]]", TRIP_ORDER_MESSAGE_PREFIX.length);
    if (endOfHeader >= 0) {
      try {
        const reference = JSON.parse(decodeURIComponent(
          content.slice(TRIP_ORDER_MESSAGE_PREFIX.length, endOfHeader),
        )) as { orderUid?: unknown; driverUid?: unknown };
        if (
          typeof reference.orderUid === "string" &&
          reference.orderUid &&
          typeof reference.driverUid === "string" &&
          reference.driverUid
        ) {
          return {
            visibleMessage: content.slice(endOfHeader + 2).replace(/^\n/, ""),
            tripOrderUid: reference.orderUid,
            tripOrderDriverUid: reference.driverUid,
          };
        }
      } catch {
        return { visibleMessage: content };
      }
    }
    return { visibleMessage: content };
  }

  const legacyOrderMatch = content.match(
    /^Payment successful for order\s+([^\s.]+)\.?\s*/i,
  );
  if (legacyOrderMatch) {
    return {
      visibleMessage: content
        .replace(legacyOrderMatch[0], "Payment confirmed for your shopping order.\n")
        .trimStart(),
      tripOrderUid: legacyOrderMatch[1],
    };
  }

  if (!content.startsWith(OFFER_MESSAGE_PREFIX)) {
    return { visibleMessage: content };
  }

  const endOfHeader = content.indexOf("]]", OFFER_MESSAGE_PREFIX.length);
  if (endOfHeader < 0) {
    return { visibleMessage: content };
  }

  try {
    const reference = JSON.parse(
      content.slice(OFFER_MESSAGE_PREFIX.length, endOfHeader),
    ) as Partial<RequestOfferMessageReference>;
    if (
      typeof reference.requestUid !== "string" ||
      !reference.requestUid ||
      typeof reference.offerUid !== "string" ||
      !reference.offerUid
    ) {
      return { visibleMessage: content };
    }

    return {
      visibleMessage: content.slice(endOfHeader + 2).replace(/^\n/, ""),
      requestOffer: {
        requestUid: reference.requestUid,
        offerUid: reference.offerUid,
      },
    };
  } catch {
    return { visibleMessage: content };
  }
}
