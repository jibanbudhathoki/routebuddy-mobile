import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQueries } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

import { useToast } from "../../../shared/components/ToastProvider";
import { AppScreen } from "../../../shared/components/AppScreen";
import { Button } from "../../../shared/components/Button";
import { getRequestDetails } from "../../request/services/request.service";
import { useTripOrders } from "../hooks/useTripOrders";
import { shoppingChecklistStorage } from "../services/shoppingChecklistStorage";
import { TripShoppingListContent, type ShoppingOrder } from "../components/TripShoppingListContent";
import { styles } from "../components/tripShoppingScreen.styles";

export function TripShoppingScreen() {
  const router = useRouter();
  const { theme } = useUnistyles();
  const { showToast } = useToast();
  const params = useLocalSearchParams<{ uid?: string }>();
  const tripUid = typeof params.uid === "string" ? params.uid : "";
  const tripOrders = useTripOrders(tripUid);
  const acceptedOrders = (tripOrders.data ?? []).filter(
    (order) => order.status.trim().toLowerCase() === "accepted",
  );
  const orderDetails = useQueries({
    queries: acceptedOrders.map((order) => ({
      queryKey: ["requests", "details", order.uid],
      queryFn: () => getRequestDetails(order.uid),
      enabled: Boolean(order.uid),
    })),
  });

  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isLoadingSavedItems, setIsLoadingSavedItems] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoadingSavedItems(true);
    setStorageError(null);
    shoppingChecklistStorage
      .getCheckedItems(tripUid)
      .then((savedItems) => {
        if (active) setCheckedItems(new Set(savedItems));
      })
      .catch((error: unknown) => {
        if (active) {
          setStorageError(
            error instanceof Error
              ? error.message
              : "Unable to load the saved shopping list.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoadingSavedItems(false);
      });
    return () => {
      active = false;
    };
  }, [tripUid]);

  const isLoadingDetails =
    tripOrders.isLoading || orderDetails.some((query) => query.isLoading);
  const detailsError =
    tripOrders.error ??
    orderDetails.find((query) => query.error)?.error ??
    null;
  const shoppingOrders: ShoppingOrder[] = acceptedOrders.flatMap(
    (order, index) => {
      const request = orderDetails[index]?.data;
      return request
        ? [
            {
              uid: order.uid,
              requesterName:
                request.requester.name ??
                request.requester.fName ??
                order.requester.name ??
                "Requester",
              request,
            },
          ]
        : [];
    },
  );

  return (
    <AppScreen>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.headerAction}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={25}
              color={theme.colors.text}
            />
          </Pressable>
          <Text style={styles.headerTitle}>Shopping List</Text>
          <View style={styles.headerAction} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {isLoadingDetails || isLoadingSavedItems ? (
            <View style={styles.state}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={styles.stateText}>Loading shopping list...</Text>
            </View>
          ) : storageError ? (
            <View style={styles.state}>
              <Text style={styles.stateTitle}>Saved list unavailable</Text>
              <Text style={styles.stateText}>{storageError}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.back()}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Go back</Text>
              </Pressable>
            </View>
          ) : detailsError ? (
            <View style={styles.state}>
              <Text style={styles.stateTitle}>Could not load shopping list</Text>
              <Text style={styles.stateText}>
                {detailsError instanceof Error
                  ? detailsError.message
                  : "Order details are unavailable."}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  void tripOrders.refetch();
                  orderDetails.forEach((query) => void query.refetch());
                }}
                style={styles.retryButton}
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            </View>
          ) : shoppingOrders.length === 0 ? (
            <View style={styles.state}>
              <Text style={styles.stateTitle}>No accepted orders yet</Text>
              <Text style={styles.stateText}>
                Accepted order items will appear here for shopping.
              </Text>
            </View>
          ) : (
            <TripShoppingListContent
              orders={shoppingOrders}
              checkedItems={checkedItems}
              onToggleItem={toggleItem}
            />
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Save"
            loading={isSaving}
            disabled={isLoadingDetails || isLoadingSavedItems || Boolean(storageError)}
            onPress={() => void saveChecklist()}
            style={styles.saveButton}
          />
          <View style={styles.buttonIcon}>
            <MaterialCommunityIcons
              name="content-save-outline"
              size={18}
              color={theme.colors.onPrimary}
            />
          </View>
        </View>
      </View>
    </AppScreen>
  );

  function toggleItem(itemKey: string) {
    setCheckedItems((current) => {
      const next = new Set(current);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  }

  async function saveChecklist() {
    if (!tripUid || isSaving || isLoadingSavedItems || storageError) return;
    setIsSaving(true);
    try {
      await shoppingChecklistStorage.saveCheckedItems(
        tripUid,
        Array.from(checkedItems),
      );
      showToast("Shopping checklist saved.", { variant: "success" });
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to save the shopping checklist.",
      );
    } finally {
      setIsSaving(false);
    }
  }
}
