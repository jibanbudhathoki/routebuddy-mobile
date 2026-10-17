import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePaymentMethods } from "../hooks/usePaymentMethods";
import { DefaultPaymentMethodCard } from "../components/DefaultPaymentMethodCard";
import { SavedPaymentMethodItem } from "../components/SavedPaymentMethodItem";
import { AddPaymentMethodCard } from "../components/AddPaymentMethodCard";
import { StripeSecurityBanner } from "../components/StripeSecurityBanner";
import { PaymentMethodActionModal } from "../components/PaymentMethodActionModal";
import { AddPaymentMethodModal } from "../components/AddPaymentMethodModal";

export function ManagePaymentMethodsScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();

  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  useEffect(() => {
    const onBackPress = () => {
      handleBack();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, []);

  const {
    defaultPaymentMethod,
    savedPaymentMethods,
    isLoading,
    selectedMethodForMenu,
    openMenu,
    closeMenu,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    setDefault,
    deletePaymentMethod,
    addPaymentMethod,
    isSubmitting,
  } = usePaymentMethods();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.title}>Manage Payment Methods</Text>
          <Text style={styles.subtitle}>
            Add, edit, or remove payment methods from your account.
          </Text>
        </View>

        <TouchableOpacity
          onPress={openAddModal}
          style={styles.addNewButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Add New Payment Method"
        >
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={26}
            color={theme.colors.text}
          />
          <Text style={styles.addNewText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Default Payment Method Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default Payment Method</Text>
            <DefaultPaymentMethodCard paymentMethod={defaultPaymentMethod} />
          </View>

          {/* Saved Payment Methods Section */}
          {savedPaymentMethods.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
              <View style={styles.savedList}>
                {savedPaymentMethods.map((pm) => (
                  <SavedPaymentMethodItem
                    key={pm.id}
                    paymentMethod={pm}
                    onOptionsPress={openMenu}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Add Payment Method Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Payment Method</Text>
            <AddPaymentMethodCard onPress={openAddModal} />
          </View>

          {/* Footer Security Banner */}
          <View style={styles.securitySection}>
            <StripeSecurityBanner />
          </View>
        </ScrollView>
      )}

      {/* Action Sheet Modal for Card Options */}
      <PaymentMethodActionModal
        visible={!!selectedMethodForMenu}
        paymentMethod={selectedMethodForMenu}
        onClose={closeMenu}
        onSetDefault={setDefault}
        onDelete={deletePaymentMethod}
      />

      {/* Add New Card Modal */}
      <AddPaymentMethodModal
        visible={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={addPaymentMethod}
        isLoading={isSubmitting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  headerTitles: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: theme.spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.muted,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
  },
  addNewButton: {
    width: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  addNewText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl + 20,
    gap: theme.spacing.lg,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  savedList: {
    gap: theme.spacing.sm,
  },
  securitySection: {
    marginTop: theme.spacing.xs,
  },
}));
