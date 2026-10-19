import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { RequestAction, RequestOffer } from "../types/request";
import { RequestOfferCard } from "./RequestOfferCard";

interface RequestOffersListProps {
  offers: RequestOffer[];
  requestStatus: string;
  respondingOfferUid?: string;
  respondingAction?: RequestAction;
  onAction: (offerUid: string, action: RequestAction) => void;
}

export function RequestOffersList({
  offers,
  requestStatus,
  respondingOfferUid,
  respondingAction,
  onAction,
}: RequestOffersListProps) {
  const { theme } = useUnistyles();
  const canRespond = requestStatus.toLowerCase() === "open";

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
              canRespond={canRespond}
              isResponding={respondingOfferUid === offer.uid}
              respondingAction={
                respondingOfferUid === offer.uid ? respondingAction : undefined
              }
              isAnyOfferResponding={Boolean(respondingOfferUid)}
              onAction={(action) => onAction(offer.uid, action)}
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
    fontSize: 15,
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
    color: theme.colors.text,
    fontSize: 11,
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
    fontSize: 12,
    textAlign: "center",
  },
  offerList: {
    gap: theme.spacing.sm,
  },
}));
