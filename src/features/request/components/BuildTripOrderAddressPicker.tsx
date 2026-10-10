import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import type { Address } from "../../../shared/address/types/address";
import { formatAddress } from "./BuildTripOrderAddressSection";

interface BuildTripOrderAddressPickerProps {
  addresses: Address[];
  selectedUid: string;
  visible: boolean;
  onClose: () => void;
  onAddAddress: () => void;
  onSelect: (address: Address) => void;
}

export function BuildTripOrderAddressPicker({
  addresses,
  selectedUid,
  visible,
  onClose,
  onAddAddress,
  onSelect,
}: BuildTripOrderAddressPickerProps) {
  const { theme } = useUnistyles();

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose delivery address</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close address picker"
              onPress={onClose}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {addresses.map((address) => {
              const isSelected = selectedUid === address.uid;
              return (
                <TouchableOpacity
                  accessibilityRole="button"
                  key={address.uid}
                  style={[
                    styles.addressOption,
                    isSelected && styles.addressOptionSelected,
                  ]}
                  onPress={() => onSelect(address)}
                >
                  <View style={styles.addressDetails}>
                    <Text style={styles.addressTitle}>{address.label}</Text>
                    <Text style={styles.addressText}>
                      {formatAddress(address)}
                    </Text>
                  </View>
                  {isSelected ? (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={22}
                      color={theme.colors.primary}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.addAddressButton}
            onPress={onAddAddress}
          >
            <Text style={styles.retryText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  modalOverlay: {
    backgroundColor: theme.colors.overlay,
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    maxHeight: "75%",
    padding: theme.spacing.lg,
  },
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  addressOption: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  addressOptionSelected: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  addressDetails: {
    flex: 1,
    gap: theme.spacing.xs,
    minWidth: 0,
  },
  addressTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  addressText: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  addAddressButton: {
    alignItems: "center",
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
  retryText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
    padding: theme.spacing.xs,
  },
}));
