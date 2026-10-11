import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

import { CheckoutOrderOverview } from "../components/CheckoutOrderOverview";
import { CheckoutPaymentForm } from "../components/CheckoutPaymentForm";
import { usePayment } from "../hooks/usePayment";
import { useRequestCreation } from "../../request/context/RequestCreationContext";
import { useCities } from "../../../shared/city/hooks/useCities";
import { useStores } from "../../../shared/store/hooks/useStores";
import { calculateEstimate } from "../../../shared/utils/pricing";
import { getTopSafeAreaInset } from "../../../shared/utils/safeArea";
import { useStripe } from "@stripe/stripe-react-native";
import { useToast } from "../../../shared/components/ToastProvider";

export function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { postId, clearRequestDraft } = useLocalSearchParams<{
    postId: string;
    clearRequestDraft?: string;
  }>();
  const { theme } = useUnistyles();
  const { requestData } = useRequestCreation();
  const [nameOnCard, setNameOnCard] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { initiateCheckout, isInitializing, error: paymentError } = usePayment();
  const { confirmPayment } = useStripe();
  const { showToast } = useToast();

  const items = requestData.items || [];
  const { subtotal, serviceFee, taxes, total } = calculateEstimate(items);
  const { stores } = useStores({ limit: 100 });
  const { cities } = useCities();
  const selectedStore = stores.find((store) =>
    requestData.stores?.includes(store.uid),
  );
  const storeName = selectedStore?.name || "Unknown Store";
  const storeNameParts = storeName.split(" ");
  const storeLogoText = storeNameParts[0]?.toUpperCase() || "STORE";
  const storeLogoSubText = storeNameParts.slice(1).join(" ").toUpperCase();
  const originCity = selectedStore?.city;
  const destinationCity = cities.find(
    (city) => city.uid === requestData.deliveryCityUid,
  );
  const routeText = `${originCity?.name || "Origin"}${formatProvince(selectedStore?.province)} → ${destinationCity?.name || "Destination"}${formatProvince(destinationCity?.province)}`;

  const isNameValid = nameOnCard.trim().length > 0;
  const isAllValid = isFormValid && isNameValid;
  const hasFailed = (hasSubmitted && !isAllValid) || !!paymentError;

  const handlePay = async () => {
    setHasSubmitted(true);
    if (!isAllValid) return;

    try {
      if (!postId) throw new Error("No post ID provided for checkout");

      const checkoutResponse = await initiateCheckout(postId);
      if (checkoutResponse.data.clientSecret) {
        const { error: stripeError } = await confirmPayment(
          checkoutResponse.data.clientSecret,
          {
            paymentMethodType: "Card",
            paymentMethodData: {
              billingDetails: { name: nameOnCard },
            },
          },
        );

        if (stripeError) {
          throw new Error(stripeError.message || "Payment failed");
        }

        router.push({
          pathname: "/(modals)/request/payment-success",
          params: {
            orderUid: postId,
            clearRequestDraft:
              clearRequestDraft === "true" ? "true" : undefined,
          },
        });
      } else {
        throw new Error("Unable to retrieve payment client secret.");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to complete payment.",
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          paddingTop: getTopSafeAreaInset(insets.top),
        },
      ]}
    >
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
        <Text style={styles.headerTitle}>Checkout & Payment</Text>
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
        {hasFailed ? (
          <View style={styles.errorBanner}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={40}
              color={theme.colors.error}
              style={styles.errorBannerIcon}
            />
            <View style={styles.errorBannerTextContainer}>
              <Text style={styles.errorBannerTitle}>Payment Failed</Text>
              <Text style={styles.errorBannerText}>
                We couldn't process your payment.
              </Text>
              <Text style={styles.errorBannerText}>
                No charges were made to your card.
              </Text>
            </View>
            <TouchableOpacity onPress={() => setHasSubmitted(false)}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        <CheckoutOrderOverview
          itemCount={items.length}
          storeName={storeName}
          storeLogoText={storeLogoText}
          storeLogoSubText={storeLogoSubText}
          routeText={routeText}
          neededBy={requestData.dayNeeded}
          subtotal={subtotal}
          serviceFee={serviceFee}
          taxes={taxes}
          total={total}
        />

        <CheckoutPaymentForm
          nameOnCard={nameOnCard}
          onChangeName={setNameOnCard}
          onCardValidityChange={setIsFormValid}
          isFormValid={isFormValid}
          hasFailed={hasFailed}
          isInitializing={isInitializing}
          total={total}
          onPay={handlePay}
          onReset={() => setHasSubmitted(false)}
        />
      </ScrollView>
    </View>
  );
}

function formatProvince(province?: string | { name: string }) {
  const name = typeof province === "string" ? province : province?.name;
  return name ? `, ${name}` : "";
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    flex: 1,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationBadge: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.surface,
    borderRadius: 10,
    borderWidth: 2,
    height: 18,
    justifyContent: "center",
    position: "absolute",
    right: -4,
    top: -4,
    width: 18,
  },
  notificationText: {
    color: theme.colors.surface,
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  errorBanner: {
    alignItems: "flex-start",
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  errorBannerIcon: {
    marginRight: theme.spacing.sm,
  },
  errorBannerTextContainer: {
    flex: 1,
  },
  errorBannerTitle: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  errorBannerText: {
    color: theme.colors.primary,
    fontSize: 13,
  },
}));
