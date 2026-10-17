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
import { LocationOption } from "../location/types/location";
import { getTopSafeAreaInset } from "../utils/safeArea";

interface AddressLocationSelectionModalProps {
  visible: boolean;
  topInset: number;
  title: string;
  options: LocationOption[];
  isLoading: boolean;
  onClose: () => void;
  onSelect: (option: LocationOption) => void;
}

export function AddressLocationSelectionModal({
  visible,
  topInset,
  title,
  options,
  isLoading,
  onClose,
  onSelect,
}: AddressLocationSelectionModalProps) {
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
          <Text style={styles.headerTitle}>{title}</Text>
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
            color={theme.colors.text}
            style={{ marginTop: theme.spacing.xl }}
          />
        ) : (
          <FlatList
            data={options}
            keyExtractor={(option) => option.uid}
            contentContainerStyle={[
              styles.optionsContent,
              options.length === 0 && styles.emptyContent,
            ]}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No {title.toLowerCase().replace("select ", "").toLowerCase()} options are available.
              </Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.optionNameText}>{item.name}</Text>
                {item.subtitle ? (
                  <Text style={styles.optionSubtitleText}>{item.subtitle}</Text>
                ) : null}
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
  optionsContent: {
    padding: theme.spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 16,
    textAlign: "center",
  },
  optionItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  optionNameText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "bold",
    marginBottom: 4,
  },
  optionSubtitleText: {
    fontSize: 14,
    color: theme.colors.muted,
  },
}));
