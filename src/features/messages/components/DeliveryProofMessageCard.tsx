import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import type { ChatDeliveryProof, ChatTripOrder } from "../types/message.types";
import { ChatMessageMedia } from "./ChatMessageMedia";
import { styles } from "./deliveryProofMessageCard.styles";

interface DeliveryProofMessageCardProps {
  proof: ChatDeliveryProof;
  order: ChatTripOrder;
  canConfirm: boolean;
  isConfirmed: boolean;
  isConfirming: boolean;
  onConfirm: () => void;
}

export function DeliveryProofMessageCard({
  proof,
  order,
  canConfirm,
  isConfirmed,
  isConfirming,
  onConfirm,
}: DeliveryProofMessageCardProps) {
  const { theme } = useUnistyles();

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <MaterialCommunityIcons
          name={isConfirmed ? "check-decagram" : "package-variant-closed-check"}
          size={19}
          color={theme.colors.text}
        />
        <View style={styles.headingCopy}>
          <Text style={styles.title}>Delivery proof</Text>
          <Text style={styles.status}>
            {isConfirmed ? "Delivery confirmed" : "Awaiting confirmation"}
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={styles.photoList}
        showsHorizontalScrollIndicator={false}
      >
        {proof.itemPhotoUrls.map((url, index) => (
          <View
            key={`${url}-${index}`}
            style={styles.photo}
          >
            <ChatMessageMedia type="image" uri={url} />
          </View>
        ))}
      </ScrollView>
      {proof.note ? <Text style={styles.note}>{proof.note}</Text> : null}
      {canConfirm && !isConfirmed && order.status.toLowerCase() === "delivered" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isConfirming, busy: isConfirming }}
          disabled={isConfirming}
          onPress={onConfirm}
          style={[styles.confirmButton, isConfirming && styles.disabledButton]}
        >
          {isConfirming ? (
            <ActivityIndicator size="small" color={theme.colors.onPrimary} />
          ) : (
            <MaterialCommunityIcons
              name="check"
              size={17}
              color={theme.colors.onPrimary}
            />
          )}
          <Text style={styles.confirmText}>
            {isConfirming ? "Confirming..." : "Confirm Delivery"}
          </Text>
        </Pressable>
      ) : isConfirmed ? (
        <View style={styles.confirmed}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={theme.colors.text}
          />
          <Text style={styles.confirmedText}>Delivery confirmed</Text>
        </View>
      ) : null}
    </View>
  );
}
