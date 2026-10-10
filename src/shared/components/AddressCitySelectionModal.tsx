import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { City } from "../city/types/city";
import { getTopSafeAreaInset } from "../utils/safeArea";

interface AddressCitySelectionModalProps {
  visible: boolean;
  topInset: number;
  cities: City[];
  isLoading: boolean;
  onClose: () => void;
  onSelect: (city: City) => void;
}

export function AddressCitySelectionModal({
  visible,
  topInset,
  cities,
  isLoading,
  onClose,
  onSelect,
}: AddressCitySelectionModalProps) {
  const { theme } = useUnistyles();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[
          styles.container,
          { paddingTop: getTopSafeAreaInset(topInset) },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select City</Text>
          <TouchableOpacity style={styles.headerButton} onPress={onClose}>
            <MaterialCommunityIcons
              name="close"
              size={28}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: theme.spacing.xl }}
          />
        ) : (
          <FlatList
            data={cities}
            keyExtractor={(city) => city.uid}
            contentContainerStyle={{ padding: theme.spacing.md }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cityItem}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.cityNameText}>{item.name}</Text>
                {item.province && (
                  <Text style={styles.provinceNameText}>
                    {typeof item.province === "string"
                      ? item.province
                      : item.province.name}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  cityItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cityNameText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "bold",
    marginBottom: 4,
  },
  provinceNameText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
}));
