import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestOffer } from "../types/request";
import { RequestOfferCard } from "./RequestOfferCard";

interface RequestOffersListProps {
  offers: RequestOffer[];
  requestStatus: string;
  acceptingOfferUid?: string;
  onAccept: (offerUid: string) => void;
}

export function RequestOffersList({
  offers,
  requestStatus,
  acceptingOfferUid,
  onAccept,
}: RequestOffersListProps) {
  const { theme } = useUnistyles();
  const canAccept = requestStatus.toLowerCase() === "open";

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Driver Offers</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{offers.length}</Text>
        </View>
      </View>
      {offers.length === 0 ? (
        <View style={styles.emptyCard}>
          <MaterialCommunityIcons
            name="email-outline"
            size={23}
            color={theme.colors.muted}
          />
          <Text style={styles.emptyText}>
            No offers yet. We’ll show driver offers here when they arrive.
          </Text>
        </View>
      ) : (
        <View style={styles.offerList}>
          {offers.map((offer) => (
            <RequestOfferCard
              key={offer.uid}
              offer={offer}
              canAccept={canAccept}
              isAccepting={acceptingOfferUid === offer.uid}
              isAnyOfferAccepting={Boolean(acceptingOfferUid)}
              onAccept={() => onAccept(offer.uid)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  section: {
    gap: theme.spacing.xs,
  },
  headingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  heading: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  countBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    minWidth: 22,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  countText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 11,
    textAlign: "center",
  },
  offerList: {
    gap: theme.spacing.sm,
  },
}));
