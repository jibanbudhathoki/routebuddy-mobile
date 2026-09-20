import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AddActionModalProps {
  visible: boolean;
  onClose: () => void;
  onPostTrip: () => void;
  onPostRequest: () => void;
}

export function AddActionModal({
  visible,
  onClose,
  onPostTrip,
  onPostRequest,
}: AddActionModalProps) {
  const { theme } = useUnistyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.content}>
              <View style={styles.dragIndicator} />

              <Text style={styles.title}>What would you like to do?</Text>

              <TouchableOpacity
                style={[
                  styles.actionCard,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={onPostTrip}
              >
                <View style={[styles.iconCircle, { backgroundColor: theme.colors.surface }]}>
                  <MaterialCommunityIcons
                    name="car"
                    size={32}
                    color={theme.colors.text}
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, { color: theme.colors.onPrimary }]}>Post a Trip</Text>
                  <Text style={[styles.cardSubtitle, { color: theme.colors.onPrimary }]}>
                    Share your trip and help others.
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={32}
                  color={theme.colors.onPrimary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionCard,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={onPostRequest}
              >
                <View
                  style={[styles.iconCircle, { backgroundColor: theme.colors.surface }]}
                >
                  <MaterialCommunityIcons
                    name="shopping-outline"
                    size={32}
                    color={theme.colors.text}
                  />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={[styles.cardTitle, { color: theme.colors.onPrimary }]}>Post a Request</Text>
                  <Text style={[styles.cardSubtitle, { color: theme.colors.onPrimary }]}>
                    Request items to be delivered on a trip.
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={32}
                  color={theme.colors.onPrimary}
                />
              </TouchableOpacity>

              <View style={styles.cancelContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
                <Text style={styles.cancelText}>Cancel</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    paddingBottom: 48,
    alignItems: "center",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    width: "100%",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.9,
  },
  cancelContainer: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  cancelButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
}));
