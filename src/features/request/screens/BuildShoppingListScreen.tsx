import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PrimaryButton } from "../../../shared/components/PrimaryButton";
import { useRequestCreation } from "../context/RequestCreationContext";
import { RequestItem } from "../types/request";

export function BuildShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useUnistyles();
  const { requestData, updateRequestData } = useRequestCreation();

  const [items, setItems] = useState<RequestItem[]>(requestData.items || []);
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  // New item state
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const handleAddItem = () => {
    if (!newItemName.trim() || !newItemPrice.trim()) return;

    const newItem: RequestItem = {
      id: Math.random().toString(),
      name: newItemName,
      description: newItemDescription,
      estimatedPrice: newItemPrice,
    };

    setItems([...items, newItem]);
    
    // Reset form
    setNewItemName("");
    setNewItemDescription("");
    setNewItemPrice("");
    setIsAddingItem(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleContinue = () => {
    updateRequestData({ items });
    router.back();
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Build Shopping List</Text>
        <TouchableOpacity style={styles.headerButton}>
          <View>
            <MaterialCommunityIcons
              name="bell-outline"
              size={28}
              color={theme.colors.primary}
            />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mock Trip Info Card */}
        <View style={styles.tripCard}>
          <View style={styles.storeLogoContainer}>
            <Text style={styles.storeLogoText}>COSTCO</Text>
            <Text style={styles.storeLogoSubText}>WHOLESALE</Text>
          </View>
          <View style={styles.tripCardInfo}>
            <Text style={styles.tripCardTitle}>Costco Run</Text>
            <Text style={styles.tripCardRoute}>Winnipeg, MB  →  Brandon, MB</Text>
            <View style={styles.tripCardDetails}>
              <View style={styles.tripCardDetailItem}>
                <MaterialCommunityIcons name="calendar-outline" size={14} color={theme.colors.text} style={{ opacity: 0.6 }} />
                <Text style={styles.tripCardDetailText}>May 24, 2026</Text>
              </View>
              <Text style={styles.tripCardDetailDivider}>|</Text>
              <View style={styles.tripCardDetailItem}>
                <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.text} style={{ opacity: 0.6 }} />
                <Text style={styles.tripCardDetailText}>Delivery by 6:00 PM</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>1. Add Items</Text>
        <Text style={styles.sectionSubtitle}>List the items you need and an estimated price for each.</Text>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>#</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Item</Text>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Description (brand, size, etc.)</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: 'right' }]}>Est. Price (CAD)</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Action</Text>
          </View>

          {items.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>{index + 1}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={2}>{item.name}</Text>
              <Text style={[styles.tableCell, { flex: 3 }]} numberOfLines={3}>{item.description}</Text>
              <View style={[styles.priceCellContainer, { flex: 1.5 }]}>
                <Text style={styles.priceSymbol}>$</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', flex: 1 }]}>{item.estimatedPrice}</Text>
              </View>
              <TouchableOpacity 
                style={[styles.actionCell, { flex: 1 }]}
                onPress={() => handleRemoveItem(item.id)}
              >
                <MaterialCommunityIcons name="trash-can-outline" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.addAnotherButton}
          onPress={() => setIsAddingItem(true)}
        >
          <MaterialCommunityIcons name="plus-circle-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.addAnotherText}>Add another item</Text>
        </TouchableOpacity>
      </ScrollView>

      {!isAddingItem && (
        <View style={styles.footer}>
          <PrimaryButton title="Continue" onPress={handleContinue} />
        </View>
      )}

      {/* Add New Item Modal / Bottom Sheet */}
      <Modal
        visible={isAddingItem}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAddingItem(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalDragHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Item</Text>
              <TouchableOpacity onPress={() => setIsAddingItem(false)} style={styles.modalCloseButton}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Item <Text style={styles.requiredAsterisk}>*</Text></Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="tag-outline" size={20} color={theme.colors.text} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Milk"
                    placeholderTextColor={theme.colors.text + "80"}
                    value={newItemName}
                    onChangeText={setNewItemName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description (brand, size, etc.)</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons name="format-list-bulleted" size={20} color={theme.colors.text} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 2% milk, 4L"
                    placeholderTextColor={theme.colors.text + "80"}
                    value={newItemDescription}
                    onChangeText={setNewItemDescription}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Estimated Price (CAD) <Text style={styles.requiredAsterisk}>*</Text></Text>
                <View style={styles.inputContainerHalf}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor={theme.colors.text + "80"}
                    keyboardType="decimal-pad"
                    value={newItemPrice}
                    onChangeText={setNewItemPrice}
                  />
                </View>
              </View>

              <View style={styles.modalFooter}>
                <PrimaryButton 
                  title="Add Item" 
                  onPress={handleAddItem}
                  disabled={!newItemName.trim() || !newItemPrice.trim()}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
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
    color: theme.colors.primary,
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  notificationText: {
    color: theme.colors.surface,
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  tripCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  storeLogoContainer: {
    width: 70,
    height: 70,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  storeLogoText: {
    color: theme.colors.surface,
    fontWeight: "900",
    fontSize: 14,
    fontStyle: "italic",
  },
  storeLogoSubText: {
    color: theme.colors.surface,
    fontWeight: "bold",
    fontSize: 8,
    marginTop: 2,
  },
  tripCardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  tripCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  tripCardRoute: {
    fontSize: 13,
    color: theme.colors.text,
    marginBottom: 8,
  },
  tripCardDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripCardDetailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tripCardDetailText: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.6,
    marginLeft: 4,
  },
  tripCardDetailDivider: {
    fontSize: 12,
    color: theme.colors.border,
    marginHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.colors.primary,
    opacity: 0.8,
    marginBottom: theme.spacing.md,
  },
  table: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: theme.colors.primarySoft,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tableCell: {
    fontSize: 13,
    color: theme.colors.text,
    paddingHorizontal: 2,
  },
  priceCellContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: theme.spacing.xs,
  },
  priceSymbol: {
    fontSize: 13,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  actionCell: {
    alignItems: "center",
    justifyContent: "center",
  },
  addAnotherButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: "dashed",
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.xl,
  },
  addAnotherText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl * 2,
    maxHeight: "80%",
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    position: "relative",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  modalCloseButton: {
    position: "absolute",
    right: 0,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  requiredAsterisk: {
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
  inputContainerHalf: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 50,
    width: "50%",
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
    opacity: 0.5,
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
  modalFooter: {
    marginTop: theme.spacing.lg,
  },
}));
