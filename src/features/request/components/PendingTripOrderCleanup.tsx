import { useEffect, useRef } from "react";
import { usePathname } from "expo-router";

import { useToast } from "../../../shared/components/ToastProvider";
import { getAuthSession } from "../../auth/services/authStorage";
import { getRequestDetails } from "../services/request.service";
import { requestService } from "../services/request.service";
import {
  listPendingTripOrders,
  untrackPendingTripOrder,
} from "../services/pendingTripOrderStorage";

const PAYMENT_WEBHOOK_GRACE_PERIOD_MS = 15_000;
const cleanupAttempts = new Set<string>();

export function PendingTripOrderCleanup() {
  const pathname = usePathname();
  const { showToast } = useToast();
  const hasLoadedPendingOrders = useRef(false);
  const isLoadingPendingOrders = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      hasLoadedPendingOrders.current ||
      isLoadingPendingOrders.current
    ) {
      return;
    }

    isLoadingPendingOrders.current = true;
    void (async () => {
      const session = await getAuthSession();
      if (!session || !isMounted.current) {
        isLoadingPendingOrders.current = false;
        return;
      }

      const pendingOrders = await listPendingTripOrders();
      hasLoadedPendingOrders.current = true;
      isLoadingPendingOrders.current = false;
      setTimeout(() => {
        void cleanupAbandonedOrders(
          pendingOrders,
          () => isMounted.current,
          showToast,
        );
      }, PAYMENT_WEBHOOK_GRACE_PERIOD_MS);
    })().catch((error: unknown) => {
      isLoadingPendingOrders.current = false;
      if (isMounted.current) {
        showToast(
          error instanceof Error
            ? error.message
            : "Unable to check for unpaid trip orders.",
          { title: "Order cleanup failed", variant: "error" },
        );
      }
    });
  }, [pathname, showToast]);

  return null;
}

async function cleanupAbandonedOrders(
  pendingOrders: Awaited<ReturnType<typeof listPendingTripOrders>>,
  isMounted: () => boolean,
  showToast: ReturnType<typeof useToast>["showToast"],
) {
  try {
    const session = await getAuthSession();
    if (!session || !isMounted()) return;

    for (const order of pendingOrders) {
      if (cleanupAttempts.has(order.uid)) continue;
      cleanupAttempts.add(order.uid);

      try {
        const details = await getRequestDetails(order.uid);
        if (!isMounted()) return;

        if (details.status.toLowerCase() === "pending") {
          await requestService.cancelTripOrder(order.uid);
          showToast("An unpaid trip order was discarded.", {
            title: "Unpaid order cancelled",
            variant: "info",
          });
        }
        await untrackPendingTripOrder(order.uid);
      } catch (error) {
        cleanupAttempts.delete(order.uid);
        if (isMounted()) {
          showToast(
            error instanceof Error
              ? `Unable to discard an unpaid trip order: ${error.message}`
              : "Unable to discard an unpaid trip order. Please try again.",
            { title: "Order cleanup failed", variant: "error" },
          );
        }
      }
    }
  } catch (error) {
    if (isMounted()) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to check for unpaid trip orders.",
        { title: "Order cleanup failed", variant: "error" },
      );
    }
  }
}
