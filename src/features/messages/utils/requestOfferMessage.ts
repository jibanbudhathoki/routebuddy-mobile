const OFFER_MESSAGE_PREFIX = "[[routebuddy-offer:";

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

export function parseRequestOfferMessage(content: string): {
  visibleMessage: string;
  requestOffer?: RequestOfferMessageReference;
} {
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
