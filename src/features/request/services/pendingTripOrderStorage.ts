import AsyncStorage from "@react-native-async-storage/async-storage";

const PENDING_TRIP_ORDER_KEY = "routebuddy.pending-trip-order-payments";

interface PendingTripOrder {
  uid: string;
  createdAt: number;
}

async function readPendingOrders(): Promise<PendingTripOrder[]> {
  const value = await AsyncStorage.getItem(PENDING_TRIP_ORDER_KEY);
  if (!value) return [];

  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || !parsed.every(isPendingTripOrder)) {
    throw new Error("Stored unpaid-order cleanup data is invalid.");
  }
  return parsed;
}

function isPendingTripOrder(value: unknown): value is PendingTripOrder {
  return (
    typeof value === "object" &&
    value !== null &&
    "uid" in value &&
    typeof value.uid === "string" &&
    "createdAt" in value &&
    typeof value.createdAt === "number"
  );
}

async function writePendingOrders(orders: PendingTripOrder[]) {
  await AsyncStorage.setItem(PENDING_TRIP_ORDER_KEY, JSON.stringify(orders));
}

export async function trackPendingTripOrder(uid: string) {
  if (!uid.trim()) {
    throw new Error("An order ID is required to track its payment.");
  }
  const orders = await readPendingOrders();
  await writePendingOrders([
    ...orders.filter((order) => order.uid !== uid),
    { uid, createdAt: Date.now() },
  ]);
}

export async function untrackPendingTripOrder(uid: string) {
  const orders = await readPendingOrders();
  await writePendingOrders(orders.filter((order) => order.uid !== uid));
}

export async function listPendingTripOrders() {
  return readPendingOrders();
}
