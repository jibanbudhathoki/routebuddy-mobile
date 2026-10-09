import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { PrimaryButton } from "../../../shared/components/PrimaryButton";

interface AddRequestItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAddItem: (item: {
    name: string;
    description: string;
    estimatedPrice: string;
  }) => void;
}

export function AddRequestItemModal({
  visible,
  onClose,
  onAddItem,
}: AddRequestItemModalProps) {
  const { theme } = useUnistyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const numericPrice = Number(price);
  const isPriceValid =
    price.trim() !== "" &&
    Number.isFinite(numericPrice) &&
    numericPrice >= 0;
  const canAdd = Boolean(name.trim() && isPriceValid);

  const handleAddItem = () => {
    if (!canAdd) return;

    onAddItem({
      name: name.trim(),
      description: description.trim(),
      estimatedPrice: String(numericPrice),
    });
    setName("");
    setDescription("");
    setPrice("");
  };

  const handlePriceChange = (value: string) => {
    if (/^\d*(\.\d*)?$/.test(value)) {
      setPrice(value);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <View style={styles.dragHandle} />
          <View style={styles.header}>
            <Text style={styles.title}>Add New Item</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close add item form"
              onPress={onClose}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Item <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="tag-outline"
                  size={20}
                  color={theme.colors.muted}
                  style={styles.inputIcon}
                />
                <TextInput
                  accessibilityLabel="Item name"
                  style={styles.input}
                  placeholder="e.g., Milk"
                  placeholderTextColor={theme.colors.muted}
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (brand, size, etc.)</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="format-list-bulleted"
                  size={20}
                  color={theme.colors.muted}
                  style={styles.inputIcon}
                />
                <TextInput
                  accessibilityLabel="Item description"
                  style={styles.input}
                  placeholder="e.g., 2% milk, 4L"
                  placeholderTextColor={theme.colors.muted}
                  value={description}
                  onChangeText={setDescription}
                  returnKeyType="next"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Estimated Price (CAD) <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  accessibilityLabel="Estimated item price"
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.muted}
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={handlePriceChange}
                />
              </View>
            </View>

            <View style={styles.footer}>
              <PrimaryButton
                title="Add Item"
                onPress={handleAddItem}
                disabled={!canAdd}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl * 2,
    maxHeight: "80%",
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    position: "relative",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    padding: theme.spacing.xs,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.error,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 50,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 50,
    width: "50%",
    minWidth: 160,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  footer: {
    marginTop: theme.spacing.lg,
  },
}));
