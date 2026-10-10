import React, { createContext, useContext, useState, ReactNode } from "react";
import type { CreateRequestPayload, RequestItem } from "../types/request";

interface RequestCreationContextType {
  requestData: Partial<CreateRequestPayload>;
  updateRequestData: (data: Partial<CreateRequestPayload>) => void;
  tripOrderConversation: TripOrderConversationData | null;
  setTripOrderConversation: (data: TripOrderConversationData | null) => void;
  resetRequestData: () => void;
}

export interface TripOrderConversationData {
  orderUid: string;
  tripUid: string;
  driverUid: string;
  items: RequestItem[];
  total: string;
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

  const updateRequestData = (newData: Partial<CreateRequestPayload>) => {
    setRequestData((prev) => ({ ...prev, ...newData }));
  };

  const resetRequestData = () => {
    setTripOrderConversation(null);
    setRequestData({
      stores: [],
      deliveryAddress: "",
      deliveryCityUid: "",
      itemsInstructions: "",
      dayNeeded: "",
      latestDeliveryTime: "",
      items: [],
    });
  };

  return (
    <RequestCreationContext.Provider
      value={{
        requestData,
        updateRequestData,
        tripOrderConversation,
        setTripOrderConversation,
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
