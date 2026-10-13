import * as Linking from "expo-linking";

export interface SharedDetailTarget {
  type: "trip" | "request";
  uid: string;
}

export function createSharedDetailLink(
  type: "trip" | "request",
  uid: string,
) {
  if (!uid.trim()) {
    throw new Error("An ID is required to create a share link.");
  }
  return Linking.createURL(`shared/${type}/${encodeURIComponent(uid)}`);
}

export function parseSharedDetailLink(
  value: string,
): SharedDetailTarget | null {
  const match =
    /routebuddy:\/\/shared\/(trip|request)\/([^/?#\s]+)/i.exec(value);
  if (!match) return null;

  try {
    const encodedUid = match[2].replace(/[.,;!]+$/, "");
    const uid = decodeURIComponent(encodedUid);
    return uid
      ? {
          type: match[1].toLowerCase() === "trip" ? "trip" : "request",
          uid,
        }
      : null;
  } catch {
    return null;
  }
}
