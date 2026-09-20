import React, { createContext, useContext, useState, ReactNode } from "react";
import type { CreateRequestPayload } from "../types/request";

interface RequestCreationContextType {
  requestData: Partial<CreateRequestPayload>;
  updateRequestData: (data: Partial<CreateRequestPayload>) => void;
  resetRequestData: () => void;
}

const RequestCreationContext = createContext<RequestCreationContextType | undefined>(
  undefined,
);

export function RequestCreationProvider({ children }: { children: ReactNode }) {
  const [requestData, setRequestData] = useState<Partial<CreateRequestPayload>>({
    stores: [],
    deliveryAddress: "",
    itemsInstructions: "",
    dayNeeded: "",
    latestDeliveryTime: "",
    items: [],
  });

  const updateRequestData = (newData: Partial<CreateRequestPayload>) => {
    setRequestData((prev) => ({ ...prev, ...newData }));
  };

  const resetRequestData = () => {
    setRequestData({
      stores: [],
      deliveryAddress: "",
      itemsInstructions: "",
      dayNeeded: "",
      latestDeliveryTime: "",
      items: [],
    });
  };

  return (
    <RequestCreationContext.Provider
      value={{ requestData, updateRequestData, resetRequestData }}
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
