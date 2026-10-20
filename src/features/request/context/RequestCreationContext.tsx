import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import type { CreateRequestPayload, RequestItem } from "../types/request";

interface RequestCreationContextType {
  requestData: Partial<CreateRequestPayload>;
  updateRequestData: (data: Partial<CreateRequestPayload>) => void;
  tripOrderConversation: TripOrderConversationData | null;
  setTripOrderConversation: (data: TripOrderConversationData | null) => void;
  checkoutPayment: { requestUid: string; clientSecret: string } | null;
  setCheckoutPayment: (
    payment: { requestUid: string; clientSecret: string } | null,
  ) => void;
  resetRequestData: () => void;
}

export interface TripOrderConversationData {
  orderUid: string;
  tripUid: string;
  driverUid: string;
  items: RequestItem[];
  total: string;
  itemSubtotal?: string;
  serviceFee?: string;
  driverFee?: string;
  platformFee?: string;
  tax?: string;
  notes: string;
  neededBy: string;
  latestDeliveryBy: string;
  storeNames: string[];
  origin: string;
  destination: string;
  deliveryCity: string;
  deliveryProvince: string;
}

const RequestCreationContext = createContext<RequestCreationContextType | undefined>(
  undefined,
);

export function RequestCreationProvider({ children }: { children: ReactNode }) {
  const [requestData, setRequestData] = useState<Partial<CreateRequestPayload>>({
    stores: [],
    deliveryAddress: "",
    deliveryCityUid: "",
    itemsInstructions: "",
    dayNeeded: "",
    latestDeliveryTime: "",
    items: [],
  });
  const [tripOrderConversation, setTripOrderConversation] =
    useState<TripOrderConversationData | null>(null);
  const [checkoutPayment, setCheckoutPayment] = useState<{
    requestUid: string;
    clientSecret: string;
  } | null>(null);

  const updateRequestData = (newData: Partial<CreateRequestPayload>) => {
    setRequestData((prev) => ({ ...prev, ...newData }));
  };

  const resetRequestData = useCallback(() => {
    setTripOrderConversation(null);
    setCheckoutPayment(null);
    setRequestData({
      stores: [],
      deliveryAddress: "",
      deliveryCityUid: "",
      itemsInstructions: "",
      dayNeeded: "",
      latestDeliveryTime: "",
      items: [],
    });
  }, []);

  return (
    <RequestCreationContext.Provider
      value={{
        requestData,
        updateRequestData,
        tripOrderConversation,
        setTripOrderConversation,
        checkoutPayment,
        setCheckoutPayment,
        resetRequestData,
      }}
    >
      {children}
    </RequestCreationContext.Provider>
  );
}

export function useRequestCreation() {
  const context = useContext(RequestCreationContext);
  if (context === undefined) {
    throw new Error(
      "useRequestCreation must be used within a RequestCreationProvider",
    );
  }
  return context;
}
