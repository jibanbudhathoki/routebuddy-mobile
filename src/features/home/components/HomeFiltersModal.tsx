import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUnistyles } from "react-native-unistyles";

import { HomeFilterDropdown } from "./HomeFilterDropdown";
import { homeFiltersModalStyles as styles } from "./HomeFiltersModal.styles";
import type { HomeFilterOption } from "../types/homeFilters";

export interface HomeFilterValues {
  location: string;
  store: string;
  date: string;
}

interface HomeFiltersModalProps {
  visible: boolean;
  locationOptions: HomeFilterOption[];
  storeOptions: HomeFilterOption[];
  values: HomeFilterValues;
  onApply: (values: HomeFilterValues) => void;
  onClose: () => void;
}

export function HomeFiltersModal({
  visible,
  locationOptions,
  storeOptions,
  values,
  onApply,
  onClose,
}: HomeFiltersModalProps) {
  const { theme } = useUnistyles();
  const [draft, setDraft] = useState(values);
  const [expandedPicker, setExpandedPicker] = useState<
    "location" | "store" | null
  >(null);

  useEffect(() => {
    if (visible) {
      setDraft(values);
      setExpandedPicker(null);
    }
  }, [values, visible]);

  const clearAll = () => {
    const cleared = { location: "", store: "", date: "" };
    setDraft(cleared);
    onApply(cleared);
    setExpandedPicker(null);
    onClose();
  };

  const apply = () => {
    onApply(draft);
    setExpandedPicker(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top", "left", "right", "bottom"]} style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close filters"
            onPress={onClose}
            hitSlop={8}
            style={styles.closeButton}
          >
            <MaterialCommunityIcons
              name="close"
              size={23}
              color={theme.colors.text}
            />
          </Pressable>
        </View>

        <ScrollView
          style={styles.fields}
          contentContainerStyle={styles.fieldsContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <HomeFilterDropdown
            label="Location (City)"
            placeholder="Select a location"
            options={locationOptions.filter((option) => option.value)}
            value={draft.location}
            expanded={expandedPicker === "location"}
            onToggle={() =>
              setExpandedPicker((current) =>
                current === "location" ? null : "location",
              )
            }
            onSelect={(location) => {
              setDraft((current) => ({ ...current, location }));
              setExpandedPicker(null);
            }}
          />

          <HomeFilterDropdown
            label="Store"
            placeholder="Select a store"
            options={storeOptions.filter((option) => option.value)}
            value={draft.store}
            expanded={expandedPicker === "store"}
            onToggle={() =>
              setExpandedPicker((current) =>
                current === "store" ? null : "store",
              )
            }
            onSelect={(store) => {
              setDraft((current) => ({ ...current, store }));
              setExpandedPicker(null);
            }}
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput
              accessibilityLabel="Filter by date in YYYY-MM-DD format"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={10}
              onChangeText={(date) =>
                setDraft((current) => ({ ...current, date }))
              }
              placeholder="e.g. 2026-09-03"
              placeholderTextColor={theme.colors.muted}
              returnKeyType="done"
              style={styles.input}
              value={draft.date}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            onPress={clearAll}
            style={[styles.footerButton, styles.clearButton]}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={apply}
            style={[styles.footerButton, styles.applyButton]}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
