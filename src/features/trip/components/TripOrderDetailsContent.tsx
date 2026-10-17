import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { RequesterAvatar } from "./TripOrdersSection";
import { styles } from "./tripOrderDetailsScreen.styles";
import type { RequestDetailsResponse } from "../../request/types/request";
import { RequestStatusTimeline } from "../../request/components/RequestStatusTimeline";

export function TripOrderDetailsContent({
  order,
}: {
  order: RequestDetailsResponse;
}) {
  const { theme } = useUnistyles();
  const requesterName =
    order.requester.name ?? order.requester.fName ?? "Requester";
  const driverName = order.driver?.name;
  const items = order.items;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.requesterCard}>
        <RequesterAvatar
          name={requesterName}
          photoUrl={order.requester.photoUrl ?? null}
        />
        <View style={styles.personInfo}>
          <Text style={styles.eyebrow}>REQUESTER</Text>
          <Text numberOfLines={1} style={styles.personName}>
            {requesterName}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{formatStatus(order.status)}</Text>
        </View>
      </View>

      <RequestStatusTimeline request={order} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order details</Text>
        <View style={styles.card}>
          <DetailRow
            label="Trip route"
            value={`${order.origin} → ${order.destination}`}
          />
          <DetailRow label="Needed by" value={formatDate(order.neededBy)} />
          <DetailRow
            label="Latest delivery"
            value={formatDate(order.latestDeliveryBy)}
          />
          <DetailRow
            label="Delivery address"
            value={formatDeliveryAddress(order.deliveryAddress, order)}
            last
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Shopping list</Text>
          <Text style={styles.sectionCaption}>{items.length} items</Text>
        </View>
        <View style={styles.card}>
          {order.stores.map((store) => (
            <View key={store.uid} style={styles.storeRow}>
              <MaterialCommunityIcons
                name="store-outline"
                size={16}
                color={theme.colors.muted}
              />
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{store.name}</Text>
                {store.location.city.name ? (
                  <Text style={styles.storeLocation}>
                    {[store.location.city.name, store.location.province.name]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
          {items.length ? (
            items.map((item, index) => (
              <View
                key={`${item.item}-${index}`}
                style={[styles.itemRow, index < items.length - 1 && styles.detailDivider]}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.item}</Text>
                  {item.description ? (
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  ) : null}
                </View>
                <Text style={styles.itemPrice}>
                  {formatMoney(item.estimatePrice)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No items were added to this order.</Text>
          )}
        </View>
      </View>

      {order.notes?.trim() ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special instructions</Text>
          <View style={styles.card}>
            <Text style={styles.notes}>{order.notes}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment summary</Text>
        <View style={styles.card}>
          <CostRow label="Items subtotal" value={order.itemSubtotal} />
          <CostRow label="Service fee" value={order.serviceFee} />
          <CostRow label="Driver fee" value={order.driverFee} />
          <CostRow label="Platform fee" value={order.platformFee} />
          <CostRow label="Tax" value={order.tax} />
          <CostRow label="Total" value={order.total} total />
        </View>
      </View>

      {driverName ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Driver</Text>
          <View style={styles.card}>
            <View style={styles.person}>
              <RequesterAvatar
                name={driverName}
                photoUrl={order.driver?.photoUrl ?? null}
              />
              <Text style={styles.personName}>{driverName}</Text>
            </View>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value?: string;
  last?: boolean;
}) {
  if (!value) return null;
  return (
    <View style={[styles.detailRow, !last && styles.detailDivider]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function CostRow({
  label,
  value,
  total = false,
}: {
  label: string;
  value?: string | number | null;
  total?: boolean;
}) {
  if (value == null) return null;
  return (
    <View style={[styles.costRow, total && styles.totalRow]}>
      <Text style={total ? styles.totalLabel : styles.detailLabel}>{label}</Text>
      <Text style={total ? styles.totalValue : styles.detailValue}>
        {formatMoney(value)}
      </Text>
    </View>
  );
}

function formatMoney(value?: string | number | null) {
  if (value == null || value === "") return "-";
  return typeof value === "number" ? `CAD ${value.toFixed(2)}` : value;
}

function formatDate(value?: string) {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function formatDeliveryAddress(
  address: string,
  order: RequestDetailsResponse,
) {
  const isAddressId = /^address[_-]/i.test(address.trim());
  if (address.trim() && !isAddressId) return address;

  return [
    order.deliveryLocation.city.name,
    order.deliveryLocation.province.name,
    order.deliveryLocation.country.name,
  ]
    .filter(Boolean)
    .join(", ");
}

function formatStatus(status: string) {
  return status.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) =>
    letter.toUpperCase(),
  );
}
