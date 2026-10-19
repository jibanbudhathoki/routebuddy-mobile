import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStripe, initStripe } from "@stripe/stripe-react-native";
import { paymentMethodsService } from "../services/paymentMethods.service";
import {
  PaymentMethodItem,
  AddPaymentMethodInput,
} from "../types/paymentMethod.types";
import { useToast } from "../../../shared/components/ToastProvider";

const PAYMENT_METHODS_QUERY_KEY = ["paymentMethods"];

export function usePaymentMethods() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { confirmSetupIntent } = useStripe();

  const [selectedMethodForMenu, setSelectedMethodForMenu] =
    useState<PaymentMethodItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: paymentMethods = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEY,
    queryFn: paymentMethodsService.getPaymentMethods,
  });

  const defaultPaymentMethod = paymentMethods.find((pm) => pm.isDefault);
  const savedPaymentMethods = paymentMethods.filter((pm) => !pm.isDefault);

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => {
      await paymentMethodsService.setDefaultPaymentMethod(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
      showToast("Default payment method updated successfully.", {
        title: "Default updated",
        variant: "success",
      });
      setSelectedMethodForMenu(null);
    },
    onError: (err: any) => {
      showToast(err?.message || "Failed to update default payment method.", {
        title: "Error",
        variant: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await paymentMethodsService.deletePaymentMethod(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
      showToast("Payment method removed successfully.", {
        title: "Removed",
        variant: "success",
      });
      setSelectedMethodForMenu(null);
    },
    onError: (err: any) => {
      showToast(err?.message || "Failed to remove payment method.", {
        title: "Error",
        variant: "error",
      });
    },
  });

  const addMutation = useMutation({
    mutationFn: async (input: AddPaymentMethodInput) => {
      try {
        // 1. Request SetupIntent from backend API: POST /v1/payments/methods/setup-intent
        const setupIntentRes = await paymentMethodsService.createSetupIntent();
        if (!setupIntentRes?.clientSecret) {
          throw new Error("Unable to retrieve payment setup token.");
        }

        // If backend provides publishableKey dynamically in SetupIntent response, re-init Stripe SDK
        const backendPublishableKey =
          setupIntentRes.publishableKey || setupIntentRes.stripePublishableKey;
        if (backendPublishableKey) {
          await initStripe({
            publishableKey: backendPublishableKey,
          });
        }

        // 2. Confirm SetupIntent via Stripe Native SDK
        const { setupIntent, error: stripeError } = await confirmSetupIntent(
          setupIntentRes.clientSecret,
          {
            paymentMethodType: "Card",
            paymentMethodData: {
              billingDetails: {
                name: input.holderName,
              },
            },
          },
        );

        if (stripeError) {
          throw new Error(stripeError.message || "Failed to save card with Stripe.");
        }

        return setupIntent;
      } catch (err: any) {
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
      showToast("New card added successfully.", {
        title: "Card Added",
        variant: "success",
      });
      setIsAddModalOpen(false);
    },
    onError: (err: any) => {
      showToast(err?.message || "Failed to add payment method.", {
        title: "Error",
        variant: "error",
      });
    },
  });

  const openMenu = useCallback((item: PaymentMethodItem) => {
    setSelectedMethodForMenu(item);
  }, []);

  const closeMenu = useCallback(() => {
    setSelectedMethodForMenu(null);
  }, []);

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  return {
    paymentMethods,
    defaultPaymentMethod,
    savedPaymentMethods,
    isLoading,
    refetch,
    selectedMethodForMenu,
    openMenu,
    closeMenu,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    setDefault: setDefaultMutation.mutateAsync,
    deletePaymentMethod: deleteMutation.mutateAsync,
    addPaymentMethod: addMutation.mutateAsync,
    isSubmitting:
      addMutation.isPending ||
      setDefaultMutation.isPending ||
      deleteMutation.isPending,
  };
}
